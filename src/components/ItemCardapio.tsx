import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Text, Button, useTheme } from '@ui-kitten/components';
import { Ionicons } from '@expo/vector-icons';

import { MenuProduct } from '../types';
import { DinheiroDisplay } from './DinheiroDisplay';
import { customTheme } from '../theme/custom.theme';

interface MenuItemCardProps {
  product: MenuProduct;
  selected: boolean;
  quantity: number;
  onToggle: () => void;
  onQuantityChange: (quantity: number) => void;
}

export const ItemCardapio = ({
  product,
  selected,
  quantity,
  onToggle,
  onQuantityChange,
}: MenuItemCardProps) => {
  const theme = useTheme();
  const styles = createStyles(theme, selected);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onToggle}
      style={styles.container}
    >
      <View style={styles.checkbox}>
        {selected && (
          <Ionicons
            name="checkmark"
            size={14}
            color={theme['color-primary-500']}
          />
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text category="s1">{product.name}</Text>
        <Text category="c1" appearance="hint">
          {product.category}
        </Text>
      </View>

      {/* Price + Controls */}
      <View style={styles.right}>
        <DinheiroDisplay value={product.price} size="md" />

        {selected && (
          <View style={styles.quantityContainer}>
            <Button
              size="tiny"
              appearance="ghost"
              onPress={() =>
                quantity > 1 && onQuantityChange(quantity - 1)
              }
              disabled={quantity <= 1}
            >
              <Ionicons name="remove" size={16} />
            </Button>

            <Text style={styles.quantityText}>{quantity}</Text>

            <Button
              size="tiny"
              appearance="ghost"
              onPress={() => onQuantityChange(quantity + 1)}
            >
              <Ionicons name="add" size={16} />
            </Button>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: any, selected: boolean) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      backgroundColor: selected
        ? customTheme['color-primary-900']
        : theme['color-basic-800'],
      borderColor: selected
        ? theme['color-primary-300']
        : theme['color-basic-600'],
    },

    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: selected
        ? theme['color-primary-500']
        : theme['color-basic-600'],
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
      backgroundColor: theme['color-basic-700'],
      borderRadius: 999,
      paddingHorizontal: 4,
    },

    quantityText: {
      width: 28,
      textAlign: 'center',
      fontWeight: '600',
    },
  }
);
