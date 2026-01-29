import type { Node, NodeProps } from '@xyflow/react';
import React from 'react';
export type CursorNodeType = Node<{}, 'cursor'>;

export const CursorNode: React.FC<NodeProps<CursorNodeType>> = React.memo(
    () => {
        return (
            <div className="size-6 text-blue-500 ">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    // className="lucide lucide-mouse-pointer2-icon lucide-mouse-pointer-2"
                >
                    <path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z" />
                </svg>
                <div>{'Username'}</div>
            </div>
        );
    }
);
CursorNode.displayName = 'CursorNode';
