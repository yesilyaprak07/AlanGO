require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const { supabase } = require('./supabase');
const { checkSpeed, haversineDistanceMeters } = require('./antiCheat');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const PORT = Number(process.env.PORT) || 3001;
const NEARBY_RADIUS_METERS = 3000;

// socketId -> { lat, lng, timestamp }
const lastPointsBySocket = new Map();
// socketId -> userId
const userBySocket = new Map();
// userId -> socketId
const socketByUser = new Map();

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

function isValidLocationPayload(payload) {
  if (!payload) {
    return false;
  }

  const { lat, lng, timestamp } = payload;

  return (
    Number.isFinite(Number(lat)) &&
    Number.isFinite(Number(lng)) &&
    Number.isFinite(Number(timestamp))
  );
}

io.on('connection', (socket) => {
  console.log(`[socket] Baglandi: ${socket.id}`);

  socket.on('authenticate', (payload = {}) => {
    const userId = payload.userId;

    if (!userId) {
      socket.emit('auth_error', { reason: 'missing_user_id' });
      return;
    }

    // Ayni user tekrar baglanirsa son baglanti gecerli kabul edilir.
    const prevSocketId = socketByUser.get(userId);
    if (prevSocketId && prevSocketId !== socket.id) {
      userBySocket.delete(prevSocketId);
      lastPointsBySocket.delete(prevSocketId);
    }

    userBySocket.set(socket.id, userId);
    socketByUser.set(userId, socket.id);

    socket.emit('authenticated', { userId });
  });

  socket.on('location_update', (payload = {}) => {
    const userId = userBySocket.get(socket.id);

    if (!userId) {
      socket.emit('location_rejected', { reason: 'unauthenticated' });
      return;
    }

    if (!isValidLocationPayload(payload)) {
      socket.emit('location_rejected', { reason: 'invalid_payload' });
      return;
    }

    const newPoint = {
      lat: Number(payload.lat),
      lng: Number(payload.lng),
      timestamp: Number(payload.timestamp),
    };

    const lastPoint = lastPointsBySocket.get(socket.id);
    const speedCheck = checkSpeed(lastPoint, newPoint);

    if (!speedCheck.valid) {
      socket.emit('location_rejected', {
        reason: speedCheck.reason || 'invalid_location',
      });
      return;
    }

    lastPointsBySocket.set(socket.id, newPoint);

    // Sadece yakin oyunculara hareket bilgisi gonderilir.
    for (const [otherSocketId, otherPoint] of lastPointsBySocket.entries()) {
      if (otherSocketId === socket.id) {
        continue;
      }

      const distance = haversineDistanceMeters(
        newPoint.lat,
        newPoint.lng,
        Number(otherPoint.lat),
        Number(otherPoint.lng)
      );

      if (distance <= NEARBY_RADIUS_METERS) {
        io.to(otherSocketId).emit('opponent_moved', {
          userId,
          lat: newPoint.lat,
          lng: newPoint.lng,
        });
      }
    }
  });

  socket.on('conquer', async (payload = {}) => {
    const userId = userBySocket.get(socket.id);

    if (!userId) {
      socket.emit('conquer_result', {
        ok: false,
        error: 'unauthenticated',
      });
      return;
    }

    const { geojson, distance, duration } = payload;

    try {
      console.log('[conquer] RPC cagriliyor, userId:', userId);
      const { data, error } = await supabase.rpc('conquer_territory', {
        p_user_id: userId,
        p_geojson: geojson,
        p_distance: distance,
        p_duration: duration,
      });

      if (error) {
        console.log('[conquer] RPC hata:', error);
        socket.emit('conquer_result', {
          ok: false,
          error: error.message || 'rpc_error',
        });
        return;
      }

      console.log('[conquer] RPC basarili, data:', data);

      socket.emit('conquer_result', {
        ok: true,
        result: data,
      });

      const losers = Array.isArray(data?.losers)
        ? data.losers
        : Array.isArray(data)
          ? data
          : [];

      for (const loser of losers) {
        const loserUserId = loser?.user_id ?? loser?.userId;
        if (!loserUserId) {
          continue;
        }

        const loserSocketId = socketByUser.get(loserUserId);
        if (!loserSocketId) {
          continue;
        }

        io.to(loserSocketId).emit('territory_lost', {
          remaining_area: loser?.remaining_area ?? loser?.remainingArea ?? null,
          attacker_id: userId,
        });
      }
    } catch (err) {
      console.error('[conquer] Beklenmeyen hata:', err);
      socket.emit('conquer_result', {
        ok: false,
        error: 'internal_server_error',
      });
    }
  });

  socket.on('disconnect', () => {
    const userId = userBySocket.get(socket.id);

    if (userId) {
      socketByUser.delete(userId);
    }

    userBySocket.delete(socket.id);
    lastPointsBySocket.delete(socket.id);

    console.log(`[socket] Ayrildi: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`AlanGO game server calisiyor: http://localhost:${PORT}`);
});
