import {useQuery} from '@apollo/client';
import {
  BottomSheetFlatList,
  BottomSheetModal,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import CustomBackdrop from 'components/sheet/backdrop';
import CustomBackground from 'components/sheet/background';
import CustomHandle from 'components/sheet/handle';
import dayjs from 'dayjs';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {FlatList, RefreshControl, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  ActivityIndicator,
  Appbar,
  HelperText,
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
import {QUERY} from './query';
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
  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
  const seasonSheetRef = useRef<BottomSheetModal>(null);
  const seasonYearSheetRef = useRef<BottomSheetModal>(null);
  const formatSheetRef = useRef<BottomSheetModal>(null);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);
  const {colors} = useTheme();
  const [refreshing, setRefreshing] = useState(false);
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
  >(QUERY, {
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

  const onShowSeason = () => seasonSheetRef.current?.present();

  const onShowSeasonYear = () => seasonYearSheetRef.current?.present();

  const onShowFormat = () => formatSheetRef.current?.present();

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
        <TouchableRipple onPress={onShowSeason}>
          <Text>Season {query.season}</Text>
        </TouchableRipple>
        <TouchableRipple onPress={onShowSeasonYear}>
          <Text>Year {query.seasonYear}</Text>
        </TouchableRipple>
        <TouchableRipple onPress={onShowFormat}>
          <Text>Format</Text>
        </TouchableRipple>
      </Appbar.Header>
      <BottomSheetModal
        ref={seasonSheetRef}
        enablePanDownToClose
        backdropComponent={CustomBackdrop}
        backgroundComponent={CustomBackground}
        contentHeight={animatedContentHeight}
        handleComponent={CustomHandle}
        handleHeight={animatedHandleHeight}
        snapPoints={animatedSnapPoints}>
        <BottomSheetFlatList
          data={MEDIA_SEASONS}
          renderItem={({item}) => {
            const onPress = () => {
              setQuery(draft => {
                draft.season = item;
                draft.page = 1;
              });
              seasonSheetRef.current?.dismiss();
            };
            return (
              <TouchableRipple className="p-3" onPress={onPress}>
                <Text>{item}</Text>
              </TouchableRipple>
            );
          }}
          onLayout={handleContentLayout}
        />
      </BottomSheetModal>
      <BottomSheetModal
        ref={seasonYearSheetRef}
        enablePanDownToClose
        backdropComponent={CustomBackdrop}
        backgroundComponent={CustomBackground}
        contentHeight={animatedContentHeight}
        handleComponent={CustomHandle}
        handleHeight={animatedHandleHeight}
        snapPoints={animatedSnapPoints}>
        <BottomSheetFlatList
          data={YEARS}
          renderItem={({item}) => {
            const onPress = () => {
              setQuery(draft => {
                draft.seasonYear = item;
                draft.page = 1;
              });
              seasonYearSheetRef.current?.dismiss();
            };
            return (
              <TouchableRipple className="p-3" onPress={onPress}>
                <Text>{item}</Text>
              </TouchableRipple>
            );
          }}
          onLayout={handleContentLayout}
        />
      </BottomSheetModal>
      <BottomSheetModal
        ref={formatSheetRef}
        enablePanDownToClose
        backdropComponent={CustomBackdrop}
        backgroundComponent={CustomBackground}
        contentHeight={animatedContentHeight}
        handleComponent={CustomHandle}
        handleHeight={animatedHandleHeight}
        snapPoints={animatedSnapPoints}>
        <BottomSheetFlatList
          data={MEDIA_FORMATS}
          renderItem={({item}) => {
            const onPress = () => {
              setQuery(draft => {
                if (draft.format.includes(item)) {
                  const index = draft.format.findIndex(mm => mm === item);
                  if (index !== -1) {
                    draft.format.splice(index, 1);
                  }
                } else {
                  draft.format.push(item);
                }
                draft.page = 1;
              });
            };
            return (
              <TouchableRipple
                className="flex-row justify-between p-3"
                onPress={onPress}>
                <>
                  <Text>{item}</Text>
                  {query.format.includes(item) ? (
                    <Icon color={colors.onBackground} name="check" size={20} />
                  ) : undefined}
                </>
              </TouchableRipple>
            );
          }}
          onLayout={handleContentLayout}
        />
      </BottomSheetModal>
    </>
  );
};

export default HomeScreen;
