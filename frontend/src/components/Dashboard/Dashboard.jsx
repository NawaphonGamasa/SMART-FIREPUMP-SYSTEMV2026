import React from 'react';
import FirePumpMap from "./MapContainer"; 
import StatusPanel from "./StatusPanel";
import Loading from '../Common/Loading';
import useRealtime from '../../hooks/useRealtime';

const STATION_COORDS = [
    [400, 500], [400, 800], [400, 1100], [400, 1400],
    [800, 500], [800, 800], [800, 1100], [700, 700]
];

const FirePumpDashboard = () => {
    const { stations, isConnected, isLoading } = useRealtime();

    if (isLoading) return <Loading />;

    const hostname = window.location.hostname;
    const mapStations = stations.map((st) => ({
        ...st,
        position: STATION_COORDS[st.station_id - 1] || [0, 0],
        camUrl: `http://${hostname}:1880/camfire${st.station_id}` 
    }));

    return (
        // ปรับ h-screen เป็น h-[100dvh] เพื่อแก้ปัญหา Safari / Mobile Browser Address Bar
        <div className="flex flex-col xl:flex-row h-[100dvh] w-screen bg-gray-900 text-white overflow-hidden font-sans">

            {/* ส่วนแผนที่ (ซ้าย/บน) */}
            <div className="h-[50%] w-full xl:h-full xl:flex-1 relative z-0">
                <FirePumpMap stations={mapStations} />

                {/* Connection Badge */}
                {/* แนะนำ: ถ้าเปิดมือถือแล้วซ้อนปุ่ม Zoom ของ Map อาจต้องพิจารณาเปลี่ยน left-14 เป็น left-4 บนมือถือ (เช่น left-4 lg:left-14) */}
                <div className="absolute top-4 left-4 lg:left-14 z-[400] bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold flex items-center gap-3 border border-white/10 shadow-lg select-none">
                    <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse' : 'bg-red-500'}`}></div>
                    <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
                        {isConnected ? 'SYSTEM ONLINE' : 'DISCONNECTED'}
                    </span>
                </div>
            </div>

            {/* ส่วน Panel (ขวา/ล่าง) */}
            {/* 1. แก้ md:border... เป็น lg:border... ให้ตรงกับ Breakpoint หลัก */}
            {/* 2. เพิ่ม overflow-y-auto เพื่อให้ Panel ไถขึ้นลงได้ถ้าข้อมูลปั๊มมีเยอะ */}
            <div className="h-[50%] w-full xl:h-full xl:w-[25%] flex-shrink-0 bg-gray-800 border-t lg:border-t-0 lg:border-l border-gray-700 shadow-2xl z-10 flex flex-col overflow-y-auto">
                <StatusPanel stations={stations} />
            </div>

        </div>
    );
};

export default FirePumpDashboard;