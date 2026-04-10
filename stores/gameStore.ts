import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    const updated = [...get().territories, territory];
    const totalArea = updated.reduce((s, ter) => s + ter.area, 0);
    set({ territories: updated, totalArea });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => {});
  },

  setLastRun: (run) => set({ lastRun: run }),

  loadTerritories: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const territories: Territory[] = JSON.parse(raw);
        const totalArea = territories.reduce((s, t) => s + t.area, 0);
        set({ territories, totalArea });
      }
    } catch {}
  },
}));
