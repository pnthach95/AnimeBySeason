import React from 'react';
import {View} from 'react-native';
import {Surface, Text} from 'react-native-paper';
import {normalizeEnumName} from 'utils';
import Person from './person';
import type {Anime_Media_characters_edges} from './types';

type Props = {
  item: Anime_Media_characters_edges;
  onPressCharacter: () => void;
  onPressVA: (id: number, image: string, name: string) => void;
};

const Character = ({item, onPressCharacter, onPressVA}: Props) => {
  return (
    <Surface className="my-3 rounded-xl py-1">
      <Text className="mx-3 mb-1" variant="labelSmall">
        {normalizeEnumName(item.role)}
      </Text>
      <View className="flex-row">
        <Person
          image={item.node?.image.large || ''}
          name={item.node?.name.userPreferred || ''}
          onPress={onPressCharacter}
        />
        {item.voiceActors.map(va => {
          const onPress = () => {
            onPressVA(
              va.id,
              va.image?.large || '',
              va.name?.userPreferred || '',
            );
          };

          return (
            <Person
              key={`${va.__typename}_${va.id}`}
              image={va.image?.large || ''}
              name={va.name?.userPreferred || ''}
              onPress={onPress}
            />
          );
        })}
      </View>
    </Surface>
  );
};

export default Character;
