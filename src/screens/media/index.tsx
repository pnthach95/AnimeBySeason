import {useQuery} from '@apollo/client';
import {colord} from 'colord';
import Loading from 'components/loading';
import TextRow from 'components/textrow';
import dayjs from 'dayjs';
import React from 'react';
import {FlatList, StatusBar, View, useWindowDimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  Appbar,
  Surface,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import RenderHtml from 'react-native-render-html';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {handleNetworkError, normalizeEnumName} from 'utils';
import AppStyles, {useSafeAreaPaddingTop} from 'utils/styles';
import Character from './character';
import Person from './person';
import {QUERY} from './query';
import Relation from './relation';
import type {
  Anime,
  AnimeVariables,
  Anime_Media_characters_edges,
  Anime_Media_relations_edges,
  Anime_Media_staff_nodes,
} from './types';
import type {ListRenderItem} from 'react-native';
import type {RootStackScreenProps} from 'typings/navigation';

const Separator = () => <View className="w-3" />;

const MediaScreen = ({navigation, route}: RootStackScreenProps<'Media'>) => {
  const translationY = useSharedValue(0);
  const {width} = useWindowDimensions();
  const {colors, dark} = useTheme();
  const {data, loading, error} = useQuery<Anime, AnimeVariables>(QUERY, {
    variables: {id: route.params.id},
  });
  const insets = useSafeAreaInsets();
  const paddingTop = useSafeAreaPaddingTop();
  const marginTop = {marginTop: insets.top};
  const bannerHeight = 56 + insets.top;
  const baseStyle = {color: colors.onBackground, padding: 12};
  const isColorDark = route.params.color
    ? colord(route.params.color).isDark()
    : data?.Media.coverImage.color
    ? colord(data.Media.coverImage.color).isDark()
    : dark;
  const headerColor = {
    backgroundColor:
      route.params.color || data?.Media.coverImage.color || colors.background,
  };
  const bannerImage = route.params.bannerImage || data?.Media.bannerImage;
  const bannerHeightStyle = {height: bannerHeight};
  const coverImage =
    route.params.coverImage ||
    data?.Media.coverImage.large ||
    data?.Media.coverImage.medium;

  const onPressCover = () => {
    if (coverImage) {
      navigation.navigate('Gallery', {idx: 0, images: [coverImage]});
    }
  };

  const onPressBanner = () => {
    if (data?.Media.bannerImage) {
      navigation.navigate('Gallery', {
        idx: 0,
        images: [data.Media.bannerImage],
      });
    }
  };

  const renderCharacter: ListRenderItem<Anime_Media_characters_edges> = ({
    item,
  }) => {
    const onPressCharacter = () => {
      if (item.node) {
        const {id, image, name} = item.node;
        navigation.push('Character', {
          id,
          image: image.large,
          name: name.userPreferred,
        });
      }
    };

    const onPressVA = (id: number, image: string, name: string) => {
      navigation.push('Staff', {id, image, name});
    };

    return (
      <Character
        item={item}
        onPressCharacter={onPressCharacter}
        onPressVA={onPressVA}
      />
    );
  };

  const renderStaff: ListRenderItem<Anime_Media_staff_nodes> = ({item}) => {
    const onPress = () => {
      navigation.push('Staff', {
        id: item.id,
        image: item.image?.large,
        name: item.name?.userPreferred,
      });
    };

    return (
      <Person
        image={item.image.large || ''}
        name={`${item.name.full || ''}${
          item.primaryOccupations && item.primaryOccupations.length > 0
            ? `\n(${item.primaryOccupations?.join(', ')})`
            : ''
        }`}
        onPress={onPress}
      />
    );
  };

  const scrollHandler = useAnimatedScrollHandler(event => {
    translationY.value = event.contentOffset.y;
  });

  const stylez = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        translationY.value,
        [0, bannerHeight - insets.top],
        [0, 1],
        Extrapolation.CLAMP,
      ),
    };
  }, [bannerHeight]);

  const renderRelation: ListRenderItem<Anime_Media_relations_edges> = ({
    item,
  }) => {
    const onPress = () => {
      navigation.push('Media', {
        id: item.node.id,
        bannerImage: item.node.bannerImage,
        coverImage: item.node.coverImage.large || item.node.coverImage.medium,
        color: item.node.coverImage.color,
        title: item.node.title.romaji,
      });
    };

    return <Relation item={item} onPress={onPress} />;
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <View className="absolute z-10" style={paddingTop}>
        <View className="h-14 flex-row items-center">
          <Appbar.BackAction onPress={navigation.goBack} />
        </View>
      </View>
      <Animated.View
        className="absolute z-10 w-full"
        pointerEvents="none"
        style={[headerColor, paddingTop, stylez]}>
        <View className="h-14 flex-row items-center">
          <Appbar.BackAction
            color={isColorDark ? 'white' : 'black'}
            onPress={navigation.goBack}
          />
          <Text
            className={`mr-1 flex-1 ${
              isColorDark ? 'text-white' : 'text-black'
            }`}
            numberOfLines={2}
            variant="titleLarge">
            {route.params.title || data?.Media.title.romaji}
          </Text>
        </View>
      </Animated.View>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}>
        {bannerImage ? (
          <>
            <TouchableRipple borderless onPress={onPressBanner}>
              <FastImage
                className="w-full"
                source={{
                  uri: bannerImage || '',
                }}
                style={bannerHeightStyle}
              />
            </TouchableRipple>
            <View
              className={`absolute w-full ${
                dark ? 'bg-black/30' : 'bg-white/30'
              }`}
              pointerEvents="none"
              style={bannerHeightStyle}
            />
          </>
        ) : (
          <View className="h-14 w-full" style={marginTop} />
        )}
        <Text
          selectable
          className="mx-3 my-3 text-center"
          variant="headlineMedium">
          {route.params.title || data?.Media.title.romaji}
        </Text>
        {!!coverImage && (
          <TouchableRipple
            borderless
            className="self-center"
            onPress={onPressCover}>
            <FastImage
              className="aspect-poster w-36 self-center"
              source={{uri: coverImage}}
            />
          </TouchableRipple>
        )}
        {data ? (
          <View className="mt-3">
            <View className="space-y-1 px-3">
              {!!data.Media.title.english && (
                <TextRow label="English title">
                  {data.Media.title.english}
                </TextRow>
              )}
              <TextRow label="Format">
                {normalizeEnumName(data.Media.format)}
              </TextRow>
              {!!data.Media.episodes && (
                <TextRow label="Episodes">{data.Media.episodes}</TextRow>
              )}
              {!!data.Media.duration && data.Media.duration > 0 && (
                <TextRow label="Duration">
                  {`${data.Media.duration || 0} mins`}
                </TextRow>
              )}
              <TextRow label="Status">
                {normalizeEnumName(data.Media.status)}
              </TextRow>
              {data.Media.startDate &&
                !!data.Media.startDate.day &&
                !!data.Media.startDate.month &&
                !!data.Media.startDate.year && (
                  <TextRow label="Start date">
                    {dayjs()
                      .date(data.Media.startDate.day)
                      .month(data.Media.startDate.month - 1)
                      .year(data.Media.startDate.year)
                      .format('ll')}
                  </TextRow>
                )}
              {data.Media.endDate &&
                !!data.Media.endDate.day &&
                !!data.Media.endDate.month &&
                !!data.Media.endDate.year && (
                  <TextRow label="End date">
                    {dayjs()
                      .date(data.Media.endDate.day)
                      .month(data.Media.endDate.month - 1)
                      .year(data.Media.endDate.year)
                      .format('ll')}
                  </TextRow>
                )}
              {data.Media.studios.nodes.length > 0 && (
                <TextRow label="Studios">
                  {data.Media.studios.nodes.map(s => s.name).join('\n')}
                </TextRow>
              )}
              <TextRow label="Source">
                {normalizeEnumName(data.Media.source)}
              </TextRow>
              <TextRow label="Genres">{data.Media.genres.join(', ')}</TextRow>
              <Text variant="labelMedium">Characters</Text>
            </View>
            <FlatList
              horizontal
              contentContainerStyle={AppStyles.paddingHorizontal}
              data={data.Media.characters.edges}
              ItemSeparatorComponent={Separator}
              renderItem={renderCharacter}
              showsHorizontalScrollIndicator={false}
            />
            <Text className="px-3 pb-3" variant="labelMedium">
              Staffs
            </Text>
            <FlatList
              horizontal
              contentContainerStyle={AppStyles.paddingHorizontal}
              data={data.Media.staff.nodes?.filter(
                (value, index, self) =>
                  index === self.findIndex(t => t.id === value.id),
              )}
              ItemSeparatorComponent={Separator}
              renderItem={renderStaff}
              showsHorizontalScrollIndicator={false}
            />
            {!!data.Media.description && (
              <RenderHtml
                baseStyle={baseStyle}
                contentWidth={width}
                defaultTextProps={{selectable: true}}
                source={{html: data.Media.description}}
              />
            )}
            {data.Media.relations && (
              <>
                <Text className="mx-3" variant="labelMedium">
                  Relations
                </Text>
                <FlatList
                  horizontal
                  contentContainerStyle={AppStyles.paddingHorizontal}
                  data={data.Media.relations.edges}
                  ItemSeparatorComponent={Separator}
                  renderItem={renderRelation}
                  showsHorizontalScrollIndicator={false}
                />
              </>
            )}
            <Text className="mx-3 mb-3" variant="labelMedium">
              Tags
            </Text>
            {data.Media.tags.map(t => (
              <Surface key={t.name} className="mx-3 mb-3 rounded-xl p-3">
                <View className="flex-row justify-between">
                  <Text selectable>{t.name}</Text>
                  <Text>{t.rank}</Text>
                </View>
                <Text selectable variant="labelSmall">
                  {t.description.trim()}
                </Text>
              </Surface>
            ))}
          </View>
        ) : (
          <Loading errorText={handleNetworkError(error)} loading={loading} />
        )}
      </Animated.ScrollView>
    </>
  );
};

export default MediaScreen;
