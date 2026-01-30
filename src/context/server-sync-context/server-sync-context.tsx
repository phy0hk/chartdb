import { type Diagram } from '@/lib/domain';
import { type NodeType } from '@/pages/editor-page/canvas/canvas';
import { type CursorNodeType } from '@/pages/editor-page/canvas/cursor-node/cursor-node';
import { type XYPosition } from '@xyflow/react';
import { createContext, type RefObject } from 'react';

type WebSocketMessageType =
    | {
          type: WebSocketMessageReqType.DIAGRAM_CHANGES;
          diagramId: string;
          payload: Diagram | undefined;
      }
    | {
          type: WebSocketMessageReqType.NODE_UPDATE;
          changes: string;
      }
    | {
          type: WebSocketMessageReqType.EDGE_UPDATE;
          userId: string;
          changes: string;
      }
    | {
          type: WebSocketMessageReqType.CURSOR_MOVE;
          position: XYPosition;
          id?: string;
      }
    | {
          type: WebSocketMessageReqType.DIAGRAM_BROADCAST;
          payload: Diagram;
      }
    | {
          type: WebSocketMessageReqType.DIAGRAM_NOT_EXIST;
      }
    | {
          type: WebSocketMessageReqType.DIAGRAM_CREATE;
      }
    | {
          type: WebSocketMessageReqType.GREET;
          diagramId: string;
      }
    | {
          type: WebSocketMessageReqType.SYNC;
          diagram?: Diagram;
      };
enum WebSocketMessageReqType {
    DIAGRAM_CHANGES = 'DIAGRAM_CHANGES',
    WELCOME = 'WELCOME',
    EDGE_UPDATE = 'EDGE_UPDATE',
    NODE_UPDATE = 'NODE_UPDATE',
    CURSOR_MOVE = 'CURSOR_MOVE',
    NEW_PLAYER = 'NEW_PLAYER',
    DIAGRAM_BROADCAST = 'DIAGRAM_BROADCAST',
    GREET = 'GREET',
    DIAGRAM_NOT_EXIST = 'DIAGRAM_NOT_EXIST',
    DIAGRAM_CREATE = 'DIAGRAM_CREATE',
    NODE_SYNC = 'NODE_SYNC',
    SYNC = 'SYNC',
}
interface ServerSyncContextProps {
    nodesChangePipeline: (changes: NodeType[]) => void;
    wsc: RefObject<WebSocket | undefined>;
    initWebSocket: () => void;
    Cursors: CursorNodeType[];
}
const ServerSyncContext = createContext<ServerSyncContextProps>({
    nodesChangePipeline: () => {},
    wsc: { current: undefined },
    initWebSocket: () => {},
    Cursors: [],
});
export {
    ServerSyncContext,
    type ServerSyncContextProps,
    WebSocketMessageReqType,
    type WebSocketMessageType,
};
