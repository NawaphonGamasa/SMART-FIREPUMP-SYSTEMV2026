import React, { useState, useEffect } from 'react';
import { Activity, Zap, AlertTriangle, CheckCircle, Droplets, FileText, X, Filter } from 'lucide-react';
import { getDailyReport } from '../../services/api';

const StatusPanel = ({ stations }) => {
    // 1. นาฬิกา
    const [timeStr, setTimeStr] = useState(new Date().toLocaleString('th-TH'));
    const [filter, setFilter] = useState('ALL');
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [reportData, setReportData] = useState([]);
    const [reportSummary, setReportSummary] = useState({ avg_pressure: 0, total_runs: 0, total_faults: 0, total_records: 0 });
    const [isLoadingReport, setIsLoadingReport] = useState(false);

    // --- ฟังก์ชันดึงข้อมูล Report ---
    const fetchReport = async () => {
        setIsLoadingReport(true);
        try {
            const result = await getDailyReport(startDate, endDate);
            if (result.status === 'success') {
                setReportData(result.data);
                setReportSummary(result.summary);
            } else {
                setReportData([]);
            }
        } catch (error) {
            console.error(error);
            setReportData([]);
        } finally {
            setIsLoadingReport(false);
        }
    };

    // --- โหลดข้อมูลเมื่อเปิด Modal หรือเปลี่ยนวันที่ ---
    useEffect(() => {
        if (isReportModalOpen) {
            fetchReport();
        }
    }, [isReportModalOpen, startDate, endDate]);

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
    const fault = safeStations.filter(s => s.status_fault === 0).length;

    // กรองการแสดงผล
    const displayStations = safeStations.filter(st => {
        if (filter === 'RUN') return st.status_run === 1;
        if (filter === 'FAULT') return st.status_fault === 0;
        return true;
    });

    return (
        <div className="flex flex-col h-full bg-[#0B1121] text-white border-l border-gray-800 font-sans relative overflow-hidden select-none">
            {/* --- REPORT MODAL (FIRE PUMP) --- */}
            {isReportModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 lg:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
                    <div className="bg-[#1F2937] w-full h-full lg:max-w-4xl lg:h-[80vh] lg:rounded-2xl border-none lg:border border-gray-700 shadow-2xl overflow-hidden flex flex-col">

                        {/* Header ของ Modal */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50 gap-4 sm:gap-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg"><FileText size={24} className="text-blue-400" /></div>
                                <div><h3 className="text-lg sm:text-xl font-bold text-gray-100">รายงานข้อมูลปั๊มดับเพลิงย้อนหลัง</h3></div>
                            </div>

                            <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end gap-2">
                                {/* ส่วนเลือกวันที่ */}
                                <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-700 overflow-x-auto">
                                    <span className="text-xs text-gray-500 font-bold whitespace-nowrap">FROM</span>
                                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-white text-xs sm:text-sm focus:outline-none font-mono" />
                                    <span className="text-gray-600">|</span>
                                    <span className="text-xs text-gray-500 font-bold whitespace-nowrap">TO</span>
                                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-white text-xs sm:text-sm focus:outline-none font-mono" />
                                </div>
                                {/* ปุ่มกากบาท (ปิด) */}
                                <button onClick={() => setIsReportModalOpen(false)} className="ml-2 sm:ml-4 p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
                            </div>
                        </div>

                        {/* Body (สรุป + ตารางข้อมูล) */}
                        <div className="flex-1 overflow-hidden flex flex-col p-4 sm:p-6 gap-4 sm:gap-6">

                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 flex flex-col items-center justify-center">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Records</p>
                                    <p className="text-xl sm:text-2xl font-mono font-bold text-white mt-1">{reportSummary.total_records}</p>
                                </div>
                                <div className="bg-green-900/20 p-4 rounded-xl border border-green-500/30 flex flex-col items-center justify-center">
                                    <p className="text-[10px] text-green-400 uppercase font-bold tracking-wider">Total Runs</p>
                                    <p className="text-xl sm:text-2xl font-mono font-bold text-green-400 mt-1">{reportSummary.total_runs} <span className="text-sm font-sans text-green-500/50">times</span></p>
                                </div>
                                <div className="bg-red-900/20 p-4 rounded-xl border border-red-500/30 flex flex-col items-center justify-center">
                                    <p className="text-[10px] text-red-400 uppercase font-bold tracking-wider">Total Faults</p>
                                    <p className="text-xl sm:text-2xl font-mono font-bold text-red-500 mt-1">{reportSummary.total_faults} <span className="text-sm font-sans text-red-500/50">times</span></p>
                                </div>
                                <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/30 flex flex-col items-center justify-center">
                                    <p className="text-[10px] text-blue-300 uppercase font-bold tracking-wider">Avg Pressure</p>
                                    <p className="text-xl sm:text-2xl font-mono font-bold text-blue-400 mt-1">{reportSummary.avg_pressure} <span className="text-sm font-sans text-blue-500/50">Bar</span></p>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="flex-1 bg-gray-900/50 rounded-xl border border-gray-700 overflow-hidden flex flex-col">
                                <div className="overflow-x-auto">
                                    <div className="min-w-[600px]">
                                        <div className="grid grid-cols-5 bg-gray-800 p-3 text-sm font-bold text-gray-300 border-b border-gray-700">
                                            <div>Date / Time</div>
                                            <div className="text-center">Station ID</div>
                                            <div className="text-center">Run Status</div>
                                            <div className="text-center">Fault Status</div>
                                            <div className="text-right">Oil Pressure (Bar)</div>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 max-h-[40vh] sm:max-h-full">
                                        <div className="min-w-[600px]">
                                            {isLoadingReport ? <div className="text-center py-10 text-gray-500 animate-pulse">Loading Report...</div> :
                                                reportData.length === 0 ? <div className="text-center py-10 text-gray-500">No data found in selected period</div> :
                                                    reportData.map((row, i) => (
                                                        <div key={i} className="grid grid-cols-5 p-3 text-sm border-b border-gray-800 hover:bg-white/5 items-center">
                                                            <div className="font-mono text-gray-400 text-xs">
                                                                {new Date(row.timestamp).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit' })} <span className="text-gray-500">|</span> {new Date(row.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                            <div className="text-center font-bold text-gray-300">ST-{(row.station_id).toString().padStart(2, '0')}</div>
                                                            <div className="text-center">
                                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${row.status_run === 1 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-800 text-gray-500 border border-gray-700'}`}>
                                                                    {row.status_run === 1 ? 'RUNNING' : 'STOP'}
                                                                </span>
                                                            </div>
                                                            <div className="text-center">
                                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${row.status_fault === 0 ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-gray-800 text-gray-500 border border-gray-700'}`}>
                                                                    {row.status_fault === 0 ? 'FAULT' : 'NORMAL'}
                                                                </span>
                                                            </div>
                                                            <div className="text-right font-mono text-blue-400 font-bold text-base">
                                                                {Number(row.oil_pressure || 0).toFixed(1)}
                                                            </div>
                                                        </div>
                                                    ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

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
                    const isFault = st.status_fault === 0;
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
                                    <Droplets size={14} className="text-blue-500" /> <span className="uppercase text-[10px] font-bold">Pressure</span>
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
                                    <div className={`w-3 h-3 rounded-full shadow-lg ${st.status_fault === 1 ? 'bg-green-500 shadow-green-500/50 blink-urgent' : 'bg-red-500 shadow-red-500/50 blink-urgent'}`}></div>
                                </div>
                            </div>

                        </div>
                    );
                })}
                <div className="pt-4 mt-4 border-t border-gray-800/50">
                    <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-3 bg-blue-600/90 hover:bg-blue-500 border border-blue-500/50 text-gray-200 hover:text-white rounded-xl transition-all duration-300 group shadow-[0_0_15px_rgba(37,99,235,0.2)] w-full justify-center"
                        title='ประวัติข้อมูลย้อนหลัง'
                    >
                        <FileText size={18} className="group-hover:scale-110 transition-transform duration-300" />
                        <span className="font-semibold text-sm tracking-wide">Report</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusPanel;