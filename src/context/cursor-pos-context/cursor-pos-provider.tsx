import React, { useState } from 'react';
import CursorPositionContext from './cursor-pos-context';
import { type XYPosition } from '@xyflow/react';

const CursorPositionProvidor = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [CursorPos, setCursorPos] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });
    const onMouseMove = (position: XYPosition) => {
        setCursorPos(position);
    };
    return (
        <CursorPositionContext.Provider
            value={{
                CursorPos: CursorPos,
                onMouseMove,
            }}
        >
            {children}
        </CursorPositionContext.Provider>
    );
};
export default CursorPositionProvidor;
