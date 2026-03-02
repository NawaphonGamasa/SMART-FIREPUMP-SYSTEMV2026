import React, { useEffect } from 'react';
import { MapContainer, ImageOverlay, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import FirePumpPopup from './StationPopup.jsx';

// ขอบเขตของรูปแผนที่ (สูง 1284px, กว้าง 2048px)
const bounds = [[1284, 0], [0, 2048]];

/* ================================
   🎯 Component สำหรับดักคลิกบนแผนที่
================================ */
function ClickLogger() {
    useMapEvents({
        click(e) {
            if (window.enableCoordMode) {
                const x = Math.round(e.latlng.lng);
                const y = Math.round(e.latlng.lat);

                console.log("y:", y);
                console.log("X:", x);

                alert(`Y: ${y}\nX: ${x}`);
            }
        },
    });
    return null;
}

/* ================================
   🎯 สร้าง Marker Icon
================================ */
const createIcon = (statusRun, statusFault, isNearTop) => {
    let colorClass = 'marker-green';
    if (statusFault === 0) colorClass = 'marker-red';

    const anchorPosition = isNearTop ? [0, 20] : [0, -10];

    return L.divIcon({
        className: 'custom-icon',
        html: `<div class="marker-pin ${colorClass}"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: anchorPosition
    });
};

/* ================================
   🎯 Main Map Component
================================ */
const FirePumpMap = ({ stations }) => {

    // เปิดโหมดดูพิกัดจาก Console
    useEffect(() => {
        window.enableCoordMode = false;

        window.enableCoords = () => {
            window.enableCoordMode = true;
            console.log("✅ Coordinate Mode: ON");
        };

        window.disableCoords = () => {
            window.enableCoordMode = false;
            console.log("❌ Coordinate Mode: OFF");
        };
    }, []);

    return (
        <MapContainer
            crs={L.CRS.Simple}
            bounds={bounds}
            maxBounds={bounds}
            maxBoundsViscosity={1.0}
            className="w-full h-full bg-[#0B1121] z-0 rounded-none lg:rounded-2xl shadow-none lg:shadow-2xl lg:border lg:border-gray-800 outline-none"
            minZoom={0}
            maxZoom={2}
            zoomSnap={0.1}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
        >
            {/* 🎯 ตัวจับคลิก */}
            <ClickLogger />

            {/* 🎯 รูปแผนที่ */}
            <ImageOverlay url="/maps/factory-map.jpg" bounds={bounds} />

            {/* 🎯 Marker Stations */}
            {stations.map((st) => {

                const isNearTop = st.position && st.position[0] > 500;

                return (
                    <Marker
                        key={st.station_id}
                        position={st.position || [0, 0]}
                        icon={createIcon(st.status_run, st.status_fault, isNearTop)}
                    >
                        <Popup
                            className={`custom-popup ${isNearTop ? 'popup-flip' : ''}`}
                            autoPan={false}
                        >
                            <FirePumpPopup data={st} />
                        </Popup>
                    </Marker>
                );
            })}

        </MapContainer>
    );
};

export default FirePumpMap;