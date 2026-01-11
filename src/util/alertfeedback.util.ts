import { Alert } from "react-native"

interface AlertBtnProps {
  message: string,
  actions: () => any
}

interface AlertBtn {
  props: AlertBtnProps[]
}

export const alert = (title: string, message?: string) => {
  return Alert.alert(title, message);
}