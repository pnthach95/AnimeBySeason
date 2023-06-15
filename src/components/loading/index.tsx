import React from 'react';
import {View} from 'react-native';
import {ActivityIndicator, HelperText, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  errorText: string;
};

const Loading = ({errorText}: Props) => {
  const {colors} = useTheme();
  return (
    <View className="flex-1 items-center justify-center">
      {errorText.length > 0 ? (
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
        <ActivityIndicator size="large" />
      )}
    </View>
  );
};

export default Loading;
