import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { Button, Layout, Text } from '@ui-kitten/components';
import React, { useRef, useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import SignatureCanvas, { SignatureCanvasProps } from 'react-signature-canvas';
import { Funcionario } from '../schema/funcionario.schema';
import { RootStackParamList } from '../routes/StackRoutes';
import { uploadAssinaturaCloudinary } from '../services/cloudnary.serivce';
import { calcularTotalParaPagar } from '../util/calculos.util';
import { useRestauranteId } from '../hooks/useRestaurante';
import { usePagamentos } from '../hooks/usePagamentos';
import { useVales } from '../hooks/useVales';
import { formatarDataVales } from '../util/datas.util';
import { alert } from '../util/alertfeedback.util';

export const AssinaturaWeb: React.FC = () => {
  const route = useRoute();
  const { funcObj } = route.params as { funcObj: Funcionario };
  const navigator = useNavigation<NavigationProp<RootStackParamList>>();

  const [assinaturaDataUrl, setAssinaturaDataUrl] = useState<string | null>(null)

  // Specify the type for the ref
  const sigPad = useRef<SignatureCanvas | null>(null);

  const clear = useCallback(() => {
    sigPad.current?.clear();
    setAssinaturaDataUrl(null)
  }, []);

  const save = useCallback(async () => {
    if (sigPad.current) {
      // Get the signature as a data URL (e.g., PNG)
      const dataURL = sigPad.current.getCanvas().toDataURL('image/png');
      setAssinaturaDataUrl(dataURL);
      // console.log('Signature Data URL:', dataURL);
    }
  }, []);

  // Optional: Define canvas properties using TypeScript interface
  const canvasProps: SignatureCanvasProps['canvasProps'] = {
    // width: 500,
    height: 300,
    className: 'signatureCanvas',
    style: { border: '4px solid #000000' }
  };

  const { data: res_ } = useRestauranteId()
  const { pagarFuncionario } = usePagamentos()
  const { adicionarVale } = useVales()

  const [isLoading, setIsLoading] = useState(false)
  const confirmarPagamento = async () => {
    try {
      setIsLoading(true)
      if (!assinaturaDataUrl) {
        Alert.alert("Erro", "Nenhuma assinatura encontrada");
        return;
      }

      const cloudnary_url = await uploadAssinaturaCloudinary(assinaturaDataUrl);
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
    <View style={styles.container}>
      <SignatureCanvas
        ref={sigPad}
        penColor='black'
        canvasProps={canvasProps}
        maxWidth={2}
        dotSize={2}
      />

      <Layout style={styles.buttons}>
        <View style={styles.controlButtons}>
          <Button
            style={{ flex: 1 }}
            status='warning'
            appearance='outline'
            onPress={clear}
          >Limpar assinatura</Button>

          <Button
            style={{ flex: 1 }}
            status='info'
            appearance='outline'
            onPress={save}
          >Salvar assinatura</Button>
        </View>

        <Button
          onPress={confirmarPagamento}
          disabled={!assinaturaDataUrl || isLoading}
          accessoryLeft={<MaterialIcons name="payment" size={18} color={'black'} />}
        >{(isLoading) ? 'Confirmando...' : 'Confirmar pagamento'}</Button>
      </Layout>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-between'
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