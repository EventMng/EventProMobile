import { useCallback, useState } from 'react';

import { markAttendance } from '@/services/scannerService';
import { errorFeedback, successFeedback } from '@/utils/haptics';

export function useAttendanceSync() {
  const [isSyncing, setIsSyncing] = useState(false);

  const sync = useCallback(async (registrationId: string, markedBy: string) => {
    setIsSyncing(true);
    try {
      const result = await markAttendance(registrationId, markedBy);
      successFeedback();
      return result;
    } catch (error) {
      errorFeedback();
      throw error;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  return { sync, isSyncing };
}
