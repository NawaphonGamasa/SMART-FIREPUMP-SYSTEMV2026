import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Zap, AlertTriangle, CheckCircle, Droplets, FileText, X, Filter, ChevronUp, ChevronDown, ArrowUpDown, LogOut } from 'lucide-react';
import { getDailyReport } from '../../services/api';

const STATION_NAMES = {
    1: "TS4",
    2: "TS5",
    3: "TS6",
    4: "ผลิตถุง #1./2.",
    5: "",
    6: "Packer",
    7: "CFB/ยุ้ง Biomass",
    8: "มอตาร์",
    11: "ยุ้ง C"
};

const StatusPanel = ({ stations }) => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('role');
    const isAdmin = userRole === 'admin';
    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        window.location.reload();
    };
    
    const [timeStr, setTimeStr] = useState(new Date().toLocaleString('th-TH'));
    const [filter, setFilter] = useState('ALL');
    
    // report state...
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [reportData, setReportData] = useState([]);
    const [reportSummary, setReportSummary] = useState({ avg_pressure: 0, total_runs: 0, total_faults: 0, total_records: 0 });
    const [isLoadingReport, setIsLoadingReport] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const sortedReportData = useMemo(() => {
        let sortableItems = [...reportData];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                let valA = a[sortConfig.key] !== null && a[sortConfig.key] !== undefined ? a[sortConfig.key] : 0;
                let valB = b[sortConfig.key] !== null && b[sortConfig.key] !== undefined ? b[sortConfig.key] : 0;
                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [reportData, sortConfig]);

    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) return <ArrowUpDown size={12} className="opacity-30" />;
        return sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-blue-400" /> : <ChevronDown size={14} className="text-blue-400" />;
    };

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

    useEffect(() => {
        if (isReportModalOpen) fetchReport();
    }, [isReportModalOpen, startDate, endDate]);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setTimeStr(now.toLocaleString('th-TH', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
            }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const safeStations = stations || [];
    const total = safeStations.length;
    const running = safeStations.filter(s => s.status_run === 1).length;
    const fault = safeStations.filter(s => s.status_fault === 0).length;

    const displayStations = safeStations.filter(st => {
        if (filter === 'RUN') return st.status_run === 1;
        if (filter === 'FAULT') return st.status_fault === 0;
        return true;
    });

    return (
        <div className="flex flex-col h-full w-full bg-[#0B1121] text-white border-l border-gray-800 font-sans relative overflow-hidden select-none">
            
            {/* --- REPORT MODAL --- */}
            {isReportModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 lg:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
                    <div className="bg-[#1F2937] w-full h-full lg:max-w-4xl lg:h-[80vh] lg:rounded-2xl border-none lg:border border-gray-700 shadow-2xl overflow-hidden flex flex-col">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50 gap-4 sm:gap-0 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg"><FileText size={24} className="text-blue-400" /></div>
                                <div><h3 className="text-lg sm:text-xl font-bold text-gray-100">รายงานข้อมูลปั๊มดับเพลิงย้อนหลัง</h3></div>
                            </div>
                            <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end gap-2">
                                <div className="flex items-center gap-2 bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-700 overflow-x-auto w-full sm:w-auto">
                                    <span className="text-xs text-gray-500 font-bold whitespace-nowrap">FROM</span>
                                    {/* ✅ เพิ่ม min-w-[110px] ป้องกัน input หดตัวบนจอมือถือเล็กๆ */}
                                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-white text-xs sm:text-sm focus:outline-none font-mono min-w-[110px]" />
                                    <span className="text-gray-600">|</span>
                                    <span className="text-xs text-gray-500 font-bold whitespace-nowrap">TO</span>
                                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-white text-xs sm:text-sm focus:outline-none font-mono min-w-[110px]" />
                                </div>
                                <button onClick={() => setIsReportModalOpen(false)} className="ml-2 sm:ml-4 p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors shrink-0"><X size={24} /></button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden flex flex-col p-4 sm:p-6 gap-4 sm:gap-6 min-h-0">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 flex-shrink-0">
                                {/* ... (โค้ด Card เหมือนเดิมไม่เปลี่ยนแปลง) ... */}
                                <div className="bg-gray-800/50 p-3 sm:p-4 rounded-xl border border-gray-700 flex flex-col items-center justify-center">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider text-center">Total Records</p>
                                    <p className="text-lg sm:text-2xl font-mono font-bold text-white mt-1">{reportSummary.total_records}</p>
                                </div>
                                <div className="bg-green-900/20 p-3 sm:p-4 rounded-xl border border-green-500/30 flex flex-col items-center justify-center">
                                    <p className="text-[10px] text-green-400 uppercase font-bold tracking-wider text-center">Total Runs</p>
                                    <p className="text-lg sm:text-2xl font-mono font-bold text-green-400 mt-1">{reportSummary.total_runs} <span className="text-xs sm:text-sm font-sans text-green-500/50">times</span></p>
                                </div>
                                <div className="bg-red-900/20 p-3 sm:p-4 rounded-xl border border-red-500/30 flex flex-col items-center justify-center">
                                    <p className="text-[10px] text-red-400 uppercase font-bold tracking-wider text-center">Total Faults</p>
                                    <p className="text-lg sm:text-2xl font-mono font-bold text-red-500 mt-1">{reportSummary.total_faults} <span className="text-xs sm:text-sm font-sans text-red-500/50">times</span></p>
                                </div>
                                <div className="bg-blue-900/20 p-3 sm:p-4 rounded-xl border border-blue-500/30 flex flex-col items-center justify-center">
                                    <p className="text-[10px] text-blue-300 uppercase font-bold tracking-wider text-center">Avg Pressure</p>
                                    <p className="text-lg sm:text-2xl font-mono font-bold text-blue-400 mt-1">{reportSummary.avg_pressure} <span className="text-xs sm:text-sm font-sans text-blue-500/50">Bar</span></p>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="flex-1 bg-gray-900/50 rounded-xl border border-gray-700 flex flex-col w-full min-h-0">
                                <div className="overflow-x-auto w-full flex-1 flex flex-col">
                                    <div className="grid grid-cols-5 bg-gray-800 p-3 text-sm font-bold text-gray-300 border-b border-gray-700 select-none min-w-[600px] flex-shrink-0">
                                        <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('timestamp')}>Date / Time {renderSortIcon('timestamp')}</div>
                                        <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('station_id')}>Station Name {renderSortIcon('station_id')}</div>
                                        <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('status_run')}>Run Status {renderSortIcon('status_run')}</div>
                                        <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('status_fault')}>Fault Status {renderSortIcon('status_fault')}</div>
                                        <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('oil_pressure')}>Pressure (Bar) {renderSortIcon('oil_pressure')}</div>
                                    </div>
                                    
                                    {/* ✅ เอา max-h ออก เพื่อให้ยืดหยุ่นตามหน้าจอจริงแบบ 100% */}
                                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 min-w-[600px]">
                                        {isLoadingReport ? <div className="text-center py-10 text-gray-500 animate-pulse">Loading Report...</div> :
                                            sortedReportData.length === 0 ? <div className="text-center py-10 text-gray-500">No data found</div> :
                                            sortedReportData.map((row, i) => (
                                                <div key={i} className="grid grid-cols-5 p-3 text-sm border-b border-gray-800 hover:bg-white/5 items-center">
                                                    {/* ... (เนื้อหาตารางเหมือนเดิม) ... */}
                                                    <div className="font-mono text-gray-400 text-xs">{new Date(row.timestamp).toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit' })} <span className="text-gray-500">|</span> {new Date(row.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</div>
                                                    <div className="text-center font-bold text-gray-300">Engine Fire Pump{STATION_NAMES[row.station_id] || `ST-${row.station_id}`.toString().padStart(2, '0')}</div>
                                                    <div className="text-center"><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${row.status_run === 1 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30 blink-urgent'}`}>{row.status_run === 1 ? 'RUNNING' : 'STOP'}</span></div>
                                                    <div className="text-center"><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${row.status_fault === 0 ? 'bg-red-500/20 text-red-400 border border-red-500/30 blink-urgent ' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>{row.status_fault === 0 ? 'FAULT' : 'READING'}</span></div>
                                                    <div className="text-right font-mono text-blue-400 font-bold text-base">{Number(row.oil_pressure || 0).toFixed(1)}</div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- HEADER --- */}
            <div className="h-auto min-h-[5rem] py-3 sm:py-0 sm:h-20 flex flex-wrap sm:flex-nowrap items-center justify-between px-4 sm:px-6 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 z-10 gap-2 sm:gap-0 flex-shrink-0">
                <div className="w-full sm:w-auto">
                    <h1 className="text-lg sm:text-xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 flex items-center gap-2">
                        <Activity className="text-orange-500 flex-shrink-0" /> SYSTEM STATUS
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] text-green-500 font-bold tracking-[0.2em] uppercase">Fire Pump Monitoring</span>
                    </div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                    <div className="text-xl sm:text-2xl font-mono font-bold text-gray-200 tracking-wider">{timeStr.split(' ')[1]}</div>
                    <div className="text-[10px] sm:text-xs text-gray-500 font-mono font-medium">{timeStr.split(' ')[0]}</div>
                </div>
            </div>

            {/* --- SUMMARY STATS --- */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-2 sm:p-4 border-b border-gray-800 bg-gray-900/30 flex-shrink-0">
                {/* ... (ปุ่ม Filter เหมือนเดิม) ... */}
                <div onClick={() => setFilter('ALL')} className={`p-2 sm:p-3 rounded-xl border cursor-pointer transition-all ${filter === 'ALL' ? 'bg-blue-900/20 border-blue-500/50' : 'bg-gray-800/40 border-white/5'}`}>
                    <div className="flex justify-between items-center"><CheckCircle size={16} className="text-blue-400" /><span className="text-lg sm:text-xl font-mono font-bold">{total}</span></div>
                    <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase mt-1">Total</p>
                </div>
                <div onClick={() => setFilter('RUN')} className={`p-2 sm:p-3 rounded-xl border cursor-pointer transition-all ${filter === 'RUN' ? 'bg-green-900/20 border-green-500/50' : 'bg-gray-800/40 border-white/5'}`}>
                    <div className="flex justify-between items-center"><Zap size={16} className="text-green-400" /><span className="text-lg sm:text-xl font-mono font-bold text-green-400">{running}</span></div>
                    <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase mt-1">Running</p>
                </div>
                <div onClick={() => setFilter('FAULT')} className={`p-2 sm:p-3 rounded-xl border cursor-pointer transition-all ${filter === 'FAULT' ? 'bg-red-900/20 border-red-500/50' : 'bg-gray-800/40 border-white/5'}`}>
                    <div className="flex justify-between items-center"><AlertTriangle size={16} className="text-red-400" /><span className="text-lg sm:text-xl font-mono font-bold text-red-500">{fault}</span></div>
                    <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase mt-1">Fault</p>
                </div>
            </div>

            {/* --- LIST CONTENT --- */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 custom-scrollbar min-h-0">
                {displayStations.map((st) => {
                    const isFault = st.status_fault === 0;
                    const isRun = st.status_run === 1;

                    let cardStyle = 'bg-green-900/10 border-green-500/30';
                    let statusText = 'READING';
                    let textClass = 'text-green-400';

                    if (isFault) {
                        cardStyle = 'bg-red-900/10 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]';
                        statusText = 'FAULT';
                        textClass = 'text-red-400';
                    } else if (isRun) {
                        cardStyle = 'bg-green-900/10 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.15)]';
                        statusText = 'RUNNING';
                        textClass = 'text-green-400';
                    }

                    return (
                        <div key={st.station_id} className={`p-3 sm:p-4 rounded-xl border ${cardStyle} transition-all hover:bg-white/5 relative group`}>
                            {/* ... (การ์ด Station เหมือนเดิม) ... */}
                            <div className="flex justify-between items-center mb-2 sm:mb-3">
                                <h3 className="font-bold text-gray-200 text-xs sm:text-sm">Engine Fire Pump {STATION_NAMES[st.station_id] || `Station ${st.station_id}`}</h3>
                                <div className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded border border-white/10 bg-black/20 ${textClass} tracking-wider`}>{statusText}</div>
                            </div>
                            <div className="flex justify-between items-end mb-3 sm:mb-4">
                                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-400 text-[10px] sm:text-xs">
                                    <Droplets size={14} className="text-blue-500 flex-shrink-0" /> <span className="uppercase text-[9px] sm:text-[10px] font-bold">Oil Pressure</span>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xl sm:text-2xl font-mono font-bold ${isFault ? 'text-red-400' : 'text-blue-400'}`}>{st.oil_pressure || 0}</span>
                                    <span className="text-[10px] sm:text-xs text-gray-500 ml-1 font-bold">Bar</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-2 sm:pt-3 border-t border-gray-700/50">
                                <div className="flex items-center justify-between bg-black/20 p-1.5 rounded-lg border border-white/5">
                                    <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase">Run / Stop</span>
                                    <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shadow-lg ${isRun ? 'bg-green-500 shadow-green-500/50 blink-urgent' : 'bg-red-500 shadow-red-500/50 blink-urgent'}`}></div>
                                </div>
                                <div className="flex items-center justify-between bg-black/20 p-1.5 rounded-lg border border-white/5">
                                    <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase">Reading / Fault</span>
                                    <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shadow-lg ${st.status_fault === 1 ? 'bg-green-500 shadow-green-500/50 blink-urgent' : 'bg-red-500 shadow-red-500/50 blink-urgent'}`}></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ✅ สร้าง Action Footer ด้านล่างสุด ให้ติดหนึบตลอดเวลา ไม่ต้อง Scroll หามัน */}
            <div className="p-3 sm:p-4 border-t border-gray-800 bg-gray-900 flex gap-2 sm:gap-3 flex-shrink-0 z-10">
                <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-blue-600/90 hover:bg-blue-500 border border-blue-500/50 text-gray-200 hover:text-white rounded-xl transition-all duration-300 group shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                    title='ประวัติข้อมูลย้อนหลัง'
                >
                    <FileText size={18} className="group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-semibold text-xs sm:text-sm tracking-wide">Report</span>
                </button>

                <button
                    onClick={handleLogout}
                    className="w-[50px] sm:w-[60px] flex items-center justify-center bg-red-600/90 hover:bg-red-500 border border-red-500/50 text-gray-200 hover:text-white rounded-xl transition-all duration-300 group shadow-[0_0_15px_rgba(220,38,38,0.2)]"
                    title="ออกจากระบบ"
                >
                    <LogOut size={18} className="group-hover:scale-110 transition-transform duration-300 ml-1" />
                </button>
            </div>
            
        </div>
    );
};

export default StatusPanel;