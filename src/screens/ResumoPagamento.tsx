import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {
  Button,
  Card,
  Layout,
  Modal,
  Text,
  useTheme,
} from '@ui-kitten/components';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CardGradient } from '../components/CardGradient';
import { DinheiroDisplay } from '../components/DinheiroDisplay';
import { ItemVale } from '../components/ItemVale';
import { mockEmployees } from '../mocks/mockData';
import { customTheme } from '../theme/custom.theme';
import { RootStackParamList } from '../routes/StackRoutes';
import { NavigationProp, useNavigation } from '@react-navigation/native';

export const ResumoPagamento = () => {
  const theme = useTheme();
  const navigator = useNavigation<NavigationProp<RootStackParamList>>();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const employee = mockEmployees[0];
  const paymentDetails = 932;

  if (!employee || !paymentDetails) {
    return (
      <Layout style={styles.centered}>
        {/* <Icon
          name="alert-circle-outline"
          style={[styles.errorIcon, { tintColor: theme['color-danger-500'] }]}
        /> */}
        <Text category="h6">Erro ao carregar pagamento</Text>
        <Button
          appearance="outline"
          style={styles.backButton}
        // onPress={() => navigation.goBack()}
        >
          Voltar
        </Button>
      </Layout>
    );
  }

  const handleConfirmPayment = async () => {
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // const payment: Payment = {
    //   id: `pay-${Date.now()}`,
    //   employeeId: employee.id,
    //   date: new Date(),
    //   baseSalary: paymentDetails.baseSalary,
    //   voucherTotal: paymentDetails.voucherTotal,
    //   amountPaid: paymentDetails.amountPaid,
    //   voucherItems: [...employee.currentVoucher],
    // };

    // dispatch({
    //   type: 'CONFIRM_PAYMENT',
    //   payload: { employeeId: employee.id, payment },
    // });

    setIsProcessing(false);
    setShowConfirmModal(false);
    // navigation.navigate('Home' as never);
  };

  return (
    <Layout style={styles.container}>
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
            <Text appearance="s1">Salário Base</Text>
          </View>

          <DinheiroDisplay size='lg' value={3237.40}/>
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
              <MaterialCommunityIcons name="receipt-text-minus-outline" size={16} color={customTheme['color-danger-600']}  />
            </View>
            <Text appearance="s1">Total do Vale a Descontar</Text>
          </View>

          <DinheiroDisplay
            value={-932}
            size="lg"
            variant="negative"
          />

          {employee.currentVoucher.length > 0 && (
            <View style={styles.voucherList}>
              {employee.currentVoucher.map((item) => (
                <ItemVale
                  dangerStyle
                  key={item.id}
                  item={item}
                  showControls={false}
                />
              ))}
            </View>
          )}
        </CardGradient>

        {/* Total a pagar */}
        <Card style={styles.successCard}>
          <View style={styles.row}>
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: '#6fe0cb57' },
              ]}
            >
              <FontAwesome name="money" size={14} color={customTheme['color-primary-900']} />
            </View>
            <Text status="success" category="s1">
              Total a Pagar
            </Text>
          </View>

          <DinheiroDisplay
            value={382}
            size="xl"
            variant="positive"
          />
        </Card>

        {/* Confirmar */}
        <Button
          status="success"
          size="medium"
          style={styles.confirmButton}
          appearance='outline'
          onPress={() => {
            navigator.navigate('Assinatura');
          }}
          accessoryLeft={<AntDesign name="signature" size={18} color={customTheme['color-primary-400']} />}
        >
          Assinatura do funcinoário
        </Button>

        <Button
          status="success"
          size="medium"
          style={styles.confirmButton}
          onPress={() => setShowConfirmModal(true)}
          accessoryLeft={<MaterialIcons name="payment" size={18} color="black" />}
        >
          Confirmar pagamento
        </Button>
      </Layout>

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

          <Text appearance="s1" style={styles.modalText}>
            Você está prestes a confirmar o pagamento de {employee.name}.
            Certifique-se de coletar a assinatura do funcionário e compartilhar o comprovante de vales.
          </Text>

          <View style={styles.modalAmount}>
            <DinheiroDisplay
              value={303}
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
              disabled={isProcessing}
              onPress={() => setShowConfirmModal(false)}
            >
              Cancelar
            </Button>

            <Button
              status="success"
              disabled={isProcessing}
              onPress={handleConfirmPayment}
            >
              {isProcessing ? 'Processando...' : 'Confirmar'}
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
    borderRadius: 16
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
    borderColor: 'rgba(46, 184, 114, 0.3)',
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
  confirmButton: {
    marginTop: 12,
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
});
