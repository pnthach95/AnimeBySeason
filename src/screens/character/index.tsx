import {useQuery} from '@apollo/client';
import MediaItem from 'components/mediaitem';
import TextRow from 'components/textrow';
import dayjs from 'dayjs';
import React, {useEffect} from 'react';
import {FlatList, View, useWindowDimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  ActivityIndicator,
  HelperText,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import RenderHTML from 'react-native-render-html';
import {handleNetworkError, normalizeEnumName} from 'utils';
import {QUERY} from './query';
import type {Character_Character_media_edges, QCharacter} from './types';
import type {ListRenderItem} from 'react-native';
import type {RootStackScreenProps} from 'typings/navigation';

type TQuery = {
  id: number;
};

const CharacterScreen = ({
  navigation,
  route,
}: RootStackScreenProps<'Character'>) => {
  const {colors} = useTheme();
  const {width} = useWindowDimensions();
  const baseStyle = {color: colors.onBackground, paddingTop: 12};
  const {data, error} = useQuery<QCharacter, TQuery>(QUERY, {
    variables: {id: route.params.id},
  });

  useEffect(() => {
    navigation.setOptions({
      title: route.params.name,
    });
  }, []);

  const renderMedia: ListRenderItem<Character_Character_media_edges> = ({
    item,
  }) => {
    const onPress = () => {
      navigation.push('Anime', {item: item.node});
    };

    return (
      <Surface className="mx-3 rounded-xl pt-3">
        <Text className="px-3 pb-1" variant="labelMedium">
          {normalizeEnumName(item.characterRole)}
        </Text>
        <MediaItem item={item.node} onPress={onPress} />
        <View className="flex-row flex-wrap gap-3 p-3">
          {item.voiceActorRoles.map(va => {
            return (
              <Surface
                className="flex-row items-center space-x-1 rounded-xl p-1"
                elevation={3}>
                <FastImage
                  className="aspect-square w-10 rounded-full"
                  source={{uri: va.voiceActor?.image?.large || ''}}
                />
                <View>
                  <Text>{va.voiceActor?.name?.userPreferred}</Text>
                  {!!va.roleNotes && (
                    <Text variant="labelSmall">{va.roleNotes}</Text>
                  )}
                </View>
              </Surface>
            );
          })}
        </View>
      </Surface>
    );
  };

  const header = () => {
    return (
      <View className="p-3">
        <View className="flex-row">
          <FastImage
            className="aspect-poster w-1/3"
            source={{uri: route.params.image || ''}}
          />
          {data && (
            <View className="ml-3 flex-1">
              <Text className="text-center" variant="titleSmall">
                {data.Character.name.native}
              </Text>
              <TextRow label="Age">{data.Character.age}</TextRow>
              <TextRow label="Gender">{data.Character.gender}</TextRow>
              {!!data.Character.bloodType && (
                <TextRow label="Blood type">{data.Character.bloodType}</TextRow>
              )}
              {!!data.Character.dateOfBirth.day &&
                !!data.Character.dateOfBirth.month &&
                (data.Character.dateOfBirth.year ? (
                  <TextRow label="Birthday">
                    {dayjs()
                      .date(data.Character.dateOfBirth.day)
                      .month(data.Character.dateOfBirth.month - 1)
                      .year(data.Character.dateOfBirth.year)
                      .format('LL')}
                  </TextRow>
                ) : (
                  <TextRow label="Birthday">
                    {dayjs()
                      .date(data.Character.dateOfBirth.day)
                      .month(data.Character.dateOfBirth.month - 1)
                      .format('LL')
                      .replace(/, .+/, '')}
                  </TextRow>
                ))}
            </View>
          )}
        </View>
        <RenderHTML
          baseStyle={baseStyle}
          contentWidth={width}
          source={{html: data?.Character.description || ''}}
        />
      </View>
    );
  };

  return (
    <FlatList
      data={data?.Character.media?.edges}
      ItemSeparatorComponent={() => <View className="h-3" />}
      ListEmptyComponent={() => {
        if (error) {
          const text = handleNetworkError(error);
          return <HelperText type="error">{text}</HelperText>;
        }

        return (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
          </View>
        );
      }}
      ListHeaderComponent={header}
      renderItem={renderMedia}
    />
  );
};

export default CharacterScreen;
