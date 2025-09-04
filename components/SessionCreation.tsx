// app/components/SessionProvider.tsx
'use client';

import { useCreateOrRestoreSessionMutation } from '@/store/api/sessionApi';
import { useEffect, useRef } from 'react';

export default function SessionProvider() {
  const [createOrRestore] = useCreateOrRestoreSessionMutation();
  const inProgress = useRef(false);

  useEffect(() => {
    const run = async () => {
      if (inProgress.current) return;
      inProgress.current = true;
      try {
        const storedTid = localStorage.getItem('tid');
        const storedSsid = localStorage.getItem('ssid');

        const res = await createOrRestore({
          tid: storedTid || null,
          ssid: storedSsid || null,
        }).unwrap();

        const { tid, deviceId } = res.data || {};
        if (tid) localStorage.setItem('tid', tid);
        if (deviceId) localStorage.setItem('ssid', deviceId);
      } catch (e) {
        // swallow errors; backend is source of truth
        console.error('Session create/restore failed', e);
      } finally {
        inProgress.current = false;
      }
    };

    run();
  }, [createOrRestore]);

  return null;
}
