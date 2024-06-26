import {useLazyQuery} from '@apollo/client';
import Loading from 'components/loading';
import MediaItem from 'components/mediaitem';
import Separator from 'components/separator';
import React from 'react';
import {FlatList, StatusBar} from 'react-native';
import {Searchbar} from 'react-native-paper';
import {useDebouncedCallback} from 'use-debounce';
import {useImmer} from 'use-immer';
import {handleNetworkError} from 'utils';
import AppStyles from 'utils/styles';
import {QUERY} from './query';
import type {SearchList} from './types';
import type {ListRenderItem} from 'react-native';
import type {IMediaItem} from 'typings/globalTypes';
import type {RootStackScreenProps} from 'typings/navigation';

type TQuery = {
  page: number;
  keyword: string;
};

const SearchScreen = ({navigation}: RootStackScreenProps<'Search'>) => {
  const [query, setQuery] = useImmer<TQuery>({
    page: 1,
    keyword: '',
  });
  const [getAnimeList, {loading, error, fetchMore, data}] = useLazyQuery<
    SearchList,
    TQuery
  >(QUERY);
  const debounced = useDebouncedCallback<(value: TQuery) => void>(
    // function
    value => {
      getAnimeList({variables: value});
    },
    // delay in ms
    1000,
  );

  const listEmpty = () => {
    return (
      <Loading
        emptyText={query.keyword.length > 0 ? 'Empty' : ''}
        errorText={handleNetworkError(error)}
        loading={loading}
      />
    );
  };

  const renderItem: ListRenderItem<IMediaItem> = ({item}) => {
    const onPress = () => {
      navigation.navigate('Media', {
        id: item.id,
        bannerImage: item.bannerImage,
        coverImage: item.coverImage.large || item.coverImage.medium,
        color: item.coverImage.color,
        title: item.title.romaji,
      });
    };

    return <MediaItem item={item} onPress={onPress} />;
  };

  const onEndReached = async () => {
    if (
      query.keyword.length === 0 ||
      (data && !data?.SearchResult.pageInfo.hasNextPage)
    ) {
      return;
    }
    await fetchMore({variables: {page: query.page + 1}});
    setQuery(draft => {
      draft.page += 1;
    });
  };

  const onChangeText = (keyword: string) => {
    setQuery({keyword, page: 1});
    if (keyword.length > 0) {
      debounced({keyword, page: 1});
    }
  };

  return (
    <>
      <Searchbar
        className="ml-16 mr-3"
        style={{marginTop: StatusBar.currentHeight}}
        value={query.keyword}
        onChangeText={onChangeText}
      />
      <FlatList
        contentContainerStyle={AppStyles.paddingVertical}
        data={data?.SearchResult.media.filter(
          (value, index, self) =>
            index === self.findIndex(t => t.id === value.id),
        )}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={listEmpty}
        renderItem={renderItem}
        onEndReached={onEndReached}
      />
    </>
  );
};

export default SearchScreen;
