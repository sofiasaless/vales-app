import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import {
  Layout,
  Card,
  Text,
  Button,
  Modal,
  useTheme,
} from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { DinheiroDisplay } from '../components/DinheiroDisplay';
import { CardGradient } from '../components/CardGradient';
import { customTheme } from '../theme/custom.theme';
import { AppModal } from '../components/AppModal';

interface Subscription {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
  pixKey: string;
}

const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    name: 'Mensalidade - Janeiro 2024',
    amount: 99.9,
    dueDate: new Date('2024-01-15'),
    status: 'paid',
    pixKey: 'pix@valerestaurante.com.br',
  },
  {
    id: 'sub-2',
    name: 'Mensalidade - Fevereiro 2024',
    amount: 99.9,
    dueDate: new Date('2024-02-15'),
    status: 'pending',
    pixKey: 'pix@valerestaurante.com.br',
  },
  {
    id: 'sub-3',
    name: 'Mensalidade - Março 2024',
    amount: 99.9,
    dueDate: new Date('2024-03-15'),
    status: 'overdue',
    pixKey: 'pix@valerestaurante.com.br',
  },
];

export default function Mensalidades() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [selected, setSelected] = useState<Subscription | null>(null);
  const [copied, setCopied] = useState(false);

  const statusConfig = {
    paid: {
      label: 'Pago',
      icon: 'checkmark-circle',
      bg: theme['color-success-100'],
      text: theme['color-success-700'],
    },
    pending: {
      label: 'Pendente',
      icon: 'time',
      bg: theme['color-warning-100'],
      text: theme['color-warning-700'],
    },
    overdue: {
      label: 'Vencido',
      icon: 'alert-circle',
      bg: theme['color-danger-100'],
      text: theme['color-danger-700'],
    },
  };

  const handleCopyPix = async (pix: string) => {
    await Clipboard.setStringAsync(pix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout style={styles.container}>
      <View style={styles.content}>
        {mockSubscriptions.map((sub) => {
          const status = statusConfig[sub.status];

          return (
            <TouchableOpacity
              key={sub.id}
              activeOpacity={0.8}
              onPress={() => setSelected(sub)}
            >
              <CardGradient styles={styles.card}>
                <View style={styles.row}>
                  <View style={styles.flex}>
                    <Text category="s1">{sub.name}</Text>

                    <View style={styles.dateRow}>
                      <Ionicons
                        name="calendar-outline"
                        size={14}
                        color={customTheme['text-hint-color']}
                      />
                      <Text appearance="hint" category="c1">
                        Vencimento:{' '} {sub.dueDate.toLocaleDateString()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.right}>
                    <DinheiroDisplay value={sub.amount} size="md" />

                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: status.bg },
                      ]}
                    >
                      <Ionicons
                        name={status.icon as any}
                        size={12}
                        color={status.text}
                      />
                      <Text
                        category="c2"
                        style={{ color: status.text }}
                      >
                        {status.label}
                      </Text>
                    </View>
                  </View>
                </View>
              </CardGradient>
            </TouchableOpacity>
          );
        })}
      </View>

      {selected && (
        <AppModal visible={!!selected} onClose={() => setSelected(null)}>
          <Text category="h6">{selected.name}</Text>
          <Text appearance="hint" category="c1">
            Detalhes do pagamento
          </Text>

          {/* VALOR */}
          <View style={styles.block}>
            <Text appearance="hint" category="c1">
              Valor
            </Text>
            <DinheiroDisplay value={selected.amount} variant='positive' size="md" />
          </View>

          {/* VENCIMENTO */}
          <View style={styles.block}>
            <View style={styles.iconRow}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={customTheme['text-hint-color']}
              />
              <Text appearance="hint" category="c1">
                Data de vencimento
              </Text>
            </View>
            <Text category="s1">
              12/02/2025
            </Text>
          </View>

          {/* PIX */}
          <View style={styles.block}>
            <Text appearance="hint" category="c1">
              Chave PIX
            </Text>

            <View style={styles.pixRow}>
              <Text style={styles.pixKey}>
                {selected.pixKey}
              </Text>

              <Button
                appearance="outline"
                size="small"
                onPress={() => handleCopyPix(selected.pixKey)}
              >
                <Ionicons
                  name={copied ? 'checkmark' : 'copy-outline'}
                  size={16}
                  color={
                    copied
                      ? theme['color-success-600']
                      : theme['color-primary-600']
                  }
                />
              </Button>
            </View>
          </View>

          <Button
            appearance="outline"
            onPress={() => setSelected(null)}
          >
            Fechar
          </Button>
        </AppModal>
      )}
    </Layout>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: 16,
      gap: 12,
    },
    card: {
      padding: 16,
      borderWidth: 0.8,
      borderRadius: 12,
      borderColor: customTheme['text-disabled-color']
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
    },
    flex: {
      flex: 1,
    },
    right: {
      alignItems: 'flex-end',
      gap: 8,
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 4,
    },
    statusBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 999,
    },
    backdrop: {
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modal: {
      width: 320,
      borderRadius: 16,
      gap: 12,
    },
    block: {
      backgroundColor: customTheme['background-alternative-color-1'],
      borderRadius: 14,
      padding: 12,
      gap: 6,
      marginBlock: 8
    },
    iconRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    pixRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    pixKey: {
      flex: 1,
      fontFamily: 'monospace',
    },
  });