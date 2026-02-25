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
        <div className={`w-[85vw] sm:w-80 bg-gray-900/95 backdrop-blur-xl text-white rounded-xl border ${borderColor} shadow-2xl overflow-hidden font-sans select-none`}>

            {/* Header */}
            <div className="bg-gray-800/80 p-2.5 flex justify-between items-center border-b border-gray-700">
                <h3 className="text-sm font-bold flex items-center gap-2 text-gray-100">
                    <Activity size={16} className="text-orange-400" />
                    Station {data.station_id}
                </h3>
                <div className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/40 border border-white/5 ${statusColor}`}>
                    <StatusIcon size={10} />
                    <span>{statusText}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-3 space-y-3">

                {/* 1. Pressure Section */}
                <div className="flex justify-between items-end pb-2 border-b border-gray-700/50">
                    <div>
                        <p className="text-gray-400 text-[9px] uppercase font-bold tracking-widest mb-0.5 flex items-center gap-1">
                            <Droplets size={10} className="text-blue-500" /> Oil Pressure
                        </p>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-3xl font-black font-mono ${data.status_fault === 0 ? 'text-red-400' : 'text-blue-400'}`}>
                                {data.oil_pressure || 0}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">Bar</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] text-gray-500 uppercase font-bold mb-0.5">Last Update</p>
                        <p className="text-[10px] font-mono text-gray-300 bg-gray-800 px-1.5 py-0.5 rounded inline-block">
                            {timeStr}
                        </p>
                    </div>
                </div>

                {/* ✅ 2. ส่วนที่เพิ่ม: Status Indicators (เหมือนในรูป) */}
                <div className="grid grid-cols-2 gap-2">
                    {/* Run / Stop */}
                    <div className="flex items-center justify-between bg-black/20 p-2 rounded-lg border border-white/5">
                        <span className="text-[9px] text-gray-400 font-bold uppercase">Run / Stop</span>
                        <div className={`w-2.5 h-2.5 rounded-full shadow-lg ${data.status_run === 1 ? 'bg-green-500 shadow-green-500/50 blink-urgent' : 'bg-red-500 shadow-red-500/50 blink-urgent'}`}></div>
                    </div>

                    {/* Reading / Fault */}
                    <div className="flex items-center justify-between bg-black/20 p-2 rounded-lg border border-white/5">
                        <span className="text-[9px] text-gray-400 font-bold uppercase">Reading / Fault</span>
                        {/* ถ้า Fault=1 คือปกติ(เขียว), Fault=0 คือเสีย(แดง) */}
                        <div className={`w-2.5 h-2.5 rounded-full shadow-lg ${data.status_fault === 1 ? 'bg-green-500 shadow-green-500/50 blink-urgent' : 'bg-red-500 shadow-red-500/50 blink-urgent'}`}></div>
                    </div>
                </div>

                {/* 3. CCTV Section */}
                <div className="pt-1 border-t border-gray-700/50">
                    <p className="text-gray-400 text-[9px] uppercase font-bold tracking-widest mb-1.5">Live Camera</p>
                    <CCTVPlayer url={data.camUrl} label={`CAM ${data.station_id}`} />
                </div>

            </div>
        </div>
    );
};

export default FirePumpPopup;