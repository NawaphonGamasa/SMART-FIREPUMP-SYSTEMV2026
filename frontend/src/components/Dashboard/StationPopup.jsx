import React from 'react';
import { AlertTriangle, Zap, CheckCircle, Activity, Droplets } from 'lucide-react';
import CCTVPlayer from '../Video/CCTVPlayer';

const FirePumpPopup = ({ data }) => {
    // Logic เดิม
    let statusText = 'READING';
    let statusColor = 'text-green-400';
    let StatusIcon = CheckCircle;
    let borderColor = 'border-green-500/50';

    if (data.status_fault === 0) {
        statusText = 'FAULT';
        statusColor = 'text-red-500';
        StatusIcon = AlertTriangle;
        borderColor = 'border-red-500/50';
    } else if (data.status_run === 1) {
        statusText = 'RUNNING';
        statusColor = 'text-green-400 animate-pulse';
        StatusIcon = Zap;
        borderColor = 'border-green-500/50';
    }

    const timeStr = data.timestamp
        ? new Date(data.timestamp).toLocaleTimeString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : '--:--';

    return (
        // Wrapper เดิมทำไว้ดีแล้วครับ
        <div className={`w-[85vw] sm:w-80 bg-gray-900/95 backdrop-blur-xl text-white rounded-xl border ${borderColor} shadow-2xl overflow-hidden font-sans select-none`}>

            {/* Header */}
            <div className="bg-gray-800/80 p-2.5 flex justify-between items-center border-b border-gray-700">
                <h3 className="text-sm font-bold flex items-center gap-2 text-gray-100 truncate">
                    <Activity size={16} className="text-orange-400 flex-shrink-0" />
                    <span className="truncate">Station {data.station_id}</span>
                </h3>
                <div className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 border border-white/5 whitespace-nowrap flex-shrink-0 ${statusColor}`}>
                    <StatusIcon size={10} />
                    <span>{statusText}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-3 space-y-3">

                {/* 1. Pressure Section */}
                <div className="flex justify-between items-end pb-2 border-b border-gray-700/50">
                    <div className="min-w-0 pr-2"> {/* ป้องกันตัวเลขยาวดันเลย์เอาต์พัง */}
                        <p className="text-gray-400 text-[9px] uppercase font-bold tracking-widest mb-0.5 flex items-center gap-1">
                            <Droplets size={10} className="text-blue-500 flex-shrink-0" /> Oil Pressure
                        </p>
                        <div className="flex items-baseline gap-1 overflow-hidden">
                            <span className={`text-3xl font-black font-mono truncate block ${data.status_fault === 0 ? 'text-red-400' : 'text-blue-400'}`}>
                                {data.oil_pressure || 0}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">Bar</span>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="text-[9px] text-gray-500 uppercase font-bold mb-0.5">Last Update</p>
                        <p className="text-[10px] font-mono text-gray-300 bg-gray-800 px-1.5 py-0.5 rounded inline-block">
                            {timeStr}
                        </p>
                    </div>
                </div>

                {/* 2. Status Indicators */}
                {/* เปลี่ยนเป็น flex-wrap ป้องกันจอเล็กมากๆ แล้วบีบข้อความจนพัง */}
                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    {/* Run / Stop */}
                    <div className="flex-1 flex items-center justify-between bg-black/20 p-2 rounded-lg border border-white/5 min-w-[120px]">
                        <span className="text-[9px] text-gray-400 font-bold uppercase truncate mr-2">Run / Stop</span>
                        <div className={`w-2.5 h-2.5 rounded-full shadow-lg flex-shrink-0 ${data.status_run === 1 ? 'bg-green-500 shadow-green-500/50 blink-urgent' : 'bg-red-500 shadow-red-500/50 blink-urgent'}`}></div>
                    </div>

                    {/* Reading / Fault */}
                    <div className="flex-1 flex items-center justify-between bg-black/20 p-2 rounded-lg border border-white/5 min-w-[120px]">
                        <span className="text-[9px] text-gray-400 font-bold uppercase truncate mr-2">Reading / Fault</span>
                        <div className={`w-2.5 h-2.5 rounded-full shadow-lg flex-shrink-0 ${data.status_fault === 1 ? 'bg-green-500 shadow-green-500/50 blink-urgent' : 'bg-red-500 shadow-red-500/50 blink-urgent'}`}></div>
                    </div>
                </div>

                {/* 3. CCTV Section */}
                <div className="pt-1 border-t border-gray-700/50 w-full overflow-hidden">
                    <p className="text-gray-400 text-[9px] uppercase font-bold tracking-widest mb-1.5">Live Camera</p>
                    {/* ตรวจสอบให้แน่ใจว่าด้านใน CCTVPlayer รองรับ w-full ด้วย */}
                    <div className="w-full rounded bg-black">
                        <CCTVPlayer url={data.camUrl} label={`CAM ${data.station_id}`} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FirePumpPopup;