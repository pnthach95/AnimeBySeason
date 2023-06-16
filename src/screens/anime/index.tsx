import {useQuery} from '@apollo/client';
import TextRow from 'components/textrow';
import dayjs from 'dayjs';
import React from 'react';
import {FlatList, View, useWindowDimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Surface, Text, useTheme} from 'react-native-paper';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import RenderHtml from 'react-native-render-html';
import {normalizeEnumName} from 'utils';
import AppStyles from 'utils/styles';
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

const AnimeScreen = ({route}: RootStackScreenProps<'Anime'>) => {
  const translationY = useSharedValue(0);
  const {width} = useWindowDimensions();
  const {colors} = useTheme();
  const {data} = useQuery<Anime, AnimeVariables>(QUERY, {
    variables: {id: route.params.item.id},
  });
  const baseStyle = {color: colors.onBackground, padding: 12};

  const renderCharacter: ListRenderItem<Anime_Media_characters_edges> = ({
    item,
  }) => {
    return (
      <Surface className="flex-row rounded-xl py-3">
        <Person
          image={item.node?.image.large || ''}
          name={item.node?.name.userPreferred || ''}
        />
        {item.voiceActors.map(va => (
          <Person
            image={va.image?.large || ''}
            name={va.name?.userPreferred || ''}
          />
        ))}
      </Surface>
    );
  };

  const renderStaff: ListRenderItem<Anime_Media_staff_nodes> = ({
    item,
  }): React.JSX.Element => {
    return (
      <Person
        image={item.image.large || ''}
        name={`${item.name.full || ''}${
          item.primaryOccupations && item.primaryOccupations.length > 0
            ? `\n(${item.primaryOccupations?.join(', ')})`
            : ''
        }`}
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
        [0, 50],
        [0, 1],
        Extrapolation.CLAMP,
      ),
    };
  });

  const renderRelation: ListRenderItem<Anime_Media_relations_edges> = ({
    item,
  }): React.JSX.Element => {
    return (
      <View className="items-center">
        <FastImage
          className="aspect-poster w-20"
          source={{uri: item.node.coverImage.medium || ''}}
        />
        <Text>{normalizeEnumName(item.relationType)}</Text>
        <Text>{item.node.title.romaji}</Text>
        <Text variant="bodySmall">{normalizeEnumName(item.node.format)}</Text>
      </View>
    );
  };

  return (
    <>
      <Animated.View
        className="absolute z-10 h-14 w-full justify-center"
        style={[
          {
            backgroundColor:
              route.params.item.coverImage.color || colors.background,
          },
          stylez,
        ]}>
        <Text className="ml-12" numberOfLines={2} variant="titleLarge">
          {route.params.item.title.romaji}
        </Text>
      </Animated.View>
      <Animated.ScrollView onScroll={scrollHandler}>
        {data && !!data.Media.bannerImage ? (
          <FastImage
            className="aspect-banner w-full"
            source={{uri: data.Media.bannerImage}}
          />
        ) : (
          <View className="h-14 w-full" />
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
        {data && (
          <View className="my-3">
            <View className="space-y-1 px-3 pb-3">
              <TextRow label="English title">
                {data.Media.title.english}
              </TextRow>
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
              data={data.Media.characters.edges || []}
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
              data={data.Media.staff.nodes}
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
        )}
      </Animated.ScrollView>
    </>
  );
};

export default AnimeScreen;
