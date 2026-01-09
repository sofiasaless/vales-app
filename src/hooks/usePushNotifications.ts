import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { firestore } from '../config/firebase.config';
import { registerForPushNotifications } from '../services/pushNotification';

export function usePushNotifications() {
  useEffect(() => {
    async function init() {
      const token = await registerForPushNotifications();

      console.info('token ', token || 'nada')

      if (!token) return;

      await setDoc(
        doc(firestore, 'pushTokens', token),
        {
          token,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

    init();
  }, []);
}