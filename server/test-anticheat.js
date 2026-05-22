const { io } = require('socket.io-client');

const SERVER_URL = 'http://localhost:3001';
const USER_ID = 'bbbbbbbb-0000-0000-0000-000000000002';

const CONNECT_TIMEOUT_MS = 8000;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function connectAndAuthenticate() {
  return new Promise((resolve, reject) => {
    const socket = io(SERVER_URL, {
      transports: ['websocket'],
      timeout: CONNECT_TIMEOUT_MS,
      reconnection: false,
    });

    const connectTimeout = setTimeout(() => {
      cleanup();
      reject(new Error(`Baglanti/auth timeout (${CONNECT_TIMEOUT_MS}ms)`));
    }, CONNECT_TIMEOUT_MS + 1500);

    const onConnect = () => {
      console.log(`[SOCKET] baglandi. socketId=${socket.id}`);
      socket.emit('authenticate', { userId: USER_ID });
    };

    const onAuthenticated = (payload) => {
      console.log('[SOCKET] authenticate OK:', payload);
      clearTimeout(connectTimeout);
      cleanup();
      resolve(socket);
    };

    const onAuthError = (payload) => {
      clearTimeout(connectTimeout);
      cleanup();
      reject(new Error(`auth_error: ${JSON.stringify(payload)}`));
    };

    const onConnectError = (err) => {
      clearTimeout(connectTimeout);
      cleanup();
      reject(new Error(`connect_error: ${err.message}`));
    };

    const onError = (err) => {
      clearTimeout(connectTimeout);
      cleanup();
      reject(new Error(`error: ${err?.message || err}`));
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
  let socket;

  try {
    console.log('Anti-cheat testi basliyor...');

    socket = await connectAndAuthenticate();

    socket.on('location_rejected', (payload) => {
      console.log('🚫 KONUM REDDEDILDI:', payload);
    });

    socket.on('opponent_moved', (payload) => {
      console.log('✅ KONUM KABUL:', payload);
    });

    await wait(1000);

    const firstLocation = {
      lat: 36.8969,
      lng: 30.7133,
      timestamp: Date.now(),
    };

    console.log('[TEST] Ilk (gecerli) location_update gonderiliyor:', firstLocation);
    socket.emit('location_update', firstLocation);

    await wait(1000);

    const secondLocation = {
      lat: 36.9869,
      lng: 30.7133,
      timestamp: Date.now(),
    };

    console.log('[TEST] Ikinci (imkansiz) location_update gonderiliyor:', secondLocation);
    socket.emit('location_update', secondLocation);

    await wait(2000);

    console.log('Baglanti kapatiliyor...');
    socket.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Test hatasi:', err?.message || err);

    if (socket) {
      socket.disconnect();
    }

    process.exit(1);
  }
}

main();
