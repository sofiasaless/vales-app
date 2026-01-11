import Feather from '@expo/vector-icons/Feather';
import { Button, Input, Layout, Spinner, Text } from '@ui-kitten/components';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  View
} from 'react-native';

import { ItemCardapio } from '../components/ItemCardapio';
import { useCardapio } from '../hooks/useCardapio';
import { useRestauranteConectado } from '../hooks/useRestaurante';
import { customTheme } from '../theme/custom.theme';
import { useItensValesActions, useItensValesState } from '../context/ItensValeContext';

export default function Cardapio() {

  const { data: res, isLoading: carregandoRest } = useRestauranteConectado()

  const {
    data: itensCardapio,
    isLoading,
    refetch
  } = useCardapio(res?.id || '')

  const { tamanho, itensVales } = useItensValesState();
  const { limparItens } = useItensValesActions();

  useEffect(() => {
    refetch()
  }, [carregandoRest])


  return (
    <Layout style={styles.container}>
      <Layout style={styles.barraPesquisa}>
        <Input
          size="large"
          status='primary'
          placeholder="Pesquisar por produto...."
          accessoryLeft={<Feather name="search" size={22} color={customTheme['color-primary-500']} />}
        />
      </Layout>
      {
        (isLoading) ?
          <Spinner />
          :
          <FlatList
            data={itensCardapio}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.content}
            renderItem={({ item }) => (
              <ItemCardapio
                product={item}
              />
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text appearance="hint">Nenhum produto no cardápio</Text>
              </View>
            }
            removeClippedSubviews
            windowSize={5}
            maxToRenderPerBatch={10}
            initialNumToRender={10}
          />
      }

      <View style={styles.bottomBar}>
        <Button
          size="giant"
          style={styles.actionButton}
          onPress={() => console.info(itensVales)}
        >
          Adicionar ({tamanho})
          {/* <Text style={styles.dot}> • </Text>
            <DinheiroDisplay
              value={totalItens}
              size="md"
              variant="black"
            /> */}
        </Button>

        <Button status='danger' onPress={limparItens}>limpar</Button>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  barraPesquisa: {
    paddingHorizontal: 16,
    paddingBlock: 10
  },
  content: {
    padding: 16,
    paddingBottom: 120,
    gap: 10,
  },
  category: {
    gap: 8,
  },
  categoryTitle: {
    fontWeight: '600',
    letterSpacing: 1,
  },
  empty: {
    alignItems: 'center',
    gap: 8,
    marginTop: 40,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  actionButton: {
    borderRadius: 16,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionText: {
    color: 'black',
    fontWeight: '600',
  },
  dot: {
    color: 'black',
    opacity: 0.8,
  },
});
