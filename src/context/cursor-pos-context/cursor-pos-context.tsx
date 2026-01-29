import { type XYPosition } from '@xyflow/react';
import { createContext } from 'react';

export interface CursorContextType {
    CursorPos: XYPosition;
    onMouseMove: (e: XYPosition) => void;
    cursorNodeId?: string;
}
const CursorPositionContext = createContext<CursorContextType>({
    CursorPos: { x: 0, y: 0 },
    onMouseMove: () => {},
    cursorNodeId: 'cursor-0',
});
export default CursorPositionContext;
