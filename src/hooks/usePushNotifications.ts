import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { firestore } from '../config/firebase.config';
import { restauranteFirestore } from '../firestore/restaurante.firestore';
import { registerForPushNotifications } from '../services/pushNotification';
import { useRestauranteId } from './useRestaurante';

export function usePushNotifications() {
  const { data: restaurante, isLoading } = useRestauranteId()

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

      if (restaurante) {
        restauranteFirestore.atualizarPushToken(restaurante.uid, token)
      }
    }

    init();
  }, [isLoading, restaurante]);
}