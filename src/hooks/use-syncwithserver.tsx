import { useEffect, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useChartDB } from './use-chartdb';
import { useParams } from 'react-router-dom';
import {
    diagramToJSONOutputWs,
    JsonToUnit8Array,
} from '@/lib/export-import-utils';
import type { Diagram } from '@/lib/domain';
import { useStorage } from './use-storage';

const useSyncWithServer = () => {
    const { diagramId } = useParams<{ diagramId: string }>();
    const { loadDiagram } = useChartDB();
    const [wsc, setWSC] = useState<WebSocket | null>(null);
    const { deleteDiagram, addDiagram } = useStorage();
    const ws_url = 'ws://chartdb-backend.onrender.com';
    // const ws_url = 'ws://localhost:8080';
    // Track if the socket is actually ready to receive data
    const [isReady, setIsReady] = useState(false);
    const [liveDiagramData, setLiveDiagramData] = useState<Diagram | undefined>(
        undefined
    );
    const currentDiagramData = useRef<Diagram>();
    const localDiagramData = useLiveQuery(() => {
        if (!diagramId) return undefined;
        return loadDiagram(diagramId);
    }, [diagramId]);

    useEffect(() => {
        const socket = new WebSocket(ws_url);

        const onOpen = () => {
            console.log('Connected to WebSocket');
            setIsReady(true);
        };
        const onClose = () => {
            setIsReady(false);
            // Optional: Add a delay before reconnecting to avoid infinite loops
            setTimeout(() => setWSC(new WebSocket(ws_url)), 3000);
        };
        const onMessage = (event: MessageEvent) => {
            const messageJson = JSON.parse(event.data) as {
                type: string;
                payload: Diagram;
            };
            if (messageJson.type === 'DIAGRAM_BROADCAST') {
                const payload = messageJson.payload;
                if (!currentDiagramData.current) return;

                const payloadTime = new Date(payload.updatedAt).getTime();
                const localTime = new Date(
                    currentDiagramData.current.updatedAt
                ).getTime();
                if (payloadTime > localTime) {
                    console.log(payloadTime, localTime);
                    deleteDiagram(payload.id);

                    setLiveDiagramData(payload);
                    // updateDiagram({ id: payload.id, attributes: payload });
                    addDiagram({ diagram: payload });
                }
            }
        };

        const onError = (err: Event) => console.error('WebSocket Error:', err);

        socket.addEventListener('open', onOpen);
        socket.addEventListener('close', onClose);
        socket.addEventListener('error', onError);
        socket.addEventListener('message', onMessage);
        setWSC(socket);

        // Cleanup: Important to prevent memory leaks and duplicate listeners
        return () => {
            socket.removeEventListener('open', onOpen);
            socket.removeEventListener('close', onClose);
            socket.removeEventListener('error', onError);
            socket.addEventListener('message', onMessage);
            socket.close();
        };
    }, [addDiagram, deleteDiagram]);

    // 2. Sync Logic
    useEffect(() => {
        const sendMessage = (message: string) => {
            // Critical Check: readyState 1 is "OPEN"
            if (wsc && wsc.readyState === WebSocket.OPEN) {
                wsc.send(JsonToUnit8Array(message));
            } else {
                console.warn('WebSocket not ready. Message queued or dropped.');
            }
        };
        if (!localDiagramData || !isReady || !diagramId) return;
        currentDiagramData.current = localDiagramData;
        const jsonDataString = diagramToJSONOutputWs(localDiagramData);
        const json = JSON.parse(jsonDataString) as Diagram;
        const newJson: Diagram = { ...json, id: diagramId };
        sendMessage(
            JSON.stringify({
                type: 'DIAGRAM_CHANGES',
                id: diagramId,
                payload: newJson,
            })
        );
    }, [localDiagramData, isReady, diagramId, wsc]); // Only sync when both data AND socket are ready

    return { liveDiagramData };
};
export default useSyncWithServer;
