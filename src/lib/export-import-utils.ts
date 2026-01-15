import { cloneDiagram } from './clone';
import { diagramSchema, type Diagram } from './domain/diagram';
import { generateDiagramId } from './utils';

export const runningIdGenerator = (): (() => string) => {
    let id = 0;
    return () => (id++).toString();
};

export const cloneDiagramWithRunningIds = (
    diagram: Diagram
): { diagram: Diagram; idsMap: Map<string, string> } => {
    const { diagram: clonedDiagram, idsMap } = cloneDiagram(diagram, {
        generateId: runningIdGenerator(),
    });

    return { diagram: clonedDiagram, idsMap };
};

const cloneDiagramWithIds = (diagram: Diagram): Diagram => ({
    ...cloneDiagram(diagram).diagram,
    id: generateDiagramId(),
});
//custom func
const cloneDiagramWithoutIds = (diagram: Diagram): Diagram => ({
    ...cloneDiagram(diagram).diagram,
    id: diagram.id,
});

export const diagramToJSONOutput = (diagram: Diagram): string => {
    const clonedDiagram = cloneDiagramWithRunningIds(diagram).diagram;
    return JSON.stringify(clonedDiagram, null, 2);
};
//custom func
export const diagramToJSONOutputWs = (diagram: Diagram): string => {
    const clonedDiagram = cloneDiagramWithRunningIds(diagram).diagram;
    return JSON.stringify(clonedDiagram, null, 2);
};
export const diagramFromJSONInput = (json: string): Diagram => {
    const loadedDiagram = JSON.parse(json);

    const diagram = diagramSchema.parse({
        ...loadedDiagram,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    return cloneDiagramWithIds(diagram);
};
export const diagramFromJSONInputWithoutNewIds = (json: string): Diagram => {
    const loadedDiagram = JSON.parse(json);

    const diagram = diagramSchema.parse({
        ...loadedDiagram,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    return cloneDiagramWithoutIds(diagram);
};

export const JsonToUint8Array = (json: object): Uint8Array => {
    const encoder = new TextEncoder();
    return encoder.encode(JSON.stringify(json));
};

export const Uint8ArrayToJson = <T>(array: Uint8Array): T | undefined => {
    try {
        const decoder = new TextDecoder();
        return JSON.parse(decoder.decode(array)) as T;
    } catch (err) {
        console.error(err);
        return;
    }
};
export const SendMessage = (
    message: object,
    ws: WebSocket | undefined | null
) => {
    // Critical Check: readyState 1 is "OPEN"
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JsonToUint8Array(message));
    } else {
        console.warn('WebSocket not ready. Message queued or dropped.');
    }
};
