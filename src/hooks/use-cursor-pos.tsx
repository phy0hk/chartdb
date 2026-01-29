import CursorPositionContext from '@/context/cursor-pos-context/cursor-pos-context';
import { useContext } from 'react';

export const useCursorPos = () => {
    return useContext(CursorPositionContext);
};
