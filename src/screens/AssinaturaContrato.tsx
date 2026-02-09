import {
  Button,
  Layout
} from '@ui-kitten/components';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { SignaturePad, SignaturePadRef } from '../components/SignaturePad';
import { FuncionarioFirestore } from '../firestore/funcionario.firestore';
import { RootStackParamList } from '../routes/StackRoutes';
import { FuncionarioPostRequestBody } from '../schema/funcionario.schema';
import { uploadAssinaturaCloudinary } from '../services/cloudnary.serivce';
import { alert } from '../util/alertfeedback.util';

export const AssinaturaContrato = () => {
  const route = useRoute();
  const { funcObj } = route.params as { funcObj: FuncionarioPostRequestBody };
  const navigator = useNavigation<NavigationProp<RootStackParamList>>();

  const signatureRef = useRef<SignaturePadRef>(null);
  const [assinaturaBase64, setAssinaturaBase64] = useState<string | null>(null);

  const salvarAssinatura = (base64: string) => {
    setAssinaturaBase64(base64);
    Alert.alert("Assinatura capturada!");
  };

  const [isLoading, setIsLoading] = useState(false)
  const contratarFuncionarioComAssinatura = async () => {
    try {
      setIsLoading(true)
      if (!assinaturaBase64) {
        Alert.alert("Erro", "Nenhuma assinatura encontrada");
        return;
      }

      const cloudnary_url = await uploadAssinaturaCloudinary(assinaturaBase64);
      const funcionarioPronto: FuncionarioPostRequestBody = {
        ...funcObj,
        contrato: {
          contratacao_regime_ctl: funcObj.contrato?.contratacao_regime_ctl || false,
          descricao_servicos: funcObj.contrato?.descricao_servicos || '',
          assinaturas: {
            contratado: cloudnary_url.secure_url,
            contratante: ''
          }
        }
      }

      const funcSer = new FuncionarioFirestore()
      await funcSer.criar(funcionarioPronto);
      Alert.alert("Sucesso ao contratar!", "Confira na área de funcionários, o contrato estará disponível no perfil.", [{
        text: 'Confirmar',
        onPress: () => {
          signatureRef.current?.limpar()
          navigator.goBack()
        }
      }])
    } catch (error: any) {
      alert('Ocorreu um erro ao confirmar pagamento do funcionário', error);
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <Layout style={styles.container}>
      <SignaturePad ref={signatureRef} onSave={salvarAssinatura} />

      <View style={styles.buttons}>
        <View style={styles.controlButtons}>
          <Button
            style={{ flex: 1 }}
            status='warning'
            appearance='outline'
            onPress={() => signatureRef.current?.limpar()}
          >Limpar assinatura</Button>

          <Button
            style={{ flex: 1 }}
            status='info'
            appearance='outline'
            onPress={() => signatureRef.current?.salvar()}
          >Salvar assinatura</Button>
        </View>

        <Button
          onPress={contratarFuncionarioComAssinatura}
          disabled={!assinaturaBase64 || isLoading}
        >{(isLoading) ? 'Contratando...' : 'Confirmar contratação'}</Button>
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