import { type XYPosition } from '@xyflow/react';
import { createContext, type RefObject } from 'react';

export interface CursorContextType {
    onMouseMove: (e: XYPosition, wsc: RefObject<WebSocket | undefined>) => void;
}
const CursorPositionContext = createContext<CursorContextType>({
    onMouseMove: () => {},
});
export default CursorPositionContext;
