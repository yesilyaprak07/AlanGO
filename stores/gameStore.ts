import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import polygonClipping from "polygon-clipping";
import { supabase } from "@/lib/supabase";

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface Territory {
  id: string;
  polygon: LatLng[];
  area: number; // m²
  distance: number; // meters
  duration: number; // seconds
  createdAt: number; // timestamp
  color: string;
}

/** Shoelace formula with equirectangular projection → area in m² */
export function computePolygonArea(polygon: LatLng[]): number {
  if (polygon.length < 3) return 0;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 6371000;
  const refLat = polygon.reduce((s, p) => s + p.latitude, 0) / polygon.length;
  const cosLat = Math.cos(toRad(refLat));

  let area = 0;
  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    const xi = toRad(polygon[i].longitude) * cosLat * R;
    const yi = toRad(polygon[i].latitude) * R;
    const xj = toRad(polygon[j].longitude) * cosLat * R;
    const yj = toRad(polygon[j].latitude) * R;
    area += xi * yj - xj * yi;
  }
  return Math.abs(area) / 2;
}

/** Convert LatLng[] to polygon-clipping Ring format [lng, lat][] */
function toRing(polygon: LatLng[]): [number, number][] {
  const ring = polygon.map((p): [number, number] => [p.longitude, p.latitude]);
  // Ensure ring is closed
  if (ring.length > 0) {
    const first = ring[0];
    const last = ring[ring.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      ring.push([first[0], first[1]]);
    }
  }
  return ring;
}

/** Convert polygon-clipping Ring back to LatLng[] */
function fromRing(ring: [number, number][]): LatLng[] {
  // Remove closing point if present
  const points = ring.length > 1 &&
    ring[0][0] === ring[ring.length - 1][0] &&
    ring[0][1] === ring[ring.length - 1][1]
    ? ring.slice(0, -1)
    : ring;
  return points.map((p) => ({ latitude: p[1], longitude: p[0] }));
}

/** Merge overlapping territories, return merged list */
function mergeOverlapping(territories: Territory[], newTerritory: Territory): Territory[] {
  const newRing = toRing(newTerritory.polygon);
  let mergedPolygon: [number, number][][] = [newRing];
  const nonOverlapping: Territory[] = [];
  let totalDistance = newTerritory.distance;
  let totalDuration = newTerritory.duration;
  let earliestCreatedAt = newTerritory.createdAt;

  for (const t of territories) {
    const existingRing = toRing(t.polygon);
    try {
      const result = polygonClipping.intersection([mergedPolygon[0]], [existingRing]);
      if (result.length > 0) {
        // Overlaps — union them
        const unionResult = polygonClipping.union([mergedPolygon[0]], [existingRing]);
        if (unionResult.length > 0 && unionResult[0].length > 0) {
          mergedPolygon = [unionResult[0][0]]; // Take outer ring of first polygon
        }
        totalDistance += t.distance;
        totalDuration += t.duration;
        earliestCreatedAt = Math.min(earliestCreatedAt, t.createdAt);
      } else {
        nonOverlapping.push(t);
      }
    } catch {
      // If clipping fails, keep separate
      nonOverlapping.push(t);
    }
  }

  const mergedLatLng = fromRing(mergedPolygon[0]);
  const mergedTerritory: Territory = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    polygon: mergedLatLng,
    area: computePolygonArea(mergedLatLng),
    distance: totalDistance,
    duration: totalDuration,
    createdAt: earliestCreatedAt,
    color: "rgba(0, 240, 255, 0.25)",
  };

  return [...nonOverlapping, mergedTerritory];
}

const STORAGE_KEY = "alango_territories";

interface GameState {
  territories: Territory[];
  // Last run result (passed from active-game to result screen)
  lastRun: {
    polygon: LatLng[];
    area: number;
    distance: number;
    duration: number;
  } | null;
  totalArea: number;

  addTerritory: (t: Omit<Territory, "id" | "createdAt" | "color">) => void;
  setLastRun: (run: GameState["lastRun"]) => void;
  loadTerritories: () => Promise<void>;
  saveGameSession: (session: { polygon: LatLng[]; area: number; distance: number; duration: number; xpEarned: number; goldEarned: number }) => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  territories: [],
  lastRun: null,
  totalArea: 0,

  addTerritory: (t) => {
    const territory: Territory = {
      ...t,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      createdAt: Date.now(),
      color: "rgba(0, 240, 255, 0.25)",
    };
    const updated = mergeOverlapping(get().territories, territory);
    const totalArea = updated.reduce((s, ter) => s + ter.area, 0);
    set({ territories: updated, totalArea });

    // Save locally
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => {});

    // Sync to Supabase
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const userId = session.user.id;

      // Delete old territories for this user and re-insert merged ones
      await supabase.from("territories").delete().eq("user_id", userId);
      const rows = updated.map((ter) => ({
        user_id: userId,
        polygon: ter.polygon,
        area: ter.area,
        distance: ter.distance,
        duration: ter.duration,
        color: ter.color,
      }));
      if (rows.length > 0) {
        await supabase.from("territories").insert(rows);
      }
    })().catch(() => {});
  },

  setLastRun: (run) => set({ lastRun: run }),

  loadTerritories: async () => {
    // Try loading from Supabase first
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data, error } = await supabase
        .from("territories")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: true });

      if (data && !error && data.length > 0) {
        const territories: Territory[] = data.map((row: any) => ({
          id: row.id,
          polygon: row.polygon as LatLng[],
          area: row.area,
          distance: row.distance,
          duration: row.duration,
          createdAt: new Date(row.created_at).getTime(),
          color: row.color || "rgba(0, 240, 255, 0.25)",
        }));
        const totalArea = territories.reduce((s, t) => s + t.area, 0);
        set({ territories, totalArea });
        // Also cache locally
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(territories)).catch(() => {});
        return;
      }
    }

    // Fallback to local storage
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const territories: Territory[] = JSON.parse(raw);
        const totalArea = territories.reduce((s, t) => s + t.area, 0);
        set({ territories, totalArea });
      }
    } catch {}
  },

  saveGameSession: async (session) => {
    const { data: { session: authSession } } = await supabase.auth.getSession();
    if (!authSession?.user) return;

    const xpEarned = session.xpEarned;
    const goldEarned = session.goldEarned;

    // Save game session record
    await supabase.from("game_sessions").insert({
      user_id: authSession.user.id,
      polygon: session.polygon,
      area: session.area,
      distance: session.distance,
      duration: session.duration,
      xp_earned: xpEarned,
      gold_earned: goldEarned,
    });

    // Update user XP and gold
    const { data: profile } = await supabase
      .from("profiles")
      .select("xp, gold, level")
      .eq("id", authSession.user.id)
      .single();

    if (profile) {
      const newXp = profile.xp + xpEarned;
      const newGold = profile.gold + goldEarned;
      // Level up every 1000 XP
      const newLevel = Math.floor(newXp / 1000) + 1;
      // Rank title based on XP
      let rankTitle = "ÇAYLAK";
      if (newXp >= 50000) rankTitle = "GENERAL";
      else if (newXp >= 25000) rankTitle = "ALBAY";
      else if (newXp >= 10000) rankTitle = "KOMUTAN";
      else if (newXp >= 5000) rankTitle = "YÜZBAŞI";
      else if (newXp >= 2000) rankTitle = "TEĞMEN";
      else if (newXp >= 500) rankTitle = "ÇAVUŞ";

      await supabase.from("profiles").update({
        xp: newXp,
        gold: newGold,
        level: newLevel,
        rank_title: rankTitle,
      }).eq("id", authSession.user.id);
    }
  },
}));
