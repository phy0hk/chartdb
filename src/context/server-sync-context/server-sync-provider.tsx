import { type NodeType } from '@/pages/editor-page/canvas/canvas';
import {
    ServerSyncContext,
    WebSocketMessageReqType,
    type WebSocketMessageType,
} from './server-sync-context';
import React, { useEffect, useRef, useState } from 'react';
import { JsonToUint8Array, Uint8ArrayToJson } from '@/lib/export-import-utils';
import { useParams } from 'react-router-dom';
import { useStorage } from '@/hooks/use-storage';
import { type CursorNodeType } from '@/pages/editor-page/canvas/cursor-node/cursor-node';
import { type XYPosition } from '@xyflow/react';
const ServerSyncProvider = ({ children }: { children: React.ReactNode }) => {
    const wsc = useRef<WebSocket>();
    const ws_url = 'ws://localhost:8080';
    const { deleteDiagram, addDiagram } = useStorage();
    const { diagramId } = useParams<{ diagramId: string }>();

    const [Cursors, setCursors] = useState<CursorNodeType[]>([]);
    const onMouseServerUpdate = (position: XYPosition, id: string) => {
        setCursors((prevCursors) => {
            const newCursors = [
                ...prevCursors.filter(
                    (item) => item.data.lastUpdated || 0 > Date.now() - 5000
                ),
            ];
            const cursorIndex = newCursors.findIndex(
                (cursor) => cursor.id === id
            );
            if (cursorIndex !== -1) {
                newCursors[cursorIndex] = {
                    ...newCursors[cursorIndex],
                    position,
                    data: {
                        lastUpdated: Date.now(),
                    },
                };
            } else {
                newCursors.push({
                    id,
                    position,
                    type: 'cursor',
                    data: { lastUpdated: Date.now() },
                });
            }
            return newCursors;
        });
    };

    const initWebSocket = () => {
        wsc.current = new WebSocket(ws_url);
        const ws = wsc.current;
        ws.onopen = () => {
            if (!diagramId) return;
            const greetMessage: WebSocketMessageType = {
                type: WebSocketMessageReqType.GREET,
                diagramId,
            };
            const greet = JsonToUint8Array(greetMessage);
            ws.send(greet);
        };
        ws.onmessage = async (event) => {
            if (event.data instanceof Blob) {
                const arrayBufferData = await event.data.arrayBuffer();
                const unit8Data = new Uint8Array(arrayBufferData);
                const messageJson =
                    Uint8ArrayToJson<WebSocketMessageType>(unit8Data);
                if (!messageJson) return;
                switch (messageJson.type) {
                    case WebSocketMessageReqType.SYNC:
                        handleSync(messageJson, ws);
                        break;
                    case WebSocketMessageReqType.CURSOR_MOVE:
                        onMouseServerUpdate(
                            messageJson.position,
                            'cursor-' + messageJson.id || 'cursor-0'
                        );
                        break;
                }
            }
        };
        ws.onclose = () => {
            console.log('WebSocket closed');
        };
    };

    useEffect(() => {
        console.log(Cursors);
    }, [Cursors]);

    const handleSync = (messageJson: WebSocketMessageType, ws: WebSocket) => {
        if (messageJson.type !== WebSocketMessageReqType.SYNC) return;
        if (!messageJson.diagram) return;
        const { diagram } = messageJson;
        deleteDiagram(diagram.id);
        addDiagram({ diagram });
        const message = {
            type: WebSocketMessageReqType.SYNC,
        };
        const messageBuffer = JsonToUint8Array(message);
        ws.send(messageBuffer);
    };

    setInterval(() => {
        if (!wsc.current) {
            initWebSocket();
        }
    }, 10000);

    const nodesChangePipeline = (changes: NodeType[]) => {
        console.log('Changes: ', changes);
    };

    return (
        <ServerSyncContext.Provider
            value={{ nodesChangePipeline, wsc: wsc, initWebSocket, Cursors }}
        >
            {children}
        </ServerSyncContext.Provider>
    );
};
export default ServerSyncProvider;
