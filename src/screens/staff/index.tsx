import {useQuery} from '@apollo/client';
import MediaItem from 'components/mediaitem';
import TextRow from 'components/textrow';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {FlatList, useWindowDimensions} from 'react-native';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  ActivityIndicator,
  HelperText,
  SegmentedButtons,
  Surface,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import RenderHTML from 'react-native-render-html';
import {MediaSort} from 'typings/globalTypes';
import {handleNetworkError, normalizeEnumName} from 'utils';
import {QUERY} from './query';
import {
  Staff,
  StaffVariables,
  Staff_Staff_characterMedia_edges,
  Staff_Staff_staffMedia_edges,
} from './types';
import type {ListRenderItem} from 'react-native';
import type {RootStackScreenProps} from 'typings/navigation';

const Separator = () => <View className="h-3" />;

const StaffScreen = ({navigation, route}: RootStackScreenProps<'Staff'>) => {
  const {colors} = useTheme();
  const {width} = useWindowDimensions();
  const baseStyle = {color: colors.onBackground, paddingTop: 12};
  const {data, loading, error} = useQuery<Staff, StaffVariables>(QUERY, {
    variables: {
      id: route.params.id,
      sort: [MediaSort.START_DATE_DESC],
    },
  });
  const [dataType, setDataType] = useState('character');

  useEffect(() => {
    navigation.setOptions({
      title: route.params.name,
    });
  }, []);

  useEffect(() => {
    if (data?.Staff.characterMedia?.edges.length === 0) {
      setDataType('staff');
    }
  }, [data?.Staff]);

  const renderCharacterMedia: ListRenderItem<
    Staff_Staff_characterMedia_edges
  > = ({item}) => {
    const onPress = () => {
      navigation.push('Media', {item: item.node});
    };

    const onPressCharacter = () =>
      navigation.push('Character', {
        id: item.characters[0].id,
        image: item.characters[0].image?.large || '',
        name: item.characters[0].name?.userPreferred || '',
      });

    return (
      <Surface className="mx-3 rounded-xl p-3">
        <Text className="pb-1" variant="labelMedium">
          {normalizeEnumName(item.characterRole)}
        </Text>
        <View className="flex-row space-x-1">
          <TouchableRipple className="max-w-[130px]" onPress={onPressCharacter}>
            <View className="items-center space-x-1 rounded-xl">
              <FastImage
                className="aspect-poster w-24"
                source={{uri: item.characters[0].image?.large || ''}}
              />
              <Text className="text-center">
                {item.characters[0].name?.userPreferred}
              </Text>
            </View>
          </TouchableRipple>
          <TouchableRipple
            borderless
            className="flex-1 self-start pr-3"
            onPress={onPress}>
            <View className="flex-row space-x-3">
              <FastImage
                className="aspect-poster w-16"
                source={{uri: item.node.coverImage.medium || ''}}
              />
              <View className="flex-1">
                <Text numberOfLines={3}>{item.node.title.romaji}</Text>
                {!!item.node.title.english && (
                  <Text numberOfLines={2} variant="bodySmall">
                    {item.node.title.english}
                  </Text>
                )}
                <Text variant="labelSmall">{item.node.startDate?.year}</Text>
              </View>
            </View>
          </TouchableRipple>
        </View>
      </Surface>
    );
  };

  const renderStaff: ListRenderItem<Staff_Staff_staffMedia_edges> = ({
    item,
  }) => {
    const onPress = () => {
      navigation.push('Media', {item: item.node});
    };

    return (
      <Surface className="mx-3 rounded-xl py-3">
        <Text className="px-3 pb-1" variant="labelMedium">
          {item.staffRole}
        </Text>
        <MediaItem item={item.node} onPress={onPress} />
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
                {data.Staff.name.native}
              </Text>
              <TextRow label="Age">{data.Staff.age}</TextRow>
              <TextRow label="Gender">{data.Staff.gender}</TextRow>
              {!!data.Staff.bloodType && (
                <TextRow label="Blood type">{data.Staff.bloodType}</TextRow>
              )}
              {!!data.Staff.dateOfBirth.day &&
                !!data.Staff.dateOfBirth.month &&
                (data.Staff.dateOfBirth.year ? (
                  <TextRow label="Birthday">
                    {dayjs()
                      .date(data.Staff.dateOfBirth.day)
                      .month(data.Staff.dateOfBirth.month - 1)
                      .year(data.Staff.dateOfBirth.year)
                      .format('LL')}
                  </TextRow>
                ) : (
                  <TextRow label="Birthday">
                    {dayjs()
                      .date(data.Staff.dateOfBirth.day)
                      .month(data.Staff.dateOfBirth.month - 1)
                      .format('LL')
                      .replace(/, .+/, '')}
                  </TextRow>
                ))}
              {!!data.Staff.dateOfDeath.day &&
                !!data.Staff.dateOfDeath.month &&
                !!data.Staff.dateOfDeath.year && (
                  <TextRow label="Birthday">
                    {dayjs()
                      .date(data.Staff.dateOfDeath.day)
                      .month(data.Staff.dateOfDeath.month - 1)
                      .year(data.Staff.dateOfDeath.year)
                      .format('LL')}
                  </TextRow>
                )}
              {!!data.Staff.homeTown && (
                <TextRow label="Home town">{data.Staff.homeTown}</TextRow>
              )}
              {data.Staff.yearsActive.length > 0 && (
                <TextRow label="Years active">
                  {data.Staff.yearsActive.join(', ')}
                </TextRow>
              )}
              <Text className="text-right">
                {data.Staff.primaryOccupations?.join('\n')}
              </Text>
            </View>
          )}
        </View>
        {data && (
          <>
            <RenderHTML
              baseStyle={baseStyle}
              contentWidth={width}
              source={{html: data.Staff.description || ''}}
            />
            {data.Staff.characterMedia.edges.length > 0 && (
              <SegmentedButtons
                buttons={[
                  {value: 'character', label: 'Character'},
                  {value: 'staff', label: 'Staff'},
                ]}
                value={dataType}
                onValueChange={setDataType}
              />
            )}
          </>
        )}
      </View>
    );
  };

  const listEmpty = () => {
    if (error) {
      const text = handleNetworkError(error);
      return <HelperText type="error">{text}</HelperText>;
    }
    if (loading) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return <Text className="text-center">No data</Text>;
  };

  return (
    // @ts-ignore
    <FlatList
      data={
        dataType === 'character'
          ? data?.Staff?.characterMedia?.edges
          : data?.Staff.staffMedia?.edges
      }
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={listEmpty}
      ListHeaderComponent={header}
      renderItem={dataType === 'character' ? renderCharacterMedia : renderStaff}
    />
  );
};

export default StaffScreen;
