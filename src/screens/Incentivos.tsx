import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Button, Card, Divider, Input, Layout, Modal, Text } from '@ui-kitten/components';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { CardGradient } from '../components/CardGradient';
import { DinheiroDisplay } from '../components/DinheiroDisplay';
import { useIncentive } from '../context/InvenctiveContext';
import { customTheme } from '../theme/custom.theme';
import { CardGradientPrimary } from '../components/CardGradientPrimary';
import { RootStackParamList } from '../routes/StackRoutes';

export const Incentivos = () => {
  const navigator = useNavigation<NavigationProp<RootStackParamList>>();
  const { state, addIncentive } = useIncentive();

  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({
    descricao: '',
    valor_incentivo: '',
    meta: '',
    data_expiracao: '',
  });

  const activeIncentive = state.incentivos.find(i => i.status && !i.ganhador_ref);
  const historyIncentives = state.incentivos.filter(i => !i.status || i.ganhador_ref);

  const handleCreate = () => {
    if (!form.descricao || !form.valor_incentivo || !form.meta || !form.data_expiracao) return;

    addIncentive({
      descricao: form.descricao,
      valor_incentivo: Number(form.valor_incentivo),
      meta: Number(form.meta),
      data_expiracao: new Date(form.data_expiracao),
    });

    setForm({ descricao: '', valor_incentivo: '', meta: '', data_expiracao: '' });
    setVisible(false);
  };

  return (
    <Layout style={styles.container}>
      <View style={styles.content}>
        {activeIncentive && (
          <CardGradientPrimary styles={styles.activeCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                <MaterialCommunityIcons name="star-shooting" size={20} color={customTheme['color-primary-500']} />
                <Text category="s1" status='primary'>Incentivo do mês</Text>
              </View>
              <DinheiroDisplay value={activeIncentive.valor_incentivo} />
            </View>

            <Text category='s2'>{activeIncentive.descricao}</Text>

            <View style={{ flexDirection: 'row', gap: 15 }}>
              <View style={styles.subTxt}>
                <MaterialIcons name="star-purple500" size={13} color={customTheme['text-hint-color']} />
                <Text category='c1' appearance="hint">Meta: {activeIncentive.meta}</Text>
              </View>
              <View style={styles.subTxt}>
                <MaterialIcons name="calendar-month" size={13} color={customTheme['text-hint-color']} />
                <Text category='c1' appearance="hint">Expira em {activeIncentive.data_expiracao.toLocaleDateString()}</Text>
              </View>
            </View>
        
            {activeIncentive.ganhador_nome && 
              <View style={styles.badgeGanhador}>
                <MaterialCommunityIcons name="crown" size={20} color={customTheme['color-success-600']} />
                <Text category='s2' status='success'>{activeIncentive.ganhador_nome}</Text>
              </View>
            }

            <Divider style={{ backgroundColor: customTheme['border-color-primary'], marginBlock: 5 }} />

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button size='small' status='warning'
                accessoryLeft={<MaterialCommunityIcons name="check-decagram" size={16} color="black" />}
              >Encerrar</Button>
              <Button size='small' onPress={() => navigator.navigate('RegistroVendaIncentivo')}
                accessoryLeft={<MaterialIcons name="shopping-cart" size={16} color="black" />}
              >Ver vendas</Button>
            </View>
          </CardGradientPrimary>
        )}

        <Button
          style={styles.button}
          disabled={!!activeIncentive}
          onPress={() => setVisible(true)}
        >
          Começar Novo Incentivo
        </Button>

        <View style={{ flexDirection: 'row', marginVertical: 17, alignItems: 'center', gap: 8 }}>
          <MaterialIcons name="history" size={20} color={customTheme['text-basic-color']} />
          <Text category="h6">Histórico de Incentivos</Text>
        </View>

        <FlatList
          data={historyIncentives}
          keyExtractor={(item) => item.descricao}
          contentContainerStyle={{ gap: 10 }}
          renderItem={(incentivo) => (
            <CardGradient colors_one='4' colors_two='2' key={incentivo.item.id} styles={styles.historyCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ flex: 1 }} category="s1">{incentivo.item.descricao}</Text>
                <DinheiroDisplay size='md' value={incentivo.item.valor_incentivo} variant='positive' />
              </View>

              <View style={{ flexDirection: 'row', gap: 15 }}>
                <View style={styles.subTxt}>
                  <MaterialIcons name="star-purple500" size={13} color={customTheme['text-hint-color']} />
                  <Text category='c1' appearance="hint">Meta: {incentivo.item.meta}</Text>
                </View>
                <View style={styles.subTxt}>
                  <MaterialIcons name="calendar-month" size={13} color={customTheme['text-hint-color']} />
                  <Text category='c1' appearance="hint">Expira em: {incentivo.item.data_expiracao.toLocaleDateString()}</Text>
                </View>
              </View>

              {incentivo.item.ganhador_nome ? (
                <View style={styles.badgeGanhador}>
                  <MaterialCommunityIcons name="crown" size={20} color={customTheme['color-success-600']} />
                  <Text category='s2' status='success'>{incentivo.item.ganhador_nome}</Text>
                </View>
              ) : (
                <Text appearance="hint">Expirado sem ganhador</Text>
              )}
            </CardGradient>
          )}
          ListEmptyComponent={
            <Card style={styles.emptyCard}>
              <Text appearance="hint">Nenhum incentivo registrado</Text>
            </Card>
          }
          removeClippedSubviews
          windowSize={5}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
        />
      </View>

      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}
      >
        <Card disabled>
          <Text category="h6">Novo Incentivo</Text>

          <Input
            label="Descrição"
            value={form.descricao}
            onChangeText={v => setForm({ ...form, descricao: v })}
            style={styles.input}
          />

          <Input
            label="Valor do prêmio"
            keyboardType="numeric"
            value={form.valor_incentivo}
            onChangeText={v => setForm({ ...form, valor_incentivo: v })}
            style={styles.input}
          />

          <Input
            label="Meta"
            keyboardType="numeric"
            value={form.meta}
            onChangeText={v => setForm({ ...form, meta: v })}
            style={styles.input}
          />

          <Input
            label="Data de expiração (YYYY-MM-DD)"
            value={form.data_expiracao}
            onChangeText={v => setForm({ ...form, data_expiracao: v })}
            style={styles.input}
          />

          <Button onPress={handleCreate}>Criar Incentivo</Button>
        </Card>
      </Modal>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  button: { marginVertical: 12 },
  activeCard: {
    marginBottom: 16,
    padding: 14,
    borderRadius: 16,
    gap: 5
  },
  historyCard: {
    padding: 15,
    gap: 5,
    borderRadius: 16,
  },
  emptyCard: { padding: 24, alignItems: 'center' },
  input: { marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  backdrop: { backgroundColor: 'rgba(0,0,0,0.5)' },
  subTxt: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center'
  },
  badgeGanhador: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 5,
    gap: 5,
    padding: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: customTheme['border-color-primary'],
    backgroundColor: '#2eb8731a'
  }
});