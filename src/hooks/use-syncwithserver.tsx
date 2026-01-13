import { useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useChartDB } from './use-chartdb';
import { useParams } from 'react-router-dom';
export const useSyncWithServer = () => {
    // const dbdata = useLiveQuery(db);
    const { diagramId } = useParams<{ diagramId: string }>();
    const { loadDiagram } = useChartDB();
    // const [_, setWSC] = useState<WebSocket | null>(null);

    // const [_, setJsonDiagramData] = useState<string | undefined>(
    //     undefined
    // );
    const liveDiagramData = useLiveQuery(() => {
        if (!diagramId) return undefined;
        return loadDiagram(diagramId);
    });

    useEffect(() => {
        const websocket = connectWebsocket();
        websocket.addEventListener('open', (e) => {
            console.log(e);
        });
        websocket.addEventListener('message', (e) => {
            console.log(e);
        });
        return () => {
            websocket.close();
        };
    }, [diagramId]);

    const connectWebsocket = () => {
        const websocket = new WebSocket('ws://localhost:8082');
        // setWSC(websocket);
        return websocket;
    };

    useEffect(() => {
        if (!liveDiagramData) return;
        // const json = diagramToJSONOutput(liveDiagramData);
        // setJsonDiagramData(json);
    }, [liveDiagramData]);
    return { liveDiagramData };
};
