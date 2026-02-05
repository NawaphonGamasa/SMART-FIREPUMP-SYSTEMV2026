import React from 'react';
import { MapContainer, ImageOverlay, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import FirePumpPopup from './FirePumpPopup.jsx';

// ขอบเขตของรูปแผนที่
const bounds = [[1284, 0], [0, 2100]];

const createIcon = (statusRun, statusFault, isNearTop) => {
    let colorClass = 'marker-green';
    if (statusFault === 1) colorClass = 'marker-red';

    // ถ้าอยู่บน (isNearTop) -> ให้จุดเริ่มอยู่ที่ "ก้น" ของหมุด ([0, 20]) เพื่อจะงอกลงล่าง
    // ถ้าอยู่ล่าง (ปกติ) -> ให้จุดเริ่มอยู่ที่ "หัว" ของหมุด ([0, -10]) เพื่อจะงอกขึ้นบน
    const anchorPosition = isNearTop ? [0, 20] : [0, -10];

    return L.divIcon({
        className: 'custom-icon',
        html: `<div class="marker-pin ${colorClass}"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: anchorPosition
    });
};

const FirePumpMap = ({ stations }) => {
    return (
        <MapContainer
            crs={L.CRS.Simple}
            bounds={bounds}
            maxBounds={bounds}
            maxBoundsViscosity={1.0}
            className="w-full h-full rounded-lg shadow-lg bg-gray-900 z-0"
            minZoom={-1}
            maxZoom={2}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
        >
            <ImageOverlay url="/maps/factory-map.jpg" bounds={bounds} />

            {stations.map((st) => {
                // เช็คว่าหมุดอยู่โซนบนหรือไม่ (ค่า Y > 500 คือเริ่มสูงแล้ว)
                const isNearTop = st.position && st.position[0] > 500;

                return (
                    <Marker
                        key={st.station_id}
                        position={st.position || [0, 0]}
                        icon={createIcon(st.status_run, st.status_fault, isNearTop)}
                    >
                        <Popup 
                            // ✅ ถ้าอยู่โซนบน ให้เพิ่มคลาส 'popup-flip' เพื่อกลับหัว
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