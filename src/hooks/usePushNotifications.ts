import { useEffect } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../config/firebase.config';
import { registerForPushNotifications } from '../services/pushNotification';
import { Alert } from 'react-native';

export function usePushNotifications() {
  useEffect(() => {
    async function init() {
      const token = await registerForPushNotifications();

      Alert.alert('token ', token || 'nada')

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