function calculateDistance(latA, lngA, latB, lngB) {
  // http://www.movable-type.co.uk/scripts/latlong.html
  const lat1 = latA;
  const lon1 = lngA;

  const lat2 = latB;
  const lon2 = lngB;

  const R = 6371e3; // earth radius in meters
  const φ1 = lat1 * (Math.PI / 180);
  const φ2 = lat2 * (Math.PI / 180);
  const Δφ = (lat2 - lat1) * (Math.PI / 180);
  const Δλ = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * (Math.sin(Δλ / 2) * Math.sin(Δλ / 2));

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = Math.abs((R * c) / 1000);

  return distance; // in meters
}
export default calculateDistance;
