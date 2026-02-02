import React, { useRef, useState } from "react";
import { View, Button, Alert, StyleSheet } from "react-native";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { SignaturePad, SignaturePadRef } from "../components/SignaturePad";

export const SignatureScreen: React.FC = () => {
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
    <View style={styles.container}>
      <View style={styles.signatureContainer}>
        <SignaturePad ref={signatureRef} onSave={salvarAssinatura} />
      </View>

      <View style={styles.buttons}>
        <Button
          title="Limpar assinatura"
          onPress={() => signatureRef.current?.limpar()}
        />

        <Button
          title="Salvar assinatura"
          onPress={() => signatureRef.current?.salvar()}
        />

        <Button
          title="Gerar PDF e compartilhar"
          onPress={gerarECompartilharPDF}
          disabled={!assinaturaBase64}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  signatureContainer: {
    flex: 1,
  },
  buttons: {
    padding: 16,
    gap: 12,
  },
});
