import { io, Socket } from "socket.io-client";

type LocationUpdatePayload = {
  lat: number;
  lng: number;
  timestamp: number;
};

type ConquerPayload = {
  geojson: string;
  distance: number;
  duration: number;
};

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL;

let authUserId: string | null = null;

const socket: Socket | null = SOCKET_URL
  ? io(SOCKET_URL, {
      autoConnect: false,
    })
  : null;

if (!SOCKET_URL) {
  console.log("[socket] EXPO_PUBLIC_SOCKET_URL tanimli degil. Socket ozellikleri devre disi.");
}

socket?.on("connect", () => {
  console.log("[socket] Baglandi:", socket.id);

  if (authUserId) {
    socket.emit("authenticate", { userId: authUserId });
    console.log("[socket] Kimlik dogrulama gonderildi:", authUserId);
  }
});

socket?.on("disconnect", (reason) => {
  console.log("[socket] Baglanti kesildi:", reason);
});

socket?.on("connect_error", (error) => {
  console.log("[socket] Baglanti hatasi:", error.message);
});

export function connectSocket(userId: string): void {
  if (!socket) {
    return;
  }

  const normalizedUserId = userId.trim();

  if (!normalizedUserId) {
    console.log("[socket] Gecersiz userId, baglanti acilmadi.");
    return;
  }

  authUserId = normalizedUserId;

  if (socket.connected) {
    socket.emit("authenticate", { userId: authUserId });
    console.log("[socket] Zaten bagli, kimlik dogrulama yenilendi:", authUserId);
    return;
  }

  if (!socket.active) {
    console.log("[socket] Baglanti baslatiliyor...");
    socket.connect();
  }
}

export function disconnectSocket(): void {
  if (!socket) {
    authUserId = null;
    return;
  }

  authUserId = null;

  if (socket.connected || socket.active) {
    socket.disconnect();
  }
}

export function getSocket(): Socket | null {
  return socket;
}

export function sendLocationUpdate(lat: number, lng: number): void {
  if (!socket) {
    return;
  }

  const payload: LocationUpdatePayload = {
    lat,
    lng,
    timestamp: Date.now(),
  };

  if (!socket.connected) {
    console.log("[socket] Konum gonderilemedi, baglanti yok.");
    return;
  }

  socket.emit("location_update", payload);
}

export function sendConquer(geojson: string, distance: number, duration: number): void {
  if (!socket) {
    return;
  }

  const payload: ConquerPayload = {
    geojson,
    distance,
    duration,
  };

  if (!socket.connected) {
    console.log("[socket] Fetih gonderilemedi, baglanti yok.");
    return;
  }

  socket.emit("conquer", payload);
}
