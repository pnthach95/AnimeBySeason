import 'locales';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import {useColorScheme} from 'nativewind';
import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import AnimeScreen from 'screens/anime';
import GalleryScreen from 'screens/gallery';
import {useAppColorScheme} from 'stores';
import {navigationDarkTheme, navigationTheme, useAppTheme} from 'utils/themes';
import MainTab from './tabs';
import type {RootStackParamList} from 'typings/navigation';

dayjs.extend(localizedFormat);
dayjs.extend(duration);
dayjs.extend(customParseFormat);

const RootStack = createStackNavigator<RootStackParamList>();

const Routes = () => {
  const appTheme = useAppColorScheme(),
    {colors} = useAppTheme(),
    {setColorScheme} = useColorScheme();

  useEffect(() => {
    /** Màu StatusBar không gán được trong lần đầu mở app,
     *  setTimeout để fix
     */
    setTimeout(() => {
      StatusBar.setBarStyle(
        appTheme === 'dark' ? 'light-content' : 'dark-content',
      );
      StatusBar.setBackgroundColor(colors.card);
    }, 500);
  }, []);

  useEffect(() => {
    setColorScheme(appTheme);
  }, [appTheme]);

  return (
    <NavigationContainer
      theme={appTheme === 'dark' ? navigationDarkTheme : navigationTheme}>
      <StatusBar
        backgroundColor={colors.elevation.level2}
        barStyle={appTheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <RootStack.Navigator>
        <RootStack.Screen
          component={MainTab}
          name="Main"
          options={{headerShown: false}}
        />
        <RootStack.Screen component={AnimeScreen} name="Anime" />
        <RootStack.Screen
          component={GalleryScreen}
          name="Gallery"
          options={{headerShown: false}}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
