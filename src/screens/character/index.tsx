import {useQuery} from '@apollo/client';
import Loading from 'components/loading';
import MediaItem from 'components/mediaitem';
import Separator from 'components/separator';
import TextRow from 'components/textrow';
import dayjs from 'dayjs';
import React, {useEffect} from 'react';
import {FlatList, View, useWindowDimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Surface, Text, TouchableRipple, useTheme} from 'react-native-paper';
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
  const {loading, data, error} = useQuery<QCharacter, TQuery>(QUERY, {
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
      navigation.push('Media', {item: item.node});
    };

    return (
      <Surface className="mx-3 rounded-xl pt-3">
        <Text className="px-3 pb-1" variant="labelMedium">
          {normalizeEnumName(item.characterRole)}
        </Text>
        <MediaItem item={item.node} onPress={onPress} />
        <View className="flex-row flex-wrap gap-3 p-3">
          {item.voiceActorRoles.map(va => {
            if (va.voiceActor) {
              const {voiceActor} = va;
              const onPressVA = () => {
                navigation.push('Staff', {
                  id: voiceActor.id,
                  image: voiceActor.image?.large || '',
                  name: voiceActor.name?.userPreferred || '',
                });
              };

              return (
                <Surface
                  key={`${voiceActor.__typename}_${voiceActor.id || 0}`}
                  className="rounded-xl"
                  elevation={3}>
                  <TouchableRipple
                    borderless
                    className="rounded-xl"
                    onPress={onPressVA}>
                    <View className="flex-row items-center space-x-1 p-1">
                      <FastImage
                        className="aspect-square w-10 rounded-full"
                        source={{uri: voiceActor.image?.large || ''}}
                      />
                      <View>
                        <Text>{voiceActor.name?.userPreferred}</Text>
                        {!!va.roleNotes && (
                          <Text variant="labelSmall">{va.roleNotes}</Text>
                        )}
                      </View>
                    </View>
                  </TouchableRipple>
                </Surface>
              );
            }
            return null;
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

  const listEmpty = () => {
    return <Loading errorText={handleNetworkError(error)} loading={loading} />;
  };

  return (
    <FlatList
      data={data?.Character.media?.edges}
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={listEmpty}
      ListHeaderComponent={header}
      renderItem={renderMedia}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default CharacterScreen;
