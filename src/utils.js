// Haversine distance (meters)
export function haversineMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const toRad = (v) => (v * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// speed in km/h between two indexed points using timestamps
export function calcSpeedKmH(index, points) {
    if (!points || points.length < 2 || index <= 0) return "0.00";
    const a = points[index - 1];
    const b = points[index];
    if (!a.timestamp || !b.timestamp) return "N/A";
    const distKm = haversineMeters(a.lat, a.lng, b.lat, b.lng) / 1000;
    const dtHours = (new Date(b.timestamp) - new Date(a.timestamp)) / (1000 * 60 * 60);
    if (dtHours <= 0) return "N/A";
    return (distKm / dtHours).toFixed(2);
}
