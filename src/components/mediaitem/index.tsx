import React, {PropsWithChildren} from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text, TouchableRipple} from 'react-native-paper';
import {type IMediaItem, MediaFormat} from 'typings/globalTypes';
import {normalizeEnumName} from 'utils';

type Props = {
  item: IMediaItem;
  onPress: () => void;
};

const MediaItem = ({item, children, onPress}: PropsWithChildren<Props>) => {
  const source = {uri: item.coverImage.medium || ''};
  const imgbg = {
    backgroundColor: item.coverImage.color || undefined,
  };

  return (
    <TouchableRipple onPress={onPress}>
      <View className="mx-3 flex-row">
        <FastImage
          className="aspect-poster w-20"
          resizeMode="contain"
          source={source}
          style={imgbg}
        />
        <View className="ml-3 flex-1">
          <Text variant="titleLarge">{item.title.romaji}</Text>
          {!!item.title.english && (
            <Text variant="titleMedium">{item.title.english}</Text>
          )}
          {item.format === MediaFormat.TV && (
            <Text>Episodes: {item.episodes || 0}</Text>
          )}
          <Text variant="labelSmall">{normalizeEnumName(item.format)}</Text>
          <Text variant="labelSmall">{item.genres.join(', ')}</Text>
          {children}
        </View>
      </View>
    </TouchableRipple>
  );
};

export default MediaItem;
