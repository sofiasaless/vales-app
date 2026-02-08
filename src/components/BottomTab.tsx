import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { BottomTabNavigationEventMap } from "@react-navigation/bottom-tabs";
import { NavigationHelpers, ParamListBase, TabNavigationState } from "@react-navigation/native";
import { BottomNavigation, BottomNavigationTab, Layout } from "@ui-kitten/components";
import { StyleSheet } from 'react-native';
import { customTheme } from '../theme/custom.theme';

type Props = {
  state: TabNavigationState<ParamListBase>;
  descriptors: any;
  navigation: NavigationHelpers<
    ParamListBase,
    BottomTabNavigationEventMap
  >;
};

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform } from 'react-native';

export function useNavigationMode() {
  const insets = useSafeAreaInsets();

  if (Platform.OS !== 'android') {
    return 'unknown'; // iOS não tem esse conceito
  }

  // valores típicos:
  // botões: ~48-80
  // gestos: 0-16
  const hasNavButtons = insets.bottom > 20;

  return hasNavButtons ? 'buttons' : 'gestures';
}

const IconTab = ({ nome, ativo }: { nome: string; ativo: boolean }) => {
  const color = ativo
    ? customTheme['color-primary-600']
    : customTheme['text-disabled-color'];

  switch (nome) {
    case "Funcionarios":
      return <MaterialIcons name="diversity-3" size={22} color={color} />;

    case "Contratar":
      return <MaterialIcons name="business-center" size={22} color={color} />;

    case "Perfil":
      return <MaterialIcons name="face-6" size={22} color={color} />;

    default:
      return null;
  }
};

export function BottomTab({ state, descriptors, navigation }: Props) {
  const area = useNavigationMode()
  
  return (
    <Layout style={{paddingBottom: (area === 'buttons')?50:0}}>
      <BottomNavigation
        style={{paddingBlock: 12, backgroundColor: customTheme['background-alternative-color-1']}}
        selectedIndex={state.index}
        onSelect={(index) => {
          const route = state.routes[index];

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const title =
            options.tabBarLabel ??
            options.title;

          return (
            <BottomNavigationTab
              key={route.key}
              // title={route.name}
              icon={<IconTab nome={route.name} ativo={state.index === index}/>}
            />
          );
        })}
      </BottomNavigation>
    </Layout>
  );
}

export const styles = StyleSheet.create({
  icon: {
    flex: 1,
    flexDirection: 'column',
  },
});
