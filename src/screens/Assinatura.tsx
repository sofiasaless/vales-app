import {
  Button,
  Layout
} from '@ui-kitten/components';
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { SignaturePad, SignaturePadRef } from '../components/SignaturePad';
import { RootStackParamList } from '../routes/StackRoutes';

export const Assinatura = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const signatureRef = useRef<SignaturePadRef>(null);
  const [assinaturaBase64, setAssinaturaBase64] = useState<string | null>(null);

  const salvarAssinatura = (base64: string) => {
    setAssinaturaBase64(base64);
    Alert.alert("Assinatura capturada!");
  };

  const gerarECompartilharPDF = async () => {
    if (!assinaturaBase64) {
      Alert.alert("Erro", "Nenhuma assinatura encontrada");
      return;
    }

    const html = `
        <html>
          <body style="padding: 24px; font-family: Arial;">
            <h2>Termo de Assinatura</h2>
  
            <p><strong>Nome:</strong> Fulano de Tal</p>
            <p><strong>Data:</strong> ${new Date().toLocaleDateString()}</p>
  
            <p>Assinatura:</p>
  
            <img 
              src="${assinaturaBase64}" 
              style="width: 300px; border: 1px solid #000;"
            />
          </body>
        </html>
      `;

    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    await Sharing.shareAsync(uri);
  };

  return (
    <Layout style={styles.container}>
      <SignaturePad ref={signatureRef} onSave={salvarAssinatura} />

      <View style={styles.buttons}>
        <View style={styles.controlButtons}>
          <Button
            style={{flex: 1}}
            status='warning'
            appearance='outline'
            onPress={() => signatureRef.current?.limpar()}
          >Limpar assinatura</Button>

          <Button
            style={{flex: 1}}
            status='info'
            appearance='outline'
            onPress={() => signatureRef.current?.salvar()}
          >Salvar assinatura</Button>
        </View>

        <Button
          onPress={gerarECompartilharPDF}
          disabled={!assinaturaBase64}
        >Gerar comprovante PDF e compartilhar</Button>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttons: {
    padding: 15,
    gap: 10
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 10
  }
});