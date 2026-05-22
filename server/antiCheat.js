const MAX_SPEED_KMH = 40;

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}

function haversineDistanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Dunya yaricapi (metre)
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function checkSpeed(lastPoint, newPoint) {
  if (!lastPoint) {
    return { valid: true };
  }

  const distanceMeters = haversineDistanceMeters(
    Number(lastPoint.lat),
    Number(lastPoint.lng),
    Number(newPoint.lat),
    Number(newPoint.lng)
  );

  const deltaMs = Number(newPoint.timestamp) - Number(lastPoint.timestamp);

  // Gecersiz veya sifir surede hiz hesaplanamaz; sahte/bozuk veri olarak reddet.
  if (!Number.isFinite(deltaMs) || deltaMs <= 0) {
    return { valid: false, reason: 'invalid_timestamp', speed: Infinity };
  }

  const deltaHours = deltaMs / (1000 * 60 * 60);
  const speedKmh = distanceMeters / 1000 / deltaHours;

  if (speedKmh > MAX_SPEED_KMH) {
    return { valid: false, reason: 'too_fast', speed: speedKmh };
  }

  return { valid: true, speed: speedKmh };
}

module.exports = {
  checkSpeed,
  haversineDistanceMeters,
};
