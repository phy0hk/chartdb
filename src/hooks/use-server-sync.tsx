import { ServerSyncContext } from '@/context/server-sync-context/server-sync-context';
import { useContext } from 'react';

const useServerSync = () => useContext(ServerSyncContext);
export default useServerSync;
