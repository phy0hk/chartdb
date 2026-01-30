import React, { type RefObject, useState } from 'react';
import CursorPositionContext from './cursor-pos-context';
import { type XYPosition } from '@xyflow/react';
import {
    WebSocketMessageReqType,
    type WebSocketMessageType,
} from '../server-sync-context/server-sync-context';
import { JsonToUint8Array } from '@/lib/export-import-utils';

const CursorPositionProvidor = ({
    children,
}: {
    children: React.ReactNode;
    wsc?: RefObject<WebSocket>;
}) => {
    const [UserCursor, setUserCursor] = useState({ x: 0, y: 0 });
    //This will be use to sent user current cursor position to server
    // useEffect(() => {
    //     if (!wsc || !wsc.current) return;
    //     const ws = wsc.current;
    //     const message: WebSocketMessageType = {
    //         type: WebSocketMessageReqType.CURSOR_MOVE,
    //         position: UserCursor,
    //     };
    //     const byteData = JsonToUint8Array(message);
    //     ws.send(byteData);
    // }, [UserCursor, wsc]);
    // const handleCursorOthersCursorChange = (data) => {
    //     console.log(data);
    // };
    // useEffect(() => {
    //     if (!wsc) return;
    //     wsc.addEventListener('message', handleCursorOthersCursorChange);
    //     return () =>
    //         wsc.removeEventListener('message', handleCursorOthersCursorChange);
    // }, [wsc]);

    const onMouseMove = (
        position: XYPosition,
        wsc: RefObject<WebSocket | undefined>
    ) => {
        setUserCursor(position);
        if (!wsc || !wsc.current) return;
        const ws = wsc.current;
        const message: WebSocketMessageType = {
            type: WebSocketMessageReqType.CURSOR_MOVE,
            position: UserCursor,
        };
        const byteData = JsonToUint8Array(message);
        ws.send(byteData);
    };
    return (
        <CursorPositionContext.Provider
            value={{
                onMouseMove,
            }}
        >
            {children}
        </CursorPositionContext.Provider>
    );
};
export default CursorPositionProvidor;
