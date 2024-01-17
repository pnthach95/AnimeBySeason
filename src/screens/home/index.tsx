import {useQuery} from '@apollo/client';
import {BottomSheetFlatList, BottomSheetModal} from '@gorhom/bottom-sheet';
import {useScrollToTop} from '@react-navigation/native';
import Loading from 'components/loading';
import MediaItem from 'components/mediaitem';
import Separator from 'components/separator';
import CustomBackdrop from 'components/sheet/backdrop';
import CustomBackground from 'components/sheet/background';
import CustomHandle from 'components/sheet/handle';
import dayjs from 'dayjs';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, RefreshControl} from 'react-native';
import {
  Appbar,
  Button,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  type IMediaItem,
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaType,
} from 'typings/globalTypes';
import {useImmer} from 'use-immer';
import {handleNetworkError, normalizeEnumName} from 'utils';
import {useSafeAreaPaddingBottom, useSafeAreaPaddingTop} from 'utils/styles';
import {QUERY} from './query';
import type {AnimeList} from './types';
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
  const month = dayjs().month() + 1;
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

const HomeScreen = ({navigation}: MainTabScreenProps<'Home'>) => {
  const ref = useRef(null);
  const seasonSheetRef = useRef<BottomSheetModal>(null);
  const seasonYearSheetRef = useRef<BottomSheetModal>(null);
  const formatSheetRef = useRef<BottomSheetModal>(null);
  const bottomSheetStyle = useSafeAreaPaddingBottom();
  const contentStyle = useSafeAreaPaddingTop(12, {paddingBottom: 12});
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
  const {loading, data, error, refetch, fetchMore} = useQuery<
    AnimeList,
    TQuery
  >(QUERY, {
    variables: query,
  });

  useScrollToTop(ref);

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
    return (
      <Loading
        emptyText="Empty"
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
    if (data && !data.Page.pageInfo.hasNextPage) {
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

  const onPressSearch = () => navigation.navigate('Search');

  const renderMediaSeason: ListRenderItem<MediaSeason> = ({item}) => {
    const onPress = () => {
      setQuery(draft => {
        draft.season = item;
        draft.page = 1;
      });
      seasonSheetRef.current?.dismiss();
    };
    return (
      <TouchableRipple className="p-3" onPress={onPress}>
        <Text>{normalizeEnumName(item)}</Text>
      </TouchableRipple>
    );
  };

  const renderYear: ListRenderItem<number> = ({item}) => {
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
  };

  const renderMediaFormat: ListRenderItem<MediaFormat> = ({item}) => {
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
          <Text>{normalizeEnumName(item)}</Text>
          {query.format.includes(item) ? (
            <Icon color={colors.onBackground} name="check" size={20} />
          ) : undefined}
        </>
      </TouchableRipple>
    );
  };

  return (
    <>
      <FlatList
        ref={ref}
        contentContainerStyle={contentStyle}
        data={data?.Page.media}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={listEmpty}
        refreshControl={RC}
        renderItem={renderItem}
        onEndReached={onEndReached}
      />
      <Appbar.Header elevated className="justify-evenly" statusBarHeight={0}>
        <Button compact onPress={onShowSeason}>
          Season {query.season}
        </Button>
        <Button compact onPress={onShowSeasonYear}>
          Year {query.seasonYear}
        </Button>
        <Button compact onPress={onShowFormat}>
          Format
        </Button>
        <Appbar.Action icon="magnify" onPress={onPressSearch} />
      </Appbar.Header>
      <BottomSheetModal
        ref={seasonSheetRef}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={CustomBackdrop}
        backgroundComponent={CustomBackground}
        handleComponent={CustomHandle}>
        <BottomSheetFlatList
          contentContainerStyle={bottomSheetStyle}
          data={MEDIA_SEASONS}
          renderItem={renderMediaSeason}
        />
      </BottomSheetModal>
      <BottomSheetModal
        ref={seasonYearSheetRef}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={CustomBackdrop}
        backgroundComponent={CustomBackground}
        handleComponent={CustomHandle}>
        <BottomSheetFlatList
          contentContainerStyle={bottomSheetStyle}
          data={YEARS}
          renderItem={renderYear}
        />
      </BottomSheetModal>
      <BottomSheetModal
        ref={formatSheetRef}
        enableDynamicSizing
        enablePanDownToClose
        backdropComponent={CustomBackdrop}
        backgroundComponent={CustomBackground}
        handleComponent={CustomHandle}>
        <BottomSheetFlatList
          contentContainerStyle={bottomSheetStyle}
          data={MEDIA_FORMATS}
          renderItem={renderMediaFormat}
        />
      </BottomSheetModal>
    </>
  );
};

export default HomeScreen;
