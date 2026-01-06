import Entypo from '@expo/vector-icons/Entypo';
import {
  Avatar,
  Button,
  Card,
  Divider,
  Layout,
  Text
} from '@ui-kitten/components';
import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { DinheiroDisplay } from '../components/DinheiroDisplay';
import { mockEmployees } from '../mocks/mockData';
import { formatCPF, formatDate, getPaydayText } from '../util/formatadores.util';
import { customTheme } from '../theme/custom.theme';
import { CardGradient } from '../components/CardGradient';

export const DetalhesFuncionario = () => {
  // const navigation = useNavigation();

  const employee = mockEmployees[0];

  if (!employee) {
    return (
      <Layout style={styles.center}>
        {/* <Icon
          name="alert-circle-outline"
          style={[styles.iconLarge, { tintColor: customTheme['color-danger-500'] }]}
        /> */}
        <Text category="h6">Funcionário não encontrado</Text>
        <Button
          appearance="outline"
          style={styles.mt}
        // onPress={() => navigation.goBack()}
        >
          Voltar
        </Button>
      </Layout>
    );
  }


  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: ReactNode;
    label: string;
    value: string | React.ReactNode;
  }) => {
    return (
      <View style={styles.infoRow}>
        <View style={styles.infoIcon}>
          {icon}
        </View>

        <View style={{ flex: 1 }}>
          <Text appearance="hint" category="c1">
            {label}
          </Text>
          {typeof value === 'string' ? (
            <Text category="s1">{value}</Text>
          ) : (
            value
          )}
        </View>
      </View>
    );
  }

  return (
    <Layout style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Header Card */}
        <Card style={styles.cardCenter}>
          <Avatar size='giant' source={{ uri: 'https://static.vecteezy.com/ti/vetor-gratis/p1/7319933-black-avatar-person-icons-user-profile-icon-vetor.jpg' }} />
          <Text category="h5" style={styles.name}>
            {employee.name}
          </Text>
          <Text appearance="hint">{employee.role}</Text>

          <View style={styles.typeBadge}>
            <Text category="c1" style={{ color: customTheme['color-primary-600'] }}>
              {employee.type === 'DIARISTA'
                ? 'Diarista'
                : 'Fixo (Quinzenas)'}
            </Text>
          </View>
        </Card>

        {/* Personal Info */}
        <Card style={styles.card}>
          <Text category="s1" style={styles.cardTitle}>
            Informações Pessoais
          </Text>
          <Divider />

          {employee.cpf && (
            <InfoRow
              icon={<Entypo name="text-document-inverted" size={22} color={customTheme['text-hint-color']} />}
              label="CPF"
              value={formatCPF(employee.cpf)}
            />
          )}

          {employee.birthDate && (
            <InfoRow
              icon={<Entypo name="cake" size={22} color={customTheme['text-hint-color']} />}
              label="Data de Nascimento"
              value={formatDate(employee.birthDate)}
            />
          )}
        </Card>

        {/* Employment Info */}
        <Card style={styles.card}>
          <Text category="s1" style={styles.cardTitle}>
            Dados Funcionais
          </Text>
          <Divider />

          <InfoRow
            icon={<Entypo name="briefcase" size={22} color={customTheme['text-hint-color']} />}
            label="Cargo"
            value={employee.role}
          />

          <InfoRow
            icon={<Entypo name="wallet" size={22} color={customTheme['text-hint-color']} />}
            label={
              employee.type === 'DIARISTA'
                ? 'Valor Diária'
                : 'Salário Base'
            }
            value={<DinheiroDisplay value={employee.baseSalary} />}
          />

          <InfoRow
            icon={<Entypo name="calendar" size={22} color={customTheme['text-hint-color']} />}
            label="Data de Admissão"
            value={formatDate(employee.admissionDate)}
          />

          <InfoRow
            icon={<Entypo name="clock" size={22} color={customTheme['text-hint-color']} />}
            label="Dia do Pagamento"
            value={getPaydayText(employee.payday)}
          />
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            appearance="outline"
            style={styles.actionButton}
            disabled
          // accessoryLeft={(props) => (
          //   <Icon {...props} name="edit-outline" />
          // )}
          >
            Editar
          </Button>

          <Button
            status="danger"
            style={styles.actionButton}
          // accessoryLeft={(props) => (
          //   <Icon {...props} name="trash-2-outline" />
          // )}
          // onPress={handleDelete}
          >
            Demitir
          </Button>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 24,
  },

  content: {
    padding: 16,
    paddingBottom: 32,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  iconLarge: {
    width: 48,
    height: 48,
    marginBottom: 16,
  },

  mt: {
    marginTop: 16,
  },

  card: {
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 0.5,
    borderColor: customTheme['text-disabled-color'],
    borderRadius: 10,
    backgroundColor: customTheme['background-basic-color-3']
  },

  cardCenter: {
    margin: 16,
    padding: 12,
    borderWidth: 0.5,
    borderColor: customTheme['text-disabled-color'],
    borderRadius: 10,
    backgroundColor: customTheme['background-basic-color-3']
  },

  name: {
    marginTop: 12,
  },

  typeBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(0,122,255,0.1)',
  },

  cardTitle: {
    marginBottom: 8,
  },

  infoRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
  },

  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.14)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoIconInner: {
    width: 18,
    height: 18,
  },

  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 24,
  },

  actionButton: {
    flex: 1,
  },
});
