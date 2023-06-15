import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';

type Props = {
  left?: string;
  right?: string | number;
};

const TextLine = ({left, right}: Props) => {
  return (
    <View className="flex-row justify-between pt-3">
      <Text>{left}</Text>
      <Text className="text-right">{right}</Text>
    </View>
  );
};

export default TextLine;
