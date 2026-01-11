import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Layout, Text } from '@ui-kitten/components';
import React, { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AvatarIniciais } from '../components/AvatarIniciais';
import { CardGradient } from '../components/CardGradient';
import { Header } from '../components/Header';
import { RootStackParamList } from '../routes/StackRoutes';
import { customTheme } from '../theme/custom.theme';
import { useGerenteConectado } from '../hooks/useGerente';
import { useSair } from '../hooks/useSair';
import { useRestauranteConectado } from '../hooks/useRestaurante';

export const Perfil = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const iconColor = "#8f9bb3";

  const MenuItem = ({
    icon,
    label,
    onPress,
    danger = false,
  }: {
    icon: ReactNode;
    label: string;
    onPress?: () => void;
    danger?: boolean;
  }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.menuItem,
        danger && styles.menuItemDanger,
      ]}
    >
      <View
        style={[
          styles.menuIcon,
          danger ? styles.iconDangerBg : styles.iconDefaultBg,
        ]}
      >
        {icon}
      </View>

      <Text
        style={styles.menuLabel}
        status={danger ? 'danger' : 'basic'}
      >
        {label}
      </Text>

      <MaterialIcons name="chevron-right" size={20} color={iconColor} />
    </TouchableOpacity>
  );

  const { 
    data: gerente_conectado,
    isLoading
  } = useGerenteConectado()

  const { data: rest_conectado } = useRestauranteConectado()

  const { isLoading: carregandoLogout, sairDasContas } = useSair()

  return (
    <Layout style={styles.container}>
      <Header
        title="Configurações"
        subtitle={"Administre seu aplicativo e restaurante"}
      />

      <View style={styles.content}>
        {/* Profile */}
        <CardGradient styles={styles.card}>
          <View style={styles.profileRow}>
            <AvatarIniciais name={gerente_conectado?.nome || ''} size="lg" />

            <View style={styles.profileInfo}>
              <Text category="h6">
                {gerente_conectado?.nome}
              </Text>
              <Text category='s2' appearance="hint">
                {rest_conectado?.email}
              </Text>

              <View style={styles.roleRow}>
                <MaterialCommunityIcons name="account-tie" size={16} color="#2EB8A2" />
                <Text style={styles.roleText}>
                  {gerente_conectado?.tipo}
                </Text>
              </View>
            </View>
          </View>
        </CardGradient>

        {/* Restaurant Info */}
        <CardGradient styles={styles.card}>
          <View style={styles.restaurantRow}>
            <View style={styles.restaurantIcon}>
              <MaterialIcons name="dining" size={24} color="#2EB8A2" />
            </View>

            <View>
              <Text appearance="hint" category="c1">
                Restaurante
              </Text>
              <Text category="s1">
                {rest_conectado?.nome_fantasia}
              </Text>
            </View>
          </View>
        </CardGradient>

        {/* Menu */}
        <CardGradient styles={styles.menuCard}>
          <MenuItem
            icon={<MaterialCommunityIcons name="finance" size={20} color={iconColor} />}
            label="Finanças"
            onPress={() => { }}
          />
          <View style={styles.divider} />
          <MenuItem
            icon={<MaterialIcons name="dining" size={20} color={iconColor} />}
            label="Gerenciar Cardápio"
            onPress={() => navigation.navigate('GerenciaCardapio')}
          />
          <View style={styles.divider} />
          <MenuItem
            icon={<MaterialIcons name="calendar-month" size={20} color={iconColor} />}
            label="Mensalidades"
            onPress={() => navigation.navigate('Mensalidades')}
          />
          <View style={styles.divider} />
          <MenuItem
            icon={<MaterialCommunityIcons name="bell" size={20} color={iconColor} />}
            label="Notificações"
            onPress={() => { }}
          />
        </CardGradient>

        {/* Logout */}
        <CardGradient styles={styles.menuCard}>
          <MenuItem
            icon={<MaterialIcons name="logout" size={24} color={customTheme['color-danger-600']} />}
            label="Sair"
            danger
            onPress={async () => {
              if ((await sairDasContas()).ok) {
                navigation.navigate('LoginRestaurante');
              }
            }}
          />
        </CardGradient>

        {/* App Info */}
        <View style={styles.footer}>
          <Text appearance="hint" category="c1">
            Vale Restaurante v1.0.0
          </Text>
          <Text appearance="hint" category="c1" style={styles.footerText}>
            Feito com ❤️ para gerentes
          </Text>
        </View>
      </View>
    </Layout>
  );
};


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 24,
  },

  content: {
    padding: 16,
    gap: 12,
  },

  card: {
    padding: 16,
    marginHorizontal: 10,
    borderRadius: 16
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  profileInfo: {
    flex: 1,
  },

  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },

  roleText: {
    color: '#2EB8A2',
    fontSize: 13,
    fontWeight: '500',
  },

  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  restaurantIcon: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(46,184,162,0.2)',
  },

  menuCard: {
    padding: 0,
    overflow: 'hidden',
    marginHorizontal: 10,
    borderRadius: 16
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },

  menuItemDanger: {},

  menuIcon: {
    padding: 8,
    borderRadius: 10,
    marginRight: 12,
  },

  iconDefaultBg: {
    backgroundColor: 'rgba(143,155,179,0.15)',
  },

  iconDangerBg: {
    backgroundColor: 'rgba(255,61,113,0.15)',
  },

  menuLabel: {
    flex: 1,
    fontWeight: '500',
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(143,155,179,0.2)',
    marginLeft: 56,
  },

  footer: {
    alignItems: 'center',
    paddingTop: 24,
    gap: 4,
  },

  footerText: {
    marginTop: 4,
  },
});
