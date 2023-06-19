import React from 'react';
import FastImage from 'react-native-fast-image';
import {Text, TouchableRipple} from 'react-native-paper';

type Props = {
  name: string;
  image: string;
  onPress?: () => void;
};

const Person = ({image, name, onPress}: Props) => {
  return (
    <TouchableRipple className="w-24 items-center" onPress={onPress}>
      <>
        <FastImage className="aspect-poster w-20" source={{uri: image}} />
        <Text selectable className="text-center">
          {name}
        </Text>
      </>
    </TouchableRipple>
  );
};

export default Person;
