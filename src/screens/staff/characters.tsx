import {useQuery} from '@apollo/client';
import Loading from 'components/loading';
import Separator from 'components/separator';
import React, {useState} from 'react';
import {FlatList, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Surface, Text, TouchableRipple} from 'react-native-paper';
import {type IMediaItem, MediaSort} from 'typings/globalTypes';
import {handleNetworkError, normalizeEnumName} from 'utils';
import AppStyles from 'utils/styles';
import {QUERY_CHARACTERS} from './query';
import type {
  StaffCharacters,
  StaffCharactersVariables,
  StaffCharacters_Staff_characterMedia_edges,
} from './types';
import type {ListRenderItem} from 'react-native';

type Props = {
  id: number;
  goToMedia: (item: IMediaItem) => void;
  goToCharacter: (id: number, image: string, name: string) => void;
};

const StaffCharactersScreen = ({id, goToCharacter, goToMedia}: Props) => {
  const [page, setPage] = useState(1);
  const {data, loading, error, fetchMore} = useQuery<
    StaffCharacters,
    StaffCharactersVariables
  >(QUERY_CHARACTERS, {
    variables: {
      id,
      characterPage: page,
      sort: [MediaSort.START_DATE_DESC],
    },
  });

  const renderCharacterMedia: ListRenderItem<
    StaffCharacters_Staff_characterMedia_edges
  > = ({item}) => {
    const onPress = () => {
      goToMedia(item.node);
    };

    const onPressCharacter = () =>
      goToCharacter(
        item.characters[0].id,
        item.characters[0].image?.large || '',
        item.characters[0].name?.userPreferred || '',
      );

    return (
      <Surface className="mx-3 rounded-xl p-3">
        <Text className="pb-1" variant="labelMedium">
          {normalizeEnumName(item.characterRole)}
        </Text>
        <View className="flex-row space-x-1">
          <TouchableRipple className="max-w-[130px]" onPress={onPressCharacter}>
            <View className="items-center space-x-1 rounded-xl">
              <FastImage
                className="aspect-poster w-24"
                source={{uri: item.characters[0].image?.large || ''}}
              />
              <Text className="text-center">
                {item.characters[0].name?.userPreferred}
              </Text>
            </View>
          </TouchableRipple>
          <TouchableRipple
            borderless
            className="flex-1 self-start pr-3"
            onPress={onPress}>
            <View className="flex-row space-x-3">
              <FastImage
                className="aspect-poster w-16"
                source={{uri: item.node.coverImage.medium || ''}}
              />
              <View className="flex-1">
                <Text numberOfLines={3}>{item.node.title.romaji}</Text>
                {!!item.node.title.english && (
                  <Text numberOfLines={2} variant="bodySmall">
                    {item.node.title.english}
                  </Text>
                )}
                <Text variant="labelSmall">{item.node.startDate?.year}</Text>
              </View>
            </View>
          </TouchableRipple>
        </View>
      </Surface>
    );
  };

  const listEmpty = () => (
    <Loading errorText={handleNetworkError(error)} loading={loading} />
  );

  const onEndReached = async () => {
    if (data && !data.StaffCharacters.characterMedia?.pageInfo.hasNextPage) {
      return;
    }
    await fetchMore({variables: {page: page + 1}});
    setPage(page + 1);
  };

  return (
    <FlatList
      contentContainerStyle={AppStyles.paddingVertical}
      data={data?.StaffCharacters?.characterMedia?.edges}
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={listEmpty}
      renderItem={renderCharacterMedia}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.7}
    />
  );
};

export default StaffCharactersScreen;
