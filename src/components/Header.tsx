import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Layout, Text, useTheme } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
}) => {
  const theme = useTheme();

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <Layout
        level="1"
        style={[
          styles.container,
          {
            borderBottomColor: theme['border-basic-color-2'],
          },
        ]}
      >
        <View style={styles.content}>
          <View>
            <Text category="h6">
              {title}
            </Text>

            {subtitle && (
              <Text
                category="s2"
                appearance="hint"
                style={styles.subtitle}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    backgroundColor: 'transparent',
  },
  container: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: {
    maxWidth: 420, // equivalente ao max-w-lg
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    marginTop: 2,
  },
});