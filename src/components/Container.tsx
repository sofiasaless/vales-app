import { Layout } from '@ui-kitten/components';
import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { customTheme } from '../theme/custom.theme';

interface ContainerProps {
  children: ReactNode;
  withTabs?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  withTabs = true,
}) => {
  return (
    <Layout style={[styles.pageContainer, (withTabs)?styles.pageContainerWithTabs:'']}>
      {children}
    </Layout>
  );
};

export const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    flexDirection: 'column'
  },

  pageContainerWithTabs: {
    flex: 1,
    paddingBottom: 80,
  },
});
