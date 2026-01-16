import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  Button,
  Layout
} from '@ui-kitten/components';
import React, { useRef, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { SignaturePad, SignaturePadRef } from '../components/SignaturePad';
import { usePagamentos } from '../hooks/usePagamentos';
import { useRestauranteId } from '../hooks/useRestaurante';
import { useVales } from '../hooks/useVales';
import { RootStackParamList } from '../routes/StackRoutes';
import { Funcionario } from '../schema/funcionario.schema';
import { uploadAssinaturaCloudinary } from '../services/cloudnary.serivce';
import { alert } from '../util/alertfeedback.util';
import { calcularTotalParaPagar, calcularTotalVales } from '../util/calculos.util';
import { formatarDataVales } from '../util/datas.util';

export const Assinatura = () => {
  const route = useRoute();
  const { funcObj } = route.params as { funcObj: Funcionario };
  const navigator = useNavigation<NavigationProp<RootStackParamList>>();

  const signatureRef = useRef<SignaturePadRef>(null);
  const [assinaturaBase64, setAssinaturaBase64] = useState<string | null>(null);

  const { data: res_ } = useRestauranteId()
  const { pagarFuncionario } = usePagamentos()
  const { adicionarVale } = useVales()

  const salvarAssinatura = (base64: string) => {
    setAssinaturaBase64(base64);
    Alert.alert("Assinatura capturada!");
  };

  const [isLoading, setIsLoading] = useState(false)
  const gerarECompartilharPDF = async () => {
    try {
      setIsLoading(true)
      if (!assinaturaBase64) {
        Alert.alert("Erro", "Nenhuma assinatura encontrada");
        return;
      }

      const cloudnary_url = await uploadAssinaturaCloudinary(assinaturaBase64);
      const res = await pagarFuncionario(funcObj.id, {
        incentivo: funcObj.incentivo,
        vales: formatarDataVales(funcObj.vales),
        valor_pago: calcularTotalParaPagar(funcObj),
        restaurante_ref: res_?.uid || '',
        salario_atual: funcObj.salario,
        assinatura: cloudnary_url.secure_url
      });

      if (res.ok) {
        // verificar se o pagamento foi negativo e se for adicionar como novo vale
        if (calcularTotalParaPagar(funcObj) < 0) {
          await adicionarVale(funcObj.id, {
            id: Math.random().toString(),
            descricao: 'Negativo última quinzena',
            data_adicao: new Date(),
            preco_unit: calcularTotalParaPagar(funcObj) * -1,
            quantidade: 1
          })
        }
        navigator.navigate('Tabs')
      } else {
        alert('Ocorreu um erro ao confirmar pagamento do funcionário', res.message);
      }
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
          onPress={gerarECompartilharPDF}
          disabled={!assinaturaBase64 || isLoading}
          accessoryLeft={<MaterialIcons name="payment" size={18} color={'black'} />}
        >{(isLoading) ? 'Confirmando...' : 'Confirmar pagamento'}</Button>
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