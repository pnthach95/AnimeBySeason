import {StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {ViewStyle} from 'react-native';

export const useSafeAreaPaddingBottom = (offset = 0, style?: ViewStyle) => {
  const insets = useSafeAreaInsets();
  return StyleSheet.flatten([
    {
      paddingBottom: insets.bottom + offset,
    },
    style,
  ]);
};

export const useSafeAreaPaddingTop = (offset = 0, style?: ViewStyle) => {
  const insets = useSafeAreaInsets();
  return StyleSheet.flatten([
    {
      paddingTop: insets.top + offset,
    },
    style,
  ]);
};

const AppStyles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex1: {flex: 1},
  flex2: {flex: 2},
  flex3: {flex: 3},
  fullCenter: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  grow: {flexGrow: 1},
  growCenter: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  hideOverflow: {overflow: 'hidden'},
  itemCenter: {alignItems: 'center'},
  justifyCenter: {justifyContent: 'center'},
  justifyEnd: {justifyContent: 'flex-end'},
  noGrow: {flexGrow: 0},
  padding: {padding: 12},
  paddingHorizontal: {paddingHorizontal: 12},
  selfCenter: {alignSelf: 'center'},
});

export default AppStyles;
