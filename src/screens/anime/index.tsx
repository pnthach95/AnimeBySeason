import {gql, useQuery} from '@apollo/client';
import dayjs from 'dayjs';
import React from 'react';
import {FlatList, View, useWindowDimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text, useTheme} from 'react-native-paper';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import RenderHtml from 'react-native-render-html';
import Person from './person';
import type {
  Anime,
  AnimeVariables,
  Anime_Media_characters_nodes,
  Anime_Media_staff_nodes,
} from './types';
import type {ListRenderItem} from 'react-native';
import type {RootStackScreenProps} from 'typings/navigation';

const GET_DATA = gql`
  query Anime($id: Int) {
    Media(id: $id) {
      id
      episodes
      title {
        romaji
        english
        native
      }
      format
      status
      description(asHtml: false)
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      duration
      source
      tags {
        id
        name
      }
      characters {
        nodes {
          id
          name {
            full
            native
            userPreferred
          }
          image {
            large
          }
        }
      }
      staff {
        nodes {
          id
          name {
            full
            native
            userPreferred
          }
          image {
            large
          }
          primaryOccupations
        }
      }
      studios {
        nodes {
          id
          name
        }
      }
      coverImage {
        large
        medium
        color
      }
      bannerImage
      genres
      format
      isAdult
    }
  }
`;

const AnimeScreen = ({route}: RootStackScreenProps<'Anime'>) => {
  const translationY = useSharedValue(0);
  const {width} = useWindowDimensions();
  const {colors} = useTheme();
  const {data} = useQuery<Anime, AnimeVariables>(GET_DATA, {
    variables: {id: route.params.item.id},
  });

  const renderCharacter: ListRenderItem<Anime_Media_characters_nodes> = ({
    item,
  }) => {
    return (
      <Person image={item.image.large || ''} name={item.name.full || ''} />
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
        [0, 72],
        [0, 1],
        Extrapolation.CLAMP,
      ),
    };
  });

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
            <Text selectable>English title: {data.Media.title.english}</Text>
            <Text>Source: {data.Media.source}</Text>
            <Text>Format: {data.Media.format}</Text>
            <Text>Status: {data.Media.status}</Text>
            {data.Media.startDate &&
              !!data.Media.startDate.day &&
              !!data.Media.startDate.month &&
              !!data.Media.startDate.year && (
                <Text>
                  Start date:{' '}
                  {dayjs()
                    .date(data.Media.startDate.day)
                    .month(data.Media.startDate.month)
                    .year(data.Media.startDate.year)
                    .format('ll')}
                </Text>
              )}
            {data.Media.endDate &&
              !!data.Media.endDate.day &&
              !!data.Media.endDate.month &&
              !!data.Media.endDate.year && (
                <Text>
                  End date:{' '}
                  {dayjs()
                    .date(data.Media.endDate.day)
                    .month(data.Media.endDate.month)
                    .year(data.Media.endDate.year)
                    .format('ll')}
                </Text>
              )}
            <Text>Duration: {data.Media.duration || 0} minutes</Text>
            <Text>Genres: {data.Media.genres.join(', ')}</Text>
            <Text>Tags: {data.Media.tags.map(t => t.name).join(', ')}</Text>
            <View className="flex-row justify-between">
              <Text>Studios</Text>
              <Text className="text-right">
                {data.Media.studios.nodes?.map(s => s.name).join('\n')}
              </Text>
            </View>
            <Text>Characters</Text>
            <FlatList
              horizontal
              data={data.Media.characters.nodes || []}
              renderItem={renderCharacter}
              showsHorizontalScrollIndicator={false}
            />
            <Text>Staffs</Text>
            <FlatList
              horizontal
              data={data.Media.staff.nodes}
              renderItem={renderStaff}
              showsHorizontalScrollIndicator={false}
            />
            <RenderHtml
              baseStyle={{color: colors.onBackground}}
              contentWidth={width}
              source={{html: data.Media.description}}
            />
          </View>
        )}
      </Animated.ScrollView>
    </>
  );
};

export default AnimeScreen;
