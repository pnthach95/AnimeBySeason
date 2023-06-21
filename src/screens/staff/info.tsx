import {useQuery} from '@apollo/client';
import TextRow from 'components/textrow';
import dayjs from 'dayjs';
import React, {useEffect} from 'react';
import {ScrollView, View, useWindowDimensions} from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  ActivityIndicator,
  HelperText,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import RenderHTML from 'react-native-render-html';
import {handleNetworkError} from 'utils';
import {QUERY_INFO} from './query';
import type {StaffInfo, StaffInfoVariables} from './types';

type Props = {
  id: number;
  image?: string | null;
  openGallery: (idx: number, images: string[]) => void;
  setTitle: (title: string) => void;
};

const StaffInfoScreen = ({id, image, openGallery, setTitle}: Props) => {
  const {colors} = useTheme();
  const {width} = useWindowDimensions();
  const baseStyle = {color: colors.onBackground, paddingTop: 12};
  const {data, loading, error} = useQuery<StaffInfo, StaffInfoVariables>(
    QUERY_INFO,
    {
      variables: {
        id,
      },
    },
  );

  useEffect(() => {
    if (data?.StaffInfo.name.full) {
      setTitle(data.StaffInfo.name.full);
    }
  }, [data?.StaffInfo.name.full]);

  if (error) {
    const text = handleNetworkError(error);
    return <HelperText type="error">{text}</HelperText>;
  }

  const onPressAvatar = () => {
    const img = image || data?.StaffInfo.image?.large;
    if (img) {
      openGallery(1, [img]);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View className="p-3">
        <View className="flex-row">
          <TouchableRipple
            borderless
            className="aspect-poster w-1/3"
            onPress={onPressAvatar}>
            <FastImage
              className="aspect-poster w-full"
              source={{uri: image || data?.StaffInfo.image?.large || ''}}
            />
          </TouchableRipple>
          {loading && (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" />
            </View>
          )}
          {data ? (
            <View className="ml-3 flex-1">
              <Text className="text-center" variant="titleSmall">
                {data.StaffInfo.name.native}
              </Text>
              {!!data.StaffInfo.age && (
                <TextRow label="Age">{data.StaffInfo.age}</TextRow>
              )}
              {!!data.StaffInfo.gender && (
                <TextRow label="Gender">{data.StaffInfo.gender}</TextRow>
              )}
              {!!data.StaffInfo.bloodType && (
                <TextRow label="Blood type">{data.StaffInfo.bloodType}</TextRow>
              )}
              {!!data.StaffInfo.dateOfBirth.day &&
                !!data.StaffInfo.dateOfBirth.month &&
                (data.StaffInfo.dateOfBirth.year ? (
                  <TextRow label="Birthday">
                    {dayjs()
                      .date(data.StaffInfo.dateOfBirth.day)
                      .month(data.StaffInfo.dateOfBirth.month - 1)
                      .year(data.StaffInfo.dateOfBirth.year)
                      .format('LL')}
                  </TextRow>
                ) : (
                  <TextRow label="Birthday">
                    {dayjs()
                      .date(data.StaffInfo.dateOfBirth.day)
                      .month(data.StaffInfo.dateOfBirth.month - 1)
                      .format('LL')
                      .replace(/, .+/, '')}
                  </TextRow>
                ))}
              {!!data.StaffInfo.dateOfDeath.day &&
                !!data.StaffInfo.dateOfDeath.month &&
                !!data.StaffInfo.dateOfDeath.year && (
                  <TextRow label="Birthday">
                    {dayjs()
                      .date(data.StaffInfo.dateOfDeath.day)
                      .month(data.StaffInfo.dateOfDeath.month - 1)
                      .year(data.StaffInfo.dateOfDeath.year)
                      .format('LL')}
                  </TextRow>
                )}
              {!!data.StaffInfo.homeTown && (
                <TextRow label="Home town">{data.StaffInfo.homeTown}</TextRow>
              )}
              {data.StaffInfo.yearsActive.length > 0 && (
                <TextRow label="Years active">
                  {data.StaffInfo.yearsActive.join(', ')}
                </TextRow>
              )}
              <Text className="text-right">
                {data.StaffInfo.primaryOccupations?.join('\n')}
              </Text>
            </View>
          ) : (
            <Text className="text-center">No data</Text>
          )}
        </View>
        {data && (
          <>
            <RenderHTML
              baseStyle={baseStyle}
              contentWidth={width}
              source={{html: data.StaffInfo.description || ''}}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default StaffInfoScreen;
