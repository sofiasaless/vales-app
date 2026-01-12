import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  Button,
  Card,
  Layout,
  Modal,
  Text
} from '@ui-kitten/components';
import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';

import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { CardGradient } from '../components/CardGradient';
import { DinheiroDisplay } from '../components/DinheiroDisplay';
import { ItemVale } from '../components/ItemVale';
import { useEventoAlteracoesContext } from '../context/EventoAlteracaoContext';
import { usePagamentos } from '../hooks/usePagamentos';
import { useRestauranteId } from '../hooks/useRestaurante';
import { RootStackParamList } from '../routes/StackRoutes';
import { Funcionario } from '../schema/funcionario.schema';
import { customTheme } from '../theme/custom.theme';
import { alert } from '../util/alertfeedback.util';
import { calcularTotalVales } from '../util/calculos.util';
import { formatarDataVales } from '../util/datas.util';

interface RouteParams {
  funcObj: Funcionario
}

export const ResumoPagamento = () => {
  const route = useRoute();
  const { funcObj } = route.params as RouteParams;
  const navigator = useNavigation<NavigationProp<RootStackParamList>>();

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const salarioBase = () => {
    return (funcObj.tipo === 'FIXO')?(funcObj.salario / 2):(funcObj.salario * 3)
  }

  const totalParaPagar = (salarioBase() - calcularTotalVales(funcObj.vales));

  const { eventoNovaAdicaoVale } = useEventoAlteracoesContext()

  const { data: res_ } = useRestauranteId()

  const { isLoading, pagarFuncionario } = usePagamentos()

  const handleConfirmPayment = async () => {
    const res = await pagarFuncionario(funcObj.id, {
      incentivo: [],
      vales: formatarDataVales(funcObj.vales),
      valor_pago: totalParaPagar,
      restaurante_ref: res_?.uid || '',
      salario_atual: funcObj.salario
    })

    if (res.ok) {
      eventoNovaAdicaoVale()
      navigator.navigate('Tabs')
      setShowConfirmModal(false);
    } else {
      alert('Ocorreu um erro ao pagar o funcionário', res.message);
    }
  };

  return (
    <Layout style={styles.container}>
      <ScrollView>

        <Layout style={styles.content}>
          <CardGradient colors_one='2' colors_two='1' styles={[styles.card, styles.basicCard]}>
            <View style={styles.row}>
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: '#3ac28938' },
                ]}
              >
                <AntDesign name="wallet" size={14} color={customTheme['color-primary-400']} />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 40}}>
                <Text category="s1">{(funcObj.tipo === 'FIXO')?'Quinzena':'Diárias'}</Text>
                <Text category='c2' appearance='hint'>(Base) R$ {salarioBase().toFixed(2)}</Text>
              </View>
            </View>
            <DinheiroDisplay size='lg' value={salarioBase()} />
          </CardGradient>

          {/* Vale */}
          <CardGradient colors_one='2' colors_two='1' styles={[styles.card, styles.dangerCard]}>
            <View style={styles.row}>
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: '#ef6a5b3b' },
                ]}
              >
                <MaterialCommunityIcons name="receipt-text-minus-outline" size={16} color={customTheme['color-danger-600']} />
              </View>
              <Text category="s1">Total do Vale a Descontar</Text>
            </View>

            <DinheiroDisplay
              value={-calcularTotalVales(funcObj.vales)}
              size="lg"
              variant="negative"
            />

            <View style={{ maxHeight: 180, marginTop: 10 }}>
              {
                funcObj?.vales?.length > 0 ? (
                  <FlatList
                    data={funcObj.vales}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                      <ItemVale key={item.id} item={item} showControls={false} dangerStyle />
                    )}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                  />
                ) : (
                  <Card style={styles.emptyCard}>
                    <Text appearance="hint" style={styles.emptyText}>
                      Nenhum item no vale
                    </Text>
                  </Card>
                )
              }
            </View>
          </CardGradient>

          {/* Total a pagar */}
          <Card style={styles.successCard}>
            <View style={styles.row}>
              <View
                style={[
                  styles.iconWrapper,
                  { backgroundColor: '#6fe0cb2f' },
                ]}
              >
                <MaterialIcons name="payments" size={16} color={customTheme['color-success-600']} />
              </View>
              <Text status="success" category="s1">
                Total a Pagar
              </Text>
            </View>

            <DinheiroDisplay
              value={totalParaPagar}
              size="xl"
              variant="positive"
            />
          </Card>

          {/* Confirmar */}
          <Button
            size="medium"
            appearance='outline'
            onPress={() => {
              navigator.navigate('Assinatura');
            }}
            accessoryLeft={<AntDesign name="signature" size={18} color={customTheme['color-primary-400']} />}
          >
            Assinatura do funcinoário
          </Button>

          <Button
            size="medium"
            onPress={() => setShowConfirmModal(true)}
            accessoryLeft={<MaterialIcons name="payment" size={18} color="black" />}
          >
            Confirmar pagamento
          </Button>
        </Layout>
      </ScrollView>

      {/* Modal de confirmação */}
      <Modal
        visible={showConfirmModal}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setShowConfirmModal(false)}
      >
        <Card disabled style={styles.modal}>
          <Text category="h6" style={styles.modalTitle}>
            Confirmar Pagamento
          </Text>

          <Text category="s2" style={styles.modalText}>
            Você está prestes a confirmar o pagamento.
            Certifique-se de coletar a assinatura do funcionário e compartilhar o comprovante de vales antes de confirmar.
          </Text>

          <View style={styles.modalAmount}>
            <DinheiroDisplay
              value={totalParaPagar}
              size="xl"
              variant="positive"
            />
          </View>

          <View style={styles.warningBox}>
            <Text status="warning" category="c1">
              ⚠️ O vale será zerado após a confirmação
            </Text>
          </View>

          <View style={styles.modalActions}>
            <Button
              appearance="outline"
              disabled={isLoading}
              onPress={() => setShowConfirmModal(false)}
            >
              Cancelar
            </Button>

            <Button
              status="success"
              disabled={isLoading}
              onPress={handleConfirmPayment}
            >
              {isLoading ? 'Processando...' : 'Confirmar'}
            </Button>
          </View>
        </Card>
      </Modal>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    gap: 5
  },
  basicCard: {
    borderColor: customTheme['text-disabled-color'],
    borderWidth: 1,
    borderRadius: 16
  },
  dangerCard: {
    borderColor: 'rgba(255, 0, 0, 0.36)',
    borderWidth: 1.2,
  },
  successCard: {
    backgroundColor: 'rgba(46, 184, 114, 0.12)',
    borderColor: 'rgba(46, 184, 115, 0.46)',
    borderWidth: 1,
    borderRadius: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  iconWrapper: {
    padding: 7,
    borderRadius: 999,
  },
  voucherList: {
    marginTop: 12
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorIcon: {
    width: 48,
    height: 48,
    marginBottom: 12,
  },
  backButton: {
    marginTop: 16,
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modal: {
    width: 320,
    padding: 20,
    borderRadius: 16,
  },
  modalTitle: {
    marginBottom: 8,
  },
  modalText: {
    marginBottom: 16,
  },
  modalAmount: {
    alignItems: 'center',
    marginBottom: 12,
  },
  warningBox: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(245, 166, 35, 0.15)',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    marginTop: 8,
  },
});
