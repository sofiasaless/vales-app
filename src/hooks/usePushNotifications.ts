import { useEffect } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../config/firebase.config';
import { registerForPushNotifications } from '../services/pushNotification';
import { Alert } from 'react-native';

export function usePushNotifications() {
  useEffect(() => {
      Alert.alert('cheguei na funcao de usePushNotifica')
    async function init() {
      Alert.alert('cheguei na funcao init')
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