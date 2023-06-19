import {useQuery} from '@apollo/client';
import {colord} from 'colord';
import TextRow from 'components/textrow';
import dayjs from 'dayjs';
import React from 'react';
import {FlatList, StatusBar, View, useWindowDimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  ActivityIndicator,
  Appbar,
  HelperText,
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
    variables: {id: route.params.item.id},
  });
  const insets = useSafeAreaInsets();
  const paddingTop = useSafeAreaPaddingTop();
  const marginTop = {marginTop: insets.top};
  const baseStyle = {color: colors.onBackground, padding: 12};
  const isColorDark = route.params.item.coverImage.color
    ? colord(route.params.item.coverImage.color).isDark()
    : dark;

  const renderCharacter: ListRenderItem<Anime_Media_characters_edges> = ({
    item,
  }) => {
    const onPressCharacter = () => {
      if (item.node) {
        const {node} = item;
        navigation.push('Character', {
          id: node.id,
          image: node.image.large,
          name: node.name.userPreferred || '',
        });
      }
    };

    return (
      <Surface className="flex-row rounded-xl py-3">
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
      </Surface>
    );
  };

  const renderStaff: ListRenderItem<Anime_Media_staff_nodes> = ({item}) => {
    const onPress = () => {
      navigation.push('Staff', {
        id: item.id,
        image: item.image?.large || '',
        name: item.name?.userPreferred || '',
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
    };
  });

  const renderRelation: ListRenderItem<Anime_Media_relations_edges> = ({
    item,
  }) => {
    const onPress = () => {
      navigation.push('Media', {item: item.node});
    };

    return (
      <Surface className="max-w-[180px] rounded-xl">
        <TouchableRipple
          borderless
          className="flex-1 rounded-xl"
          onPress={onPress}>
          <View className="items-center space-y-1 p-3">
            <Text>{normalizeEnumName(item.relationType)}</Text>
            <FastImage
              className="aspect-poster w-20"
              source={{uri: item.node.coverImage.medium || ''}}
            />
            <Text className="text-center">{item.node.title.romaji}</Text>
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
          <Appbar.BackAction />
        </View>
      </View>
      <Animated.View
        className="absolute z-10 w-full"
        style={[
          {
            backgroundColor:
              route.params.item.coverImage.color || colors.background,
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
            className={`flex-1 ${isColorDark ? 'text-white' : 'text-black'}`}
            numberOfLines={2}
            variant="titleLarge">
            {route.params.item.title.romaji}
          </Text>
        </View>
      </Animated.View>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}>
        {route.params.item.bannerImage ? (
          <>
            <FastImage
              className="aspect-banner w-full"
              source={{uri: route.params.item.bannerImage}}
            />
            <View
              className={`absolute aspect-banner w-full ${
                dark ? 'bg-black/30' : 'bg-white/30'
              }`}
            />
          </>
        ) : (
          <View className="h-14 w-full" style={marginTop} />
        )}
        <Text className="mx-3 my-3 text-center" variant="headlineMedium">
          {route.params.item.title.romaji}
        </Text>
        {(!!route.params.item.coverImage.medium ||
          !!route.params.item.coverImage.large) && (
          <FastImage
            className="aspect-poster w-36 self-center"
            source={{
              uri:
                route.params.item.coverImage.large ||
                route.params.item.coverImage.medium ||
                '',
            }}
          />
        )}
        {data ? (
          <View className="my-3">
            <View className="space-y-1 px-3 pb-3">
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
              <TextRow label="Duration">
                {`${data.Media.duration || 0} mins`}
              </TextRow>
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
                      .month(data.Media.startDate.month)
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
                      .month(data.Media.endDate.month)
                      .year(data.Media.endDate.year)
                      .format('ll')}
                  </TextRow>
                )}
              <TextRow label="Studios">
                {data.Media.studios.nodes.map(s => s.name).join('\n')}
              </TextRow>
              <TextRow label="Source">
                {normalizeEnumName(data.Media.source)}
              </TextRow>
              <TextRow label="Genres">{data.Media.genres.join(', ')}</TextRow>
              <TextRow label="Tags">
                {data.Media.tags.map(t => t.name).join(', ')}
              </TextRow>
              <Text variant="labelMedium">Characters</Text>
            </View>
            <FlatList
              horizontal
              contentContainerStyle={AppStyles.paddingHorizontal}
              data={Array.from(new Set(data.Media.characters.edges || []))}
              ItemSeparatorComponent={Separator}
              renderItem={renderCharacter}
              showsHorizontalScrollIndicator={false}
            />
            <Text className="p-3" variant="labelMedium">
              Staffs
            </Text>
            <FlatList
              horizontal
              contentContainerStyle={AppStyles.paddingHorizontal}
              data={Array.from(new Set(data.Media.staff.nodes))}
              ItemSeparatorComponent={Separator}
              renderItem={renderStaff}
              showsHorizontalScrollIndicator={false}
            />
            <RenderHtml
              baseStyle={baseStyle}
              contentWidth={width}
              source={{html: data.Media.description}}
            />
            {data.Media.relations && (
              <>
                <Text className="mx-3 mb-3" variant="labelMedium">
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
          </View>
        ) : loading ? (
          <ActivityIndicator className="m-3" size="large" />
        ) : (
          error && (
            <HelperText type="error">{handleNetworkError(error)}</HelperText>
          )
        )}
      </Animated.ScrollView>
    </>
  );
};

export default MediaScreen;
