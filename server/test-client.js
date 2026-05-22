const { io } = require('socket.io-client');

const SERVER_URL = 'http://localhost:3001';
const RAKIP_USER_ID = 'aaaaaaaa-0000-0000-0000-000000000001';
const OYUNCU_USER_ID = 'bbbbbbbb-0000-0000-0000-000000000002';

const CONNECT_TIMEOUT_MS = 8000;
const RESULT_TIMEOUT_MS = 15000;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout(promise, timeoutMs, label) {
  let timeoutId;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`${label} timeout (${timeoutMs}ms)`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timeoutId);
  });
}

function connectAndAuthenticate(label, userId) {
  return new Promise((resolve, reject) => {
    const socket = io(SERVER_URL, {
      transports: ['websocket'],
      timeout: CONNECT_TIMEOUT_MS,
      reconnection: false,
    });

    const onConnect = () => {
      console.log(`[${label}] baglandi. socketId=${socket.id}`);
      socket.emit('authenticate', { userId });
    };

    const onAuthenticated = (payload) => {
      console.log(`[${label}] authenticate OK:`, payload);
      cleanup();
      resolve(socket);
    };

    const onAuthError = (payload) => {
      cleanup();
      reject(new Error(`[${label}] auth_error: ${JSON.stringify(payload)}`));
    };

    const onConnectError = (err) => {
      cleanup();
      reject(new Error(`[${label}] connect_error: ${err.message}`));
    };

    const onError = (err) => {
      cleanup();
      reject(new Error(`[${label}] error: ${err?.message || err}`));
    };

    const cleanup = () => {
      socket.off('connect', onConnect);
      socket.off('authenticated', onAuthenticated);
      socket.off('auth_error', onAuthError);
      socket.off('connect_error', onConnectError);
      socket.off('error', onError);
    };

    socket.on('connect', onConnect);
    socket.on('authenticated', onAuthenticated);
    socket.on('auth_error', onAuthError);
    socket.on('connect_error', onConnectError);
    socket.on('error', onError);
  });
}

async function main() {
  let rakipSocket;
  let oyuncuSocket;

  try {
    console.log('Test basliyor...');

    rakipSocket = await withTimeout(
      connectAndAuthenticate('RAKIP', RAKIP_USER_ID),
      CONNECT_TIMEOUT_MS + 2000,
      'RAKIP baglanti'
    );

    oyuncuSocket = await withTimeout(
      connectAndAuthenticate('OYUNCU', OYUNCU_USER_ID),
      CONNECT_TIMEOUT_MS + 2000,
      'OYUNCU baglanti'
    );

    // RAKIP territory_lost dinleyicisi
    rakipSocket.on('territory_lost', (payload) => {
      console.log('🔴 RAKIP TOPRAK KAYBETTI:', payload);
    });

    // OYUNCU conquer_result dinleyicisi
    const conquerResultPromise = new Promise((resolve) => {
      oyuncuSocket.once('conquer_result', (payload) => {
        console.log('🟢 FETIH SONUCU:', payload);
        resolve(payload);
      });
    });

    await wait(1000);

    const polygonGeoJson = {
      type: 'Polygon',
      coordinates: [
        [
          [30.70056, 36.89],
          [30.7018, 36.89],
          [30.7018, 36.8909],
          [30.70056, 36.8909],
          [30.70056, 36.89],
        ],
      ],
    };

    const conquerPayload = {
      geojson: JSON.stringify(polygonGeoJson),
      distance: 1500,
      duration: 600,
    };

    console.log('[OYUNCU] conquer gonderiliyor:', conquerPayload);
    oyuncuSocket.emit('conquer', conquerPayload);

    await withTimeout(conquerResultPromise, RESULT_TIMEOUT_MS, 'conquer_result');

    await wait(2000);

    console.log('Baglantilar kapatiliyor...');
    rakipSocket.disconnect();
    oyuncuSocket.disconnect();

    process.exit(0);
  } catch (err) {
    console.error('Test hatasi:', err?.message || err);

    if (rakipSocket) {
      rakipSocket.disconnect();
    }

    if (oyuncuSocket) {
      oyuncuSocket.disconnect();
    }

    process.exit(1);
  }
}

main();
