import { Button, Text } from '@ui-kitten/components';
import React, { memo, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

import { ItemMenu } from '../schema/menu.schema';
import { customTheme } from '../theme/custom.theme';
import { DinheiroDisplay } from './DinheiroDisplay';
import { useItensValesActions } from '../context/ItensValeContext';

interface MenuItemCardProps {
  product: ItemMenu;
}

export const ItemCardapio = memo(({ product }: MenuItemCardProps) => {
  const [selecionado, setSelecionado] = useState(false);
  const [qtd, setQtd] = useState(0);

  const {
    adicionarItem,
    removerItem,
    atualizarQuantidade,
  } = useItensValesActions();

  const selecionarItem = (acao: boolean) => {
    setSelecionado(acao);

    if (acao) {
      setQtd(1);
      adicionarItem({
        data_adicao: new Date(),
        descricao: product.descricao,
        preco_unit: product.preco,
        produto_ref: product.id,
        id: Math.random().toString(),
        quantidade: 1,
      });
    } else {
      setQtd(0);
      removerItem(product.id);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor: selecionado ? customTheme["color-primary-900"] : customTheme["color-basic-800"], 
          borderColor: selecionado ? customTheme['color-primary-300'] : customTheme['color-basic-600']
        },
      ]}
      onPress={() => selecionarItem(!selecionado)}
    >
      <Text style={styles.info} category="s2">
        {product.descricao}
      </Text>

      <View style={styles.right}>
        <DinheiroDisplay value={product.preco} size="sm" />

        <View style={styles.quantityContainer}>
          <Button
            size="tiny"
            appearance="ghost"
            disabled={!selecionado}
            onPress={() => {
              if (qtd === 1) {
                selecionarItem(false);
              } else {
                setQtd(q => q - 1);
                atualizarQuantidade(product.id, -1);
              }
            }}
          >
            -
          </Button>

          <Text style={styles.quantityText}>{qtd}</Text>

          <Button
            size="tiny"
            appearance="ghost"
            disabled={!selecionado}
            onPress={() => {
              setQtd(q => q + 1);
              atualizarQuantidade(product.id, 1);
            }}
          >
            +
          </Button>
        </View>
      </View>
    </TouchableOpacity>
  );
});


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: customTheme['color-basic-800'],
    borderColor: customTheme['color-basic-600'],
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: customTheme['color-basic-600'],
    alignItems: 'center',
    justifyContent: 'center',
  },

  info: {
    flex: 1,
    minWidth: 0,
  },

  right: {
    alignItems: 'flex-end',
    gap: 6,
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: customTheme['color-basic-700'],
    borderRadius: 999,
    paddingHorizontal: 4,
  },

  quantityText: {
    width: 28,
    textAlign: 'center',
    fontWeight: '600',
    color: 'white'
  },
}
);
