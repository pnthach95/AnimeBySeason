import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-paper';

type Props = {
  name: string;
  image: string;
};

const Person = ({image, name}: Props) => {
  return (
    <View className="w-24 items-center">
      <FastImage className="aspect-poster w-20" source={{uri: image}} />
      <Text selectable className="text-center">
        {name}
      </Text>
    </View>
  );
};

export default Person;
