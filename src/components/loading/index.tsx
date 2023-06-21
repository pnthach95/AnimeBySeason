import React from 'react';
import {View} from 'react-native';
import {
  ActivityIndicator,
  HelperText,
  Text,
  useTheme,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  loading: boolean;
  emptyText?: string;
  errorText?: string;
};

const Loading = ({errorText, emptyText = 'No data', loading}: Props) => {
  const {colors} = useTheme();

  return (
    <View className="flex-1 items-center justify-center p-3">
      {loading ? (
        <ActivityIndicator size="large" />
      ) : errorText && errorText.length > 0 ? (
        <>
          <Icon
            color={colors.error}
            name="rocket-launch"
            size={50}
            style={{transform: [{rotate: '90deg'}]}}
          />
          <HelperText className="text-lg" type="error">
            {errorText}
          </HelperText>
        </>
      ) : (
        <Text className="text-center">{emptyText}</Text>
      )}
    </View>
  );
};

export default Loading;
