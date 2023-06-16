import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import type {ViewStyle} from 'react-native';

type Props = {
  label: string;
  children: string | number | null;
  style?: ViewStyle;
};

const TextRow = ({children, label, style}: Props) => {
  return (
    <View className="space-y-3" style={style}>
      <View className="flex-row items-start justify-between space-x-3">
        <Text variant="labelMedium">{label}</Text>
        <Text selectable className="flex-1 text-right">
          {children}
        </Text>
      </View>
    </View>
  );
};

export default TextRow;
