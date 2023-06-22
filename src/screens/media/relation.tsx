import React from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Surface, Text, TouchableRipple} from 'react-native-paper';
import {normalizeEnumName} from 'utils';
import type {Anime_Media_relations_edges} from './types';

type Props = {
  item: Anime_Media_relations_edges;
  onPress: () => void;
};

const Relation = ({item, onPress}: Props) => {
  const source = {uri: item.node.coverImage.medium || ''};

  return (
    <Surface className="my-3 max-w-[160px] rounded-xl">
      <TouchableRipple
        className="grow rounded-xl bg-teal-200"
        onPress={onPress}>
        <View className="items-center space-y-1 p-3 ">
          <Text variant="labelSmall">
            {normalizeEnumName(item.relationType)}
          </Text>
          <FastImage className="h-28 w-20" source={source} />
          <Text className="text-center" numberOfLines={3}>
            {item.node.title.romaji}
          </Text>
          <Text variant="bodySmall">{normalizeEnumName(item.node.format)}</Text>
        </View>
      </TouchableRipple>
    </Surface>
  );
};

export default Relation;
