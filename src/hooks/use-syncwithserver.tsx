// import { useEffect, useRef, useState } from 'react';
// import { useLiveQuery } from 'dexie-react-hooks';
// import { useChartDB } from './use-chartdb';
// import { useParams } from 'react-router-dom';
// import {
//     diagramToJSONOutputWs,
//     JsonToUint8Array,
//     SendMessage,
// } from '@/lib/export-import-utils';
// import type { Diagram } from '@/lib/domain';
// import { useStorage } from './use-storage';
// // import { useLocation } from 'react-use';
// import type { EdgeChange, NodeChange } from '@xyflow/react';
// import type { EdgeType, NodeType } from '@/pages/editor-page/canvas/canvas';

// export type WebSocketMessageType =
//     | {
//           type: WebSocketMessageReqType.DIAGRAM_CHANGES;
//           diagramId: string;
//           payload: Diagram | undefined;
//       }
//     | {
//           type: WebSocketMessageReqType.NODE_UPDATE;
//           changes: string;
//       }
//     | {
//           type: WebSocketMessageReqType.EDGE_UPDATE;
//           userId: string;
//           changes: string;
//       }
//     | {
//           type: WebSocketMessageReqType.CURSOR_MOVE;
//           userId: string;
//           position: { x: number; y: number };
//       }
//     | {
//           type: WebSocketMessageReqType.DIAGRAM_BROADCAST;
//           payload: Diagram;
//       }
//     | {
//           type: WebSocketMessageReqType.DIAGRAM_NOT_EXIST;
//       }
//     | {
//           type: WebSocketMessageReqType.DIAGRAM_CREATE;
//       };

// export enum WebSocketMessageReqType {
//     DIAGRAM_CHANGES = 'DIAGRAM_CHANGES',
//     WELCOME = 'WELCOME',
//     EDGE_UPDATE = 'EDGE_UPDATE',
//     NODE_UPDATE = 'NODE_UPDATE',
//     CURSOR_MOVE = 'CURSOR_MOVE',
//     NEW_PLAYER = 'NEW_PLAYER',
//     DIAGRAM_BROADCAST = 'DIAGRAM_BROADCAST',
//     GREET = 'GREET',
//     DIAGRAM_NOT_EXIST = 'DIAGRAM_NOT_EXIST',
//     DIAGRAM_CREATE = 'DIAGRAM_CREATE',
//     NODE_SYNC = 'NODE_SYNC',
// }
// const useSyncWithServer = () => {
//     const { diagramId } = useParams<{ diagramId: string }>();
//     const { loadDiagram } = useChartDB();
//     // const [wsc, setWSC] = useState<WebSocket | null>(null);
//     const { deleteDiagram, addDiagram } = useStorage();
//     const [LiveNodeChanges, setLiveNodeChanges] = useState<
//         NodeChange<NodeType>[]
//     >([]);
//     const wsc = useRef<WebSocket>();
//     const [LiveEdgeChanges, setLiveEdgeChanges] = useState<
//         EdgeChange<EdgeType> | undefined
//     >();

//     const [sync, setSync] = useState<boolean>(false);
//     const ws_url = 'ws://localhost:8080';
//     // Track if the socket is actually ready to receive data
//     const [isReady, setIsReady] = useState(false);
//     const [DiagramNotExist, setDiagramNotExist] = useState(false);
//     const [LiveDiagramData, setLiveDiagramData] = useState<Diagram | undefined>(
//         undefined
//     );
//     const currentDiagramData = useRef<Diagram>();
//     const localDiagramData = useLiveQuery(() => {
//         if (!diagramId) return undefined;
//         return loadDiagram(diagramId);
//     }, [diagramId]);

//     const ClearLiveNodeChanges = () => {
//         setLiveNodeChanges([]);
//     };
//     const ClearLiveEdgeChanges = () => {
//         setLiveEdgeChanges(undefined);
//     };

//     // useEffect(() => {
//     //     const socket = new WebSocket(ws_url);

//     //     const onOpen = () => {
//     //         console.log('Connected to WebSocket');
//     //         setIsReady(true);
//     //     };
//     //     const onClose = () => {
//     //         setIsReady(false);
//     //         setSync(false);
//     //         // Optional: Add a delay before reconnecting to avoid infinite loops
//     //         setTimeout(() => (wsc.current = new WebSocket(ws_url)), 3000);
//     //     };
//     //     const onMessage = async (event: MessageEvent) => {
//     //         try {
//     //             if (event.data instanceof Blob) {
//     //                 const arrayBufferData = await event.data.arrayBuffer();
//     //                 const unit8Data = new Uint8Array(arrayBufferData);
//     //                 // console.log(Unit8ArrayToJson());
//     //                 const messageJson =
//     //                     Uint8ArrayToJson<WebSocketMessageType>(unit8Data);
//     //                 if (!messageJson) return;
//     //                 if (
//     //                     messageJson.type === WebSocketMessageReqType.NODE_UPDATE
//     //                 ) {
//     //                     const changes = JSON.parse(
//     //                         messageJson.changes
//     //                     ) as NodeChange<NodeType>[];
//     //                     setLiveNodeChanges(changes);
//     //                 } else if (
//     //                     messageJson.type === WebSocketMessageReqType.EDGE_UPDATE
//     //                 ) {
//     //                     const changes = JSON.parse(
//     //                         messageJson.changes
//     //                     ) as EdgeChange<EdgeType>;
//     //                     setLiveEdgeChanges(changes);
//     //                 } else if (
//     //                     messageJson.type ===
//     //                     WebSocketMessageReqType.DIAGRAM_BROADCAST
//     //                 ) {
//     //                     const payload = messageJson.payload;
//     //                     if (!payload) return;
//     //                     if (!currentDiagramData.current) return;
//     //                     const payloadTime = new Date(
//     //                         payload.updatedAt
//     //                     ).getTime();
//     //                     const localTime = new Date(
//     //                         currentDiagramData.current.updatedAt
//     //                     ).getTime();
//     //                     if (payloadTime > localTime) {
//     //                         console.log(payloadTime, localTime);
//     //                         setLiveDiagramData(payload);
//     //                         setSync(true);
//     //                     }
//     //                 } else if (
//     //                     messageJson.type ===
//     //                     WebSocketMessageReqType.DIAGRAM_NOT_EXIST
//     //                 ) {
//     //                     setDiagramNotExist(true);
//     //                 }
//     //             }
//     //         } catch (err) {
//     //             console.log(err);
//     //         }
//     //     };
//     //     const onError = (err: Event) => console.error('WebSocket Error:', err);

//     //     socket.addEventListener('open', onOpen);
//     //     socket.addEventListener('close', onClose);
//     //     socket.addEventListener('error', onError);
//     //     socket.addEventListener('message', onMessage);
//     //     wsc.current = socket;

//     //     // Cleanup: Important to prevent memory leaks and duplicate listeners
//     //     return () => {
//     //         socket.removeEventListener('open', onOpen);
//     //         socket.removeEventListener('close', onClose);
//     //         socket.removeEventListener('error', onError);
//     //         socket.removeEventListener('message', onMessage);
//     //         socket.close();
//     //     };
//     // }, [addDiagram, deleteDiagram, ws_url, LiveDiagramData]);

//     // 2. Sync Logic
//     useEffect(() => {
//         if (!localDiagramData || !isReady || !diagramId) return;
//         currentDiagramData.current = localDiagramData;
//         const jsonDataString = diagramToJSONOutputWs(localDiagramData);
//         const json = JSON.parse(jsonDataString) as Diagram;
//         const newJson: Diagram = { ...json, id: diagramId };
//         SendMessage(
//             {
//                 type: WebSocketMessageReqType.DIAGRAM_CHANGES,
//                 id: diagramId,
//                 payload: newJson,
//             },
//             wsc.current
//         );
//     }, [localDiagramData, isReady, diagramId, wsc, DiagramNotExist]); // Only sync when both data AND socket are ready

//     const onNodeChangeSync = (changes: NodeChange<NodeType>[]) => {
//         if (!wsc.current) return;
//         const changesNodes = JSON.stringify(changes);
//         // console.log(changesNodes);
//         const nodeChangeEvent = {
//             type: WebSocketMessageReqType.NODE_UPDATE,
//             changes: changesNodes,
//         };
//         const nodeChangeEventByteData = JsonToUint8Array(nodeChangeEvent);
//         if (wsc.current?.readyState === WebSocket.OPEN) {
//             wsc.current.send(nodeChangeEventByteData);
//         }
//     };
//     const onEdgeChangeSync = (changes: EdgeChange<EdgeType>[]) => {
//         if (!wsc.current) return;
//         const changesEdges = JSON.stringify(changes);
//         const edgeChangeEvent = {
//             type: WebSocketMessageReqType.EDGE_UPDATE,
//             changes: changesEdges,
//         };
//         const edgeChangeEventByteData = JsonToUint8Array(edgeChangeEvent);
//         if (wsc.current?.readyState === WebSocket.OPEN) {
//             wsc.current.send(edgeChangeEventByteData);
//         }
//     };

//     return {
//         LiveDiagramData,
//         onNodeChangeSync,
//         onEdgeChangeSync,
//         LiveNodeChanges,
//         LiveEdgeChanges,
//         ClearLiveNodeChanges,
//         ClearLiveEdgeChanges,
//         sync,
//     };
// };
// export default useSyncWithServer;
