import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {CommonActions} from '@react-navigation/native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {BottomNavigation} from 'react-native-paper';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from 'screens/home';
import SettingsScreen from 'screens/settings';
import type {MainTabParamList} from 'typings/navigation';

const iconSize = 24;
const Tabs = createBottomTabNavigator<MainTabParamList>();

const MainTab = () => {
  const {t} = useTranslation();

  return (
    <Tabs.Navigator
      tabBar={({navigation, state, descriptors, insets}) => (
        <BottomNavigation.Bar
          getLabelText={({route}) => {
            const {options} = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? (options.tabBarLabel as string)
                : options.title !== undefined
                ? options.title
                : route.name;
            return label;
          }}
          navigationState={state}
          renderIcon={({route, focused, color}) => {
            const {options} = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({focused, color, size: 24});
            }
            return null;
          }}
          safeAreaInsets={insets}
          onTabPress={({route, preventDefault}) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (event.defaultPrevented) {
              preventDefault();
            } else {
              navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
        />
      )}>
      <Tabs.Screen
        component={HomeScreen}
        name="Home"
        options={{
          headerShown: false,
          title: t('tabs.tab1'),
          tabBarIcon: ({color}) => (
            <MaterialIcon color={color} name="home" size={iconSize} />
          ),
        }}
      />
      <Tabs.Screen
        component={SettingsScreen}
        name="Settings"
        options={{
          title: t('tabs.tab2'),
          tabBarIcon: ({color}) => (
            <MaterialIcon color={color} name="person" size={iconSize} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default MainTab;
