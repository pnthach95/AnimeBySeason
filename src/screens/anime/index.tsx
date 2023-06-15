import React from 'react';
import {ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import type {RootStackScreenProps} from 'typings/navigation';

const AnimeScreen = ({route}: RootStackScreenProps<'Anime'>) => {
  return (
    <ScrollView>
      {(!!route.params.item.coverImage.medium ||
        !!route.params.item.coverImage.large) && (
        <FastImage
          className="aspect-poster w-28"
          source={{
            uri:
              route.params.item.coverImage.medium ||
              route.params.item.coverImage.large ||
              '',
          }}
        />
      )}
    </ScrollView>
  );
};

export default AnimeScreen;
