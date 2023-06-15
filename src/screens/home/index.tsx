import {gql, useQuery} from '@apollo/client';
import dayjs from 'dayjs';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  ActivityIndicator,
  Appbar,
  HelperText,
  Menu,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaType,
} from 'typings/globalTypes';
import {useImmer} from 'use-immer';
import type {AnimeList, AnimeList_Page_media} from './types';
import type {ListRenderItem} from 'react-native';
import type {MainTabScreenProps} from 'typings/navigation';

type TQuery = {
  season: MediaSeason;
  seasonYear: number;
  sort: MediaSort;
  page: number;
  format: MediaFormat[];
  type: MediaType;
};

const MEDIA_SEASONS: MediaSeason[] = [
  MediaSeason.WINTER,
  MediaSeason.SPRING,
  MediaSeason.SUMMER,
  MediaSeason.FALL,
];

const YEARS = (() => {
  const a = [];
  for (let i = 2010; i < dayjs().year() + 2; i++) {
    a.push(i);
  }
  return a;
})();

const MEDIA_FORMATS: MediaFormat[] = [
  MediaFormat.TV,
  MediaFormat.TV_SHORT,
  MediaFormat.ONA,
  MediaFormat.OVA,
  MediaFormat.ONE_SHOT,
  MediaFormat.SPECIAL,
  MediaFormat.MOVIE,
  MediaFormat.MUSIC,
];

const GET_DATA = gql`
  query AnimeList(
    $season: MediaSeason
    $seasonYear: Int
    $sort: [MediaSort]
    $page: Int
    $type: MediaType
    $format: [MediaFormat]
  ) {
    Page(page: $page, perPage: 20) {
      media(
        season: $season
        seasonYear: $seasonYear
        sort: $sort
        type: $type
        format_in: $format
      ) {
        id
        episodes
        title {
          romaji
          english
          native
        }
        coverImage {
          medium
          large
          color
        }
        genres
        format
        isAdult
      }
    }
  }
`;

const getInitSeason = () => {
  const month = dayjs().month();
  if (month >= 3 && month <= 5) {
    return MediaSeason.SPRING;
  }
  if (month >= 6 && month <= 8) {
    return MediaSeason.SUMMER;
  }
  if (month >= 9 && month <= 11) {
    return MediaSeason.FALL;
  }
  return MediaSeason.WINTER;
};

const Separator = () => <View className="h-3" />;

const HomeScreen = ({navigation}: MainTabScreenProps<'Home'>) => {
  const {colors} = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [visibles, setVisibles] = useImmer({
    season: false,
    seasonYear: false,
    format: false,
  });
  const [query, setQuery] = useImmer<TQuery>({
    season: getInitSeason(),
    seasonYear: dayjs().year(),
    sort: MediaSort.TITLE_ROMAJI,
    page: 1,
    format: [MediaFormat.MOVIE, MediaFormat.TV],
    type: MediaType.ANIME,
  });
  const {loading, data, previousData, error, refetch, fetchMore} = useQuery<
    AnimeList,
    TQuery
  >(GET_DATA, {
    variables: query,
  });

  useEffect(() => {
    if (refreshing && !loading) {
      setRefreshing(false);
    }
  }, [refreshing, loading]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch({...query, page: 1});
    setQuery(draft => {
      draft.page = 1;
    });
  }, [query]);

  const RC = (
    <RefreshControl
      colors={[colors.primary, colors.secondary]}
      refreshing={refreshing}
      tintColor={colors.primary}
      onRefresh={onRefresh}
    />
  );

  const listEmpty = () => {
    if (loading) {
      return <ActivityIndicator size="large" />;
    }
    if (error) {
      const text = (
        (
          error?.networkError as unknown as {
            result: {errors: {message: string}[]};
          }
        ).result as {
          errors: {message: string}[];
        }
      ).errors
        .map(e => e.message)
        .join(', ');

      return <HelperText type="error">{text}</HelperText>;
    }
    return <Text className="text-center">Empty</Text>;
  };

  const renderItem: ListRenderItem<AnimeList_Page_media> = ({item}) => {
    const onPress = () => {
      navigation.navigate('Anime', {item});
    };

    return (
      <TouchableRipple onPress={onPress}>
        <View className="mx-3 flex-row">
          {!!item.coverImage.medium && (
            <FastImage
              className="aspect-poster w-20"
              resizeMode="contain"
              source={{uri: item.coverImage.medium}}
              style={{
                backgroundColor: item.coverImage.color || undefined,
              }}
            />
          )}
          <View className="ml-3 flex-1">
            <Text variant="titleLarge">{item.title.romaji}</Text>
            {!!item.title.english && (
              <Text variant="titleMedium">{item.title.english}</Text>
            )}
            {item.format === MediaFormat.TV && (
              <Text>Episodes: {item.episodes || 0}</Text>
            )}
            <Text variant="labelSmall">{item.format}</Text>
            <Text variant="labelSmall">{item.genres.join(', ')}</Text>
          </View>
        </View>
      </TouchableRipple>
    );
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

  const onShowSeason = () =>
    setVisibles(draft => {
      draft.season = true;
    });

  const onDismissSeason = () =>
    setVisibles(draft => {
      draft.season = false;
    });

  const onShowSeasonYear = () =>
    setVisibles(draft => {
      draft.seasonYear = true;
    });

  const onDismissSeasonYear = () =>
    setVisibles(draft => {
      draft.seasonYear = false;
    });

  const onShowFormat = () =>
    setVisibles(draft => {
      draft.format = true;
    });

  const onDismissFormat = () =>
    setVisibles(draft => {
      draft.format = false;
    });

  return (
    <>
      <FlatList
        data={data?.Page.media || []}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={listEmpty}
        refreshControl={RC}
        renderItem={renderItem}
        onEndReached={onEndReached}
      />
      <Appbar.Header className="justify-evenly">
        <Menu
          anchor={
            <TouchableRipple onPress={onShowSeason}>
              <Text>Season {query.season}</Text>
            </TouchableRipple>
          }
          visible={visibles.season}
          onDismiss={onDismissSeason}>
          {MEDIA_SEASONS.map(m => {
            const onPress = () => {
              onDismissSeason();
              setQuery(draft => {
                draft.season = m;
                draft.page = 1;
              });
            };
            return <Menu.Item key={m} title={m} onPress={onPress} />;
          })}
        </Menu>
        <Menu
          anchor={
            <TouchableRipple onPress={onShowSeasonYear}>
              <Text>Year {query.seasonYear}</Text>
            </TouchableRipple>
          }
          visible={visibles.seasonYear}
          onDismiss={onDismissSeasonYear}>
          {YEARS.map(m => {
            const onPress = () => {
              onDismissSeasonYear();
              setQuery(draft => {
                draft.seasonYear = m;
                draft.page = 1;
              });
            };
            return <Menu.Item key={m} title={m} onPress={onPress} />;
          })}
        </Menu>
        <Menu
          anchor={
            <TouchableRipple onPress={onShowFormat}>
              <Text>Format</Text>
            </TouchableRipple>
          }
          visible={visibles.format}
          onDismiss={onDismissFormat}>
          {MEDIA_FORMATS.map(m => {
            const onPress = () => {
              onDismissFormat();
              setQuery(draft => {
                if (draft.format.includes(m)) {
                  const index = draft.format.findIndex(mm => mm === m);
                  if (index !== -1) {
                    draft.format.splice(index, 1);
                  }
                } else {
                  draft.format.push(m);
                }
                draft.page = 1;
              });
            };
            return (
              <Menu.Item
                key={m}
                title={m}
                trailingIcon={
                  query.format.includes(m)
                    ? () => (
                        <Icon
                          color={colors.onBackground}
                          name="check"
                          size={20}
                        />
                      )
                    : undefined
                }
                onPress={onPress}
              />
            );
          })}
        </Menu>
      </Appbar.Header>
    </>
  );
};

export default HomeScreen;
