import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Avatar, useTheme } from '@ui-kitten/components';

interface AvatarInitialsProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  img_url?: string
}

const SIZE_MAP = {
  sm: { size: 40, fontSize: 14 },
  md: { size: 56, fontSize: 18 },
  lg: { size: 80, fontSize: 24 },
};

export const AvatarIniciais: React.FC<AvatarInitialsProps> = ({
  name,
  size = 'md',
  style,
  img_url
}) => {
  const theme = useTheme();

  const getInitials = (value: string): string => {
    const parts = value.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return value.substring(0, 2).toUpperCase();
  };

  const getColorIndex = (value: string): number => {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash = value.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 5;
  };

  const colors = [
    {
      background: theme['color-primary-200'],
      text: theme['color-primary-600'],
    },
    {
      background: theme['color-success-200'],
      text: theme['color-success-600'],
    },
    {
      background: theme['color-warning-200'],
      text: theme['color-warning-700'],
    },
    {
      background: theme['color-info-200'],
      text: theme['color-info-700'],
    },
    {
      background: theme['color-basic-300'],
      text: theme['color-basic-800'],
    },
  ];

  const color = colors[getColorIndex(name)];
  const config = SIZE_MAP[size];

  return (
    (img_url)?
    <Avatar size='giant' source={{uri: img_url}} />
    :
    <View
      style={[
        styles.container,
        {
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
          backgroundColor: color.background,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: config.fontSize,
            color: color.text,
          },
        ]}
      >
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
});
