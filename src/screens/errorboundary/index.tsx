import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
// import CodePush from 'react-native-code-push';
import {Button, Text, useTheme} from 'react-native-paper';
import RNRestart from 'react-native-restart';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type {ErrorBoundaryProps} from 'react-native-error-boundary';

const ErrorBoundaryScreen: ErrorBoundaryProps['FallbackComponent'] = ({
  error,
}) => {
  const {colors} = useTheme(),
    {t} = useTranslation();

  const restart = () => {
    // Dùng cái này nếu có codepush
    // CodePush.restartApp();
    RNRestart.restart();
  };

  return (
    <View
      className="flex-1 items-center justify-center space-y-3 p-3"
      style={{backgroundColor: colors.background}}>
      <Icon color={colors.error} name="error" size={100} />
      <Text className="text-center text-lg font-bold">
        {t('unexpected-error')}
      </Text>
      <Text>{error.toString()}</Text>
      <Button mode="contained" onPress={restart}>
        {t('reopen-app')}
      </Button>
    </View>
  );
};

export default ErrorBoundaryScreen;
