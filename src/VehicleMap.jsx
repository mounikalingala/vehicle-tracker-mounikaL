import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import InfoCard from "./components/InfoCard";
import Controls from "./components/Controls";
import { haversineMeters, calcSpeedKmH } from "./utils";

// emoji marker
const carIcon = L.divIcon({
    className: "",
    html: '<div style="transform: translate(-50%, -50%); font-size:24px;">🚙</div>',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
});

function FitToBounds({ coords }) {
    const map = useMap();
    useEffect(() => {
        if (!coords || coords.length === 0) return;
        map.fitBounds(coords.map((p) => [p.lat, p.lng]), { padding: [80, 80] });
    }, [coords, map]);
    return null;
}

export default function VehicleMap() {
    const [route, setRoute] = useState([]); // {lat,lng,timestamp}
    const [playing, setPlaying] = useState(false);
    const [configureOpen, setConfigureOpen] = useState(true);
    const [showInfo, setShowInfo] = useState(false);
    const [progress, setProgress] = useState(0); // 0..1 across route
    const rafRef = useRef(null);
    const segRef = useRef({ from: 0, to: 1, t: 0 });
    const animPos = useRef({ lat: null, lng: null });
    const markerRef = useRef(null);
    const [speedMultiplier, setSpeedMultiplier] = useState(1);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [day, setDay] = useState("today");
    const [areaName, setAreaName] = useState("Fetching...");

    useEffect(() => {
        const load = async () => {
            try {
                const r = await fetch("/dummy-route.json");
                const j = await r.json();
                const transformed = j.map((p) => ({ lat: p.latitude, lng: p.longitude, timestamp: p.timestamp }));
                setRoute(transformed);
                setCurrentIndex(0);

            } catch (e) {
                console.error("load route failed", e);
            }
        };
        load();
    }, []);

    useEffect(() => {
        if (!animPos.current?.lat || !animPos.current?.lng) return;

        const fetchArea = async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${animPos.current.lat}&lon=${animPos.current.lng}`
                );
                const data = await response.json();

                if (data && data.display_name) {
                    // Take only first 2 parts for clean display
                    const shortName = data.display_name.split(",").slice(0, 2).join(", ");
                    setAreaName(shortName);
                } else {
                    setAreaName("Unknown Area");
                }
            } catch (error) {
                console.error("Failed to fetch area:", error);
                setAreaName("Unavailable");
            }
        };

        fetchArea();
    }, [animPos.current?.lat, animPos.current?.lng]);

    // precompute total meters
    const totalMeters = route.reduce((acc, p, i) => {
        if (i === 0) return 0;
        const prev = route[i - 1];
        return acc + haversineMeters(prev.lat, prev.lng, p.lat, p.lng);
    }, 0);

    const setMarkerLatLng = (lat, lng) => {
        animPos.current = { lat, lng };
        if (markerRef.current && markerRef.current.setLatLng) {
            markerRef.current.setLatLng([lat, lng]);
        }
    };

    // interpolation animation
    useEffect(() => {
        if (!route || route.length < 2) return;
        let lastTime = null;

        const step = (now) => {
            if (!lastTime) lastTime = now;
            const dt = now - lastTime;
            lastTime = now;

            if (!playing) {
                const p = route[currentIndex];
                if (p) setMarkerLatLng(p.lat, p.lng);
                if (rafRef.current) {
                    // still continue RAF to keep UI responsive for seek; don't advance segments
                    rafRef.current = requestAnimationFrame(step);
                }
                return;
            }

            let { from, to, t } = segRef.current;
            const nextTo = Math.min(route.length - 1, from + 1);
            if (to !== nextTo) {
                from = segRef.current.from = Math.min(route.length - 2, currentIndex);
                to = segRef.current.to = from + 1;
                t = segRef.current.t = 0;
            }

            const A = route[from];
            const B = route[to];
            if (!A || !B) {
                cancelAnimationFrame(rafRef.current);
                return;
            }

            const baseMs = (() => {
                if (A.timestamp && B.timestamp) {
                    const delta = new Date(B.timestamp) - new Date(A.timestamp);
                    return Math.max(200, delta);
                }
                return 3000;
            })();

            const segDuration = baseMs / Math.max(0.1, speedMultiplier);
            t += dt / segDuration;
            if (t > 1) t = 1;

            const lat = A.lat + (B.lat - A.lat) * t;
            const lng = A.lng + (B.lng - A.lng) * t;
            setMarkerLatLng(lat, lng);

            // compute meters covered
            const coveredToFromMeters = route.slice(1, from + 1).reduce((sum, p, idx) => {
                const prev = route[idx];
                return sum + haversineMeters(prev.lat, prev.lng, p.lat, p.lng);
            }, 0);
            const segMeters = haversineMeters(A.lat, A.lng, B.lat, B.lng);
            const covered = coveredToFromMeters + segMeters * t;
            setProgress(totalMeters > 0 ? covered / totalMeters : 0);

            if (t >= 1 - 1e-6) {
                const newIndex = Math.min(route.length - 1, to);
                setCurrentIndex(newIndex);
                segRef.current = { from: newIndex, to: Math.min(route.length - 1, newIndex + 1), t: 0 };
            } else {
                segRef.current.t = t;
            }

            rafRef.current = requestAnimationFrame(step);
        };

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(step);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        };
    }, [playing, route, speedMultiplier, currentIndex, totalMeters]);

    useEffect(() => {
        if (route.length > 0) {
            const p = route[0];
            setMarkerLatLng(p.lat, p.lng);
            segRef.current = { from: 0, to: route.length > 1 ? 1 : 0, t: 0 };
            setProgress(0);
        }
    }, [route]);

    const onTogglePlay = () => {
        if (`currentIndex` >= route.length - 1) {
            setCurrentIndex(0);
            segRef.current = { from: 0, to: route.length > 1 ? 1 : 0, t: 0 };
            setProgress(0);
            const p = route[0];
            if (p) setMarkerLatLng(p.lat, p.lng);
        }
        setPlaying((p) => !p);
    };

    const onReset = () => {
        setPlaying(false);
        setCurrentIndex(0);
        segRef.current = { from: 0, to: route.length > 1 ? 1 : 0, t: 0 };
        setProgress(0);
        if (route[0]) setMarkerLatLng(route[0].lat, route[0].lng);
    };

    const onSeek = (frac) => {
        if (!route || route.length < 2) return;
        const targetMeters = frac * totalMeters;
        let acc = 0;
        for (let i = 1; i < route.length; i++) {
            const prev = route[i - 1];
            const cur = route[i];
            const seg = haversineMeters(prev.lat, prev.lng, cur.lat, cur.lng);
            if (acc + seg >= targetMeters) {
                const remain = targetMeters - acc;
                const localT = seg > 0 ? remain / seg : 0;
                const lat = prev.lat + (cur.lat - prev.lat) * localT;
                const lng = prev.lng + (cur.lng - prev.lng) * localT;
                setMarkerLatLng(lat, lng);
                setCurrentIndex(i);
                segRef.current = { from: i - 1, to: i, t: localT };
                setProgress(frac);
                setPlaying(false);
                return;
            }
            acc += seg;
        }
        const last = route[route.length - 1];
        setMarkerLatLng(last.lat, last.lng);
        setCurrentIndex(route.length - 1);
        segRef.current = { from: route.length - 1, to: route.length - 1, t: 1 };
        setProgress(1);
    };

    const currentPoint = route.length ? route[currentIndex] : null;
    const speedText = calcSpeedKmH(currentIndex, route);

    return (
        <div className="relative w-full h-[calc(100vh-80px)] md:h-[calc(100vh-80px)]">
            <MapContainer center={[route[0]?.lat ?? 20.0, route[0]?.lng ?? 73.78]} zoom={15} scrollWheelZoom className="h-full w-full z-0">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
                {route.length > 0 && <FitToBounds coords={route} />}

                {/* Full route (drawn before moving) */}
                {route.length > 1 && (
                    <Polyline positions={route.map((p) => [p.lat, p.lng])} pathOptions={{ color: "oklch(52.7% 0.154 150.069)", weight: 3, opacity: 0.6 }} />
                )}



                {/* traveled path (green) */}
                {route.length > 0 && (
                    <Polyline
                        positions={route.slice(0, currentIndex + 1).map((p) => [p.lat, p.lng])}
                        pathOptions={{ color: "oklch(44.8% 0.119 151.328)", weight: 4, opacity: 0.95 }}
                    />
                )}

                {/* vehicle marker */}
                <Marker
                    position={[animPos.current.lat ?? route[0]?.lat ?? 20.0, animPos.current.lng ?? route[0]?.lng ?? 73.78]}
                    icon={carIcon}
                    eventHandlers={{
                        click: () => {
                            setShowInfo((s) => !s);
                        },
                    }}
                    ref={markerRef}
                />
            </MapContainer>

            {showInfo && currentPoint && (
                <InfoCard
                    point={currentPoint}
                    infoClose={() => setShowInfo(false)}
                    extra={{
                        speed: speedText,
                        distance: (progress * totalMeters / 1000).toFixed(2),
                        battery: "16",
                        totalDistance: "834.89",
                        todayRunning: "00h:00m",
                        todayStopped: "07h:10m",
                    }}
                    areaName={areaName}
                />
            )}

            <Controls
                onPlayPause={onTogglePlay}
                onReset={onReset}
                playing={playing}
                speedMultiplier={speedMultiplier}
                setSpeedMultiplier={setSpeedMultiplier}
                progress={progress}
                onSeek={onSeek}
                onConfigureToggle={() => setConfigureOpen((c) => !c)}
                configureOpen={configureOpen}
                day={day}
                setDay={setDay}
            />
        </div>
    );
}
