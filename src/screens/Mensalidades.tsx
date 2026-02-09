import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import {
  Button,
  Card,
  Layout,
  Modal,
  Text,
  useTheme
} from '@ui-kitten/components';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { CardGradient } from '../components/CardGradient';
import { DinheiroDisplay } from '../components/DinheiroDisplay';
import { useListarMensalidades } from '../hooks/useMensalidades';
import { Mensalidade } from '../schema/mensalidade.schema';
import { customTheme } from '../theme/custom.theme';
import { converterTimestamp } from '../util/formatadores.util';

export default function Mensalidades() {
  const route = useRoute();
  const { idRest } = route.params as { idRest: string };

  const { data: mensalidades } = useListarMensalidades(idRest)

  const theme = useTheme();
  const styles = createStyles(theme);

  const [selected, setSelected] = useState<Mensalidade | null>(null);
  const [copied, setCopied] = useState(false);

  const statusConfig = {
    PAGO: {
      label: 'Pago',
      icon: 'checkmark-circle',
      bg: theme['color-success-100'],
      text: theme['color-success-700'],
    },
    PENDENTE: {
      label: 'Pendente',
      icon: 'time',
      bg: theme['color-warning-100'],
      text: theme['color-warning-700'],
    },
    VENCIDO: {
      label: 'Vencido',
      icon: 'alert-circle',
      bg: theme['color-danger-100'],
      text: theme['color-danger-700'],
    },
  };

  const formatadoLongo = (data: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(data);
  }

  const formatadoCurto = (data: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric',
    }).format(data).toUpperCase();
  }

  const handleCopyPix = async (pix: string) => {
    await Clipboard.setStringAsync(pix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout style={styles.container}>
      <View style={styles.content}>
        {mensalidades?.map((sub) => {
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
                    <Text category="s1">Mensalidade - {converterTimestamp(sub.data_vencimento).toLocaleDateString().substring(3, 10)}</Text>

                    <View style={styles.dateRow}>
                      <Ionicons
                        name="calendar-outline"
                        size={14}
                        color={customTheme['text-hint-color']}
                      />
                      <Text appearance="hint" category="c1">
                        Vence em {formatadoLongo(converterTimestamp(sub.data_vencimento))}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.right}>
                    <DinheiroDisplay value={sub.valor} size="md" />

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
        <Modal backdropStyle={{backgroundColor: 'rgba(0,0,0,0.5)'}} visible={!!selected} onBackdropPress={() => setSelected(null)}>
          <Card style={{width: 300, maxWidth: 300, minWidth: 200,}}>
            <Text category="h6">{formatadoCurto(converterTimestamp(selected.data_vencimento))}</Text>
            <Text appearance="hint" category="c1">
              Detalhes do pagamento
            </Text>

            {/* VALOR */}
            <View style={styles.block}>
              <Text appearance="hint" category="c1">
                Valor
              </Text>
              <DinheiroDisplay value={selected.valor} variant='positive' size="md" />
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
                {converterTimestamp(selected.data_vencimento).toLocaleDateString()}
              </Text>
            </View>

            {/* PIX */}
            <View style={styles.block}>
              <Text appearance="hint" category="c1">
                Chave PIX
              </Text>

              <View style={styles.pixRow}>
                <Text style={styles.pixKey}>
                  {selected.link}
                </Text>

                <Button
                  appearance="outline"
                  size="small"
                  onPress={() => handleCopyPix(selected.link)}
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
          </Card>
        </Modal>
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