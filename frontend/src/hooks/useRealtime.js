import { useState, useEffect } from 'react';
import socketService from '../services/socketService';
import { getFirePumpDashboard } from '../services/api';

const useFirePump = () => {
    const [stations, setStations] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await getFirePumpDashboard();
            if (res.data) {
                setStations(res.data);
            }
        } catch (err) {
            console.error("❌ Fetch Data Failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        socketService.connect();

        const onConnect = () => setIsConnected(true);
        const onDisconnect = () => setIsConnected(false);

        socketService.subscribe('connect', onConnect);
        socketService.subscribe('disconnect', onDisconnect);

        // ✅ รับค่า Fire Pump แล้วอัปเดตเฉพาะตัวที่เปลี่ยน
        socketService.subscribe('firepump-update', (newData) => {
            setStations(prev => {
                const index = prev.findIndex(s => s.station_id === newData.station_id);
                if (index > -1) {
                    const newArr = [...prev];
                    newArr[index] = { ...newArr[index], ...newData };
                    return newArr;
                } else {
                    return [...prev, newData].sort((a, b) => a.station_id - b.station_id);
                }
            });
        });

        return () => {
            socketService.unsubscribe('firepump-update');
            socketService.unsubscribe('connect');
            socketService.unsubscribe('disconnect');
            socketService.disconnect();
        };
    }, []);

    return { stations, isConnected, isLoading };
};

export default useFirePump;