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
import Person from './person';
import {QUERY} from './query';
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
  const baseStyle = {color: colors.onBackground, padding: 12};
  const isColorDark = route.params.color
    ? colord(route.params.color).isDark()
    : data?.Media.coverImage.color
    ? colord(data.Media.coverImage.color).isDark()
    : dark;

  const onPressCover = () => {
    const img =
      route.params.coverImage ||
      data?.Media.coverImage.large ||
      data?.Media.coverImage.medium;
    if (img) {
      navigation.navigate('Gallery', {idx: 0, images: [img]});
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
        const {node} = item;
        navigation.push('Character', {
          id: node.id,
          image: node.image.large,
          name: node.name.userPreferred,
        });
      }
    };

    return (
      <Surface className="my-3 rounded-xl py-1">
        <Text className="mx-3 mb-1" variant="labelSmall">
          {normalizeEnumName(item.role)}
        </Text>
        <View className="flex-row">
          <Person
            image={item.node?.image.large || ''}
            name={item.node?.name.userPreferred || ''}
            onPress={onPressCharacter}
          />
          {item.voiceActors.map(va => {
            const onPressVA = () => {
              navigation.push('Staff', {
                id: va.id,
                image: va.image?.large || '',
                name: va.name?.userPreferred || '',
              });
            };

            return (
              <Person
                key={`${va.__typename}_${va.id}`}
                image={va.image?.large || ''}
                name={va.name?.userPreferred || ''}
                onPress={onPressVA}
              />
            );
          })}
        </View>
      </Surface>
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
        [0, 56 - insets.top],
        [0, 1],
        Extrapolation.CLAMP,
      ),
      display: translationY.value === 0 ? 'none' : undefined,
    };
  });

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

    return (
      <Surface className="my-3 max-w-[180px] rounded-xl">
        <TouchableRipple
          borderless
          className="flex-1 rounded-xl"
          onPress={onPress}>
          <View className="items-center space-y-1 p-3">
            <Text variant="labelSmall">
              {normalizeEnumName(item.relationType)}
            </Text>
            <FastImage
              className="aspect-poster w-20"
              source={{uri: item.node.coverImage.medium || ''}}
            />
            <Text className="text-center" numberOfLines={3}>
              {item.node.title.romaji}
            </Text>
            <Text variant="bodySmall">
              {normalizeEnumName(item.node.format)}
            </Text>
          </View>
        </TouchableRipple>
      </Surface>
    );
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
        style={[
          {
            backgroundColor:
              route.params.color ||
              data?.Media.coverImage.color ||
              colors.background,
          },
          paddingTop,
          stylez,
        ]}>
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
        {!!route.params.bannerImage || !!data?.Media.bannerImage ? (
          <>
            <TouchableRipple borderless onPress={onPressBanner}>
              <FastImage
                className="aspect-banner w-full"
                source={{
                  uri:
                    route.params.bannerImage || data?.Media.bannerImage || '',
                }}
              />
            </TouchableRipple>
            <View
              className={`absolute aspect-banner w-full ${
                dark ? 'bg-black/30' : 'bg-white/30'
              }`}
              pointerEvents="none"
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
        {(!!route.params.coverImage || !!data?.Media.coverImage.large) && (
          <TouchableRipple
            borderless
            className="self-center"
            onPress={onPressCover}>
            <FastImage
              className="aspect-poster w-36 self-center"
              source={{
                uri:
                  route.params.coverImage || data?.Media.coverImage.large || '',
              }}
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
