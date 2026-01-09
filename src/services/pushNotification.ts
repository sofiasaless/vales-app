// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';
// import { Alert, Platform } from 'react-native';

// export async function registerForPushNotifications() {
//   try {
    
//     Alert.alert('regis')
//     if (!Device.isDevice) {
//       Alert.alert('Precisa ser dispositivo físico');
//       return null;
//     }
//     const { status: existingStatus } =
//       await Notifications.getPermissionsAsync();
  
//     let finalStatus = existingStatus;
  
//     if (existingStatus !== 'granted') {
//       const { status } =
//         await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
  
//     if (finalStatus !== 'granted') {
//       Alert.alert('Permissão negada');
//       return null;
//     }
    
//     Alert.alert('oq tem no project id', PROJECT_ID)
  
//     const token = (
//       await Notifications.getExpoPushTokenAsync({
//         projectId: PROJECT_ID,
//       })
//     ).data;
  
//     Alert.alert('Expo Push Token:', token);
  
//     if (Platform.OS === 'android') {
//       await Notifications.setNotificationChannelAsync('default', {
//         name: 'default',
//         importance: Notifications.AndroidImportance.MAX,
//       });
//     }
  
//     return token;
//   } catch (error: any) {
//     Alert.alert('erro ao registrar o token ', error)
//     return ''
//   }
// }

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export async function registerForPushNotifications() {
  try {
    
    if (!Device.isDevice) {
      console.log('Não é dispositivo físico');
      return null;
    }
  
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
  
    let finalStatus = existingStatus;
  
    if (existingStatus !== 'granted') {
      const { status } =
        await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
  
    if (finalStatus !== 'granted') {
      console.log('Permissão negada');
      return null;
    }
    
    console.log('projectId:', Constants.expoConfig?.extra?.eas?.projectId);
  
    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })
    ).data;
  
    console.log('Expo push token:', token);
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(
        'default',
        {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
        }
      );
    }
    return token;
  } catch (error) {
    console.error('erro ao setar expo token ', error)    
    return null
  }  
}
