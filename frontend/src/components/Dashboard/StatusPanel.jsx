import React, { useState, useEffect } from 'react';
import { Activity, Zap, AlertTriangle, CheckCircle, Droplets, Filter } from 'lucide-react';

const FirePumpPanel = ({ stations }) => {
    // 1. นาฬิกา
    const [timeStr, setTimeStr] = useState(new Date().toLocaleString('th-TH'));
    const [filter, setFilter] = useState('ALL'); 

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setTimeStr(now.toLocaleString('th-TH', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: false
            }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // คำนวณยอดรวม
    const safeStations = stations || [];
    const total = safeStations.length;
    const running = safeStations.filter(s => s.status_run === 1).length;
    const fault = safeStations.filter(s => s.status_fault === 1).length;

    // กรองการแสดงผล
    const displayStations = safeStations.filter(st => {
        if (filter === 'RUN') return st.status_run === 1;
        if (filter === 'FAULT') return st.status_fault === 1;
        return true;
    });

    return (
        <div className="flex flex-col h-full bg-[#0B1121] text-white border-l border-gray-800 font-sans relative overflow-hidden select-none">
            
            {/* --- HEADER --- */}
            <div className="h-20 flex items-center justify-between px-6 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-10">
                <div>
                    <h1 className="text-xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 flex items-center gap-2">
                        <Activity className="text-orange-500" /> SYSTEM STATUS
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] text-green-500 font-bold tracking-[0.2em] uppercase">Fire Pump Monitoring</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-mono font-bold text-gray-200 tracking-wider">{timeStr.split(' ')[1]}</div>
                    <div className="text-xs text-gray-500 font-mono font-medium">{timeStr.split(' ')[0]}</div>
                </div>
            </div>

            {/* --- SUMMARY STATS --- */}
            <div className="grid grid-cols-3 gap-2 p-4 border-b border-gray-800 bg-gray-900/30">
                <div onClick={() => setFilter('ALL')} className={`p-3 rounded-xl border cursor-pointer transition-all ${filter === 'ALL' ? 'bg-blue-900/20 border-blue-500/50' : 'bg-gray-800/40 border-white/5'}`}>
                    <div className="flex justify-between"><CheckCircle size={16} className="text-blue-400" /><span className="text-xl font-mono font-bold">{total}</span></div>
                    <p className="text-[10px] text-gray-400 uppercase mt-1">Total</p>
                </div>
                <div onClick={() => setFilter('RUN')} className={`p-3 rounded-xl border cursor-pointer transition-all ${filter === 'RUN' ? 'bg-green-900/20 border-green-500/50' : 'bg-gray-800/40 border-white/5'}`}>
                    <div className="flex justify-between"><Zap size={16} className="text-green-400" /><span className="text-xl font-mono font-bold text-green-400">{running}</span></div>
                    <p className="text-[10px] text-gray-400 uppercase mt-1">Running</p>
                </div>
                <div onClick={() => setFilter('FAULT')} className={`p-3 rounded-xl border cursor-pointer transition-all ${filter === 'FAULT' ? 'bg-red-900/20 border-red-500/50' : 'bg-gray-800/40 border-white/5'}`}>
                    <div className="flex justify-between"><AlertTriangle size={16} className="text-red-400" /><span className="text-xl font-mono font-bold text-red-500">{fault}</span></div>
                    <p className="text-[10px] text-gray-400 uppercase mt-1">Fault</p>
                </div>
            </div>

            {/* --- LIST CONTENT --- */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {displayStations.map((st) => {
                    const isFault = st.status_fault === 1;
                    const isRun = st.status_run === 1;
                    
                    let cardStyle = 'bg-green-900/10 border-green-500/30';
                    let statusText = 'NORMAL';
                    let textClass = 'text-green-400';
                    let glow = '';

                    if (isFault) {
                        cardStyle = 'bg-red-900/10 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]';
                        statusText = 'FAULT';
                        textClass = 'text-red-400';
                    } else if (isRun) {
                        cardStyle = 'bg-green-900/10 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.15)]';
                        statusText = 'RUNNING';
                        textClass = 'text-green-400';
                        glow = 'shadow-[0_0_15px_rgba(34,197,94,0.15)]';
                    }

                    return (
                        <div key={st.station_id} className={`p-4 rounded-xl border ${cardStyle} transition-all hover:bg-white/5 relative group`}>
                            {/* Header: Name & Badge */}
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-bold text-gray-200 text-sm">Station {st.station_id}</h3>
                                <div className={`text-[10px] font-bold px-2 py-0.5 rounded border border-white/10 bg-black/20 ${textClass} tracking-wider`}>
                                    {statusText}
                                </div>
                            </div>
                            
                            {/* Pressure Value */}
                            <div className="flex justify-between items-end mb-4">
                                <div className="flex items-center gap-2 text-gray-400 text-xs">
                                    <Droplets size={14} className="text-blue-500"/> <span className="uppercase text-[10px] font-bold">Pressure</span>
                                </div>
                                <div className="text-right">
                                    <span className={`text-2xl font-mono font-bold ${isFault ? 'text-red-400' : 'text-blue-400'}`}>
                                        {st.oil_pressure || 0}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-1 font-bold">Bar</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-700/50">
                                {/* Run / Stop */}
                                <div className="flex items-center justify-between bg-black/20 p-1.5 rounded-lg border border-white/5">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Run / Stop</span>
                                    <div className={`w-3 h-3 rounded-full shadow-lg ${isRun ? 'bg-green-500 shadow-green-500/50 blink-urgent' : 'bg-red-500 shadow-red-500/50 blink-urgent'}`}></div>
                                </div>

                                {/* Reading / Fault */}
                                <div className="flex items-center justify-between bg-black/20 p-1.5 rounded-lg border border-white/5">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Reading / Fault</span>
                                    {/* ถ้า Fault=0 ให้เขียว (Reading ปกติ), ถ้า Fault=1 ให้แดง (Fault) */}
                                    <div className={`w-3 h-3 rounded-full shadow-lg ${st.status_fault === 0 ? 'bg-green-500 shadow-green-500/50 blink-urgent' : 'bg-red-500 shadow-red-500/50 blink-urgent'}`}></div>
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FirePumpPanel;