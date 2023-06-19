import {useLazyQuery} from '@apollo/client';
import MediaItem from 'components/mediaitem';
import React from 'react';
import {FlatList, View} from 'react-native';
import {
  ActivityIndicator,
  HelperText,
  Searchbar,
  Text,
} from 'react-native-paper';
import {useDebouncedCallback} from 'use-debounce';
import {useImmer} from 'use-immer';
import {handleNetworkError} from 'utils';
import {QUERY} from './query';
import type {ListRenderItem} from 'react-native';
import type {AnimeList} from 'screens/home/types';
import type {IMediaItem} from 'typings/globalTypes';
import type {RootStackScreenProps} from 'typings/navigation';

type TQuery = {
  page: number;
  keyword: string;
};

const Separator = () => <View className="h-3" />;

const SearchScreen = ({navigation}: RootStackScreenProps<'Search'>) => {
  const [query, setQuery] = useImmer<TQuery>({
    page: 1,
    keyword: '',
  });
  const [getAnimeList, {loading, error, previousData, fetchMore, data}] =
    useLazyQuery<AnimeList, TQuery>(QUERY);
  const debounced = useDebouncedCallback<(value: TQuery) => void>(
    // function
    value => {
      getAnimeList({variables: value});
    },
    // delay in ms
    1000,
  );

  const listEmpty = () => {
    if (loading) {
      return <ActivityIndicator size="large" />;
    }
    if (error) {
      const text = handleNetworkError(error);
      return <HelperText type="error">{text}</HelperText>;
    }
    if (query.keyword.length > 0) {
      return <Text className="text-center">Empty</Text>;
    }
    return null;
  };

  const renderItem: ListRenderItem<IMediaItem> = ({item}) => {
    const onPress = () => {
      navigation.navigate('Media', {item});
    };

    return <MediaItem item={item} onPress={onPress} />;
  };

  const onEndReached = async () => {
    if (data?.Page.media.length === previousData?.Page.media.length) {
      return;
    }
    await fetchMore({variables: {page: query.page + 1}});
    setQuery(draft => {
      draft.page += 1;
    });
  };

  const onChangeText = (keyword: string): void => {
    setQuery({keyword, page: 1});
    debounced({keyword, page: 1});
  };

  return (
    <>
      <Searchbar
        className="ml-16 mr-3"
        value={query.keyword}
        onChangeText={onChangeText}
      />
      <FlatList
        data={data?.Page.media || []}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={listEmpty}
        renderItem={renderItem}
        onEndReached={onEndReached}
      />
    </>
  );
};

export default SearchScreen;
