import React from 'react';
import FirePumpMap from "./FirePumpMap"; 
import FirePumpPanel from "./FirePumpPanel";
import Loading from '../Common/Loading';
import useFirePump from '../../hooks/useFirePump';

// พิกัดสมมติ (เปลี่ยนตามหน้างานจริง)
const STATION_COORDS = [
    [400, 500], [400, 800], [400, 1100], [400, 1400],
    [800, 500], [800, 800], [800, 1100], [700, 700]
];

const FirePumpDashboard = () => {
    const { stations, isConnected, isLoading } = useFirePump();

    if (isLoading) return <Loading />;

    // Map ข้อมูล Station เข้ากับพิกัด
    const mapStations = stations.map((st) => ({
        ...st,
        position: STATION_COORDS[st.station_id - 1] || [0, 0],
        camUrl: `http://192.168.1.10${st.station_id}/snapshot` // URL กล้องสมมติ
    }));

    return (
        <div className="flex h-screen w-screen bg-gray-900 text-white overflow-hidden font-sans">

            {/* ส่วนแผนที่ (ซ้าย) */}
            <div className="flex-1 relative z-0">
                <FirePumpMap stations={mapStations} />

                {/* Connection Badge (ดีไซน์เดิม) */}
                <div className="absolute top-4 left-14 z-[400] bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold flex items-center gap-3 border border-white/10 shadow-lg select-none">
                    <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse' : 'bg-red-500'}`}></div>
                    <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
                        {isConnected ? 'SYSTEM ONLINE' : 'DISCONNECTED'}
                    </span>
                </div>
            </div>

            {/* ส่วน Panel (ขวา) */}
            <div className="w-[350px] flex-shrink-0 bg-gray-800 border-l border-gray-700 shadow-2xl z-10 flex flex-col">
                <FirePumpPanel stations={stations} />
            </div>

        </div>
    );
};

export default FirePumpDashboard;