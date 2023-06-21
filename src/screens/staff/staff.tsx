import {useQuery} from '@apollo/client';
import Loading from 'components/loading';
import MediaItem from 'components/mediaitem';
import Separator from 'components/separator';
import React, {useState} from 'react';
import {FlatList} from 'react-native';
import {Surface, Text} from 'react-native-paper';
import {type IMediaItem, MediaSort} from 'typings/globalTypes';
import {handleNetworkError} from 'utils';
import AppStyles from 'utils/styles';
import {QUERY_STAFF_MEDIA} from './query';
import type {
  StaffMedia,
  StaffMediaVariables,
  StaffMedia_Staff_staffMedia_edges,
} from './types';
import type {ListRenderItem} from 'react-native';

type Props = {
  id: number;
  goToMedia: (item: IMediaItem) => void;
};

const StaffMediaScreen = ({goToMedia, id}: Props) => {
  const [page, setPage] = useState(1);
  const {data, loading, error, fetchMore} = useQuery<
    StaffMedia,
    StaffMediaVariables
  >(QUERY_STAFF_MEDIA, {
    variables: {
      id,
      staffPage: page,
      sort: [MediaSort.START_DATE_DESC],
    },
  });

  const renderStaff: ListRenderItem<StaffMedia_Staff_staffMedia_edges> = ({
    item,
  }) => {
    const onPress = () => {
      goToMedia(item.node);
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

  const listEmpty = () => (
    <Loading errorText={handleNetworkError(error)} loading={loading} />
  );

  const onEndReached = async () => {
    if (data && !data.StaffMedia.staffMedia?.pageInfo.hasNextPage) {
      return;
    }
    await fetchMore({variables: {page: page + 1}});
    setPage(page + 1);
  };

  return (
    <FlatList
      contentContainerStyle={AppStyles.paddingVertical}
      data={data?.StaffMedia.staffMedia?.edges}
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={listEmpty}
      renderItem={renderStaff}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
    />
  );
};

export default StaffMediaScreen;
