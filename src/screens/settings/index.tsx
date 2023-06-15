import LanguageModal from 'components/lauguagemodal';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {Text, TouchableRipple} from 'react-native-paper';
import {onSwitchTheme, useAppColorScheme, useAppLanguage} from 'stores';

const SettingsScreen = () => {
  const {t} = useTranslation();
  const appTheme = useAppColorScheme();
  const appLanguage = useAppLanguage();
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const showLanguageModal = () => setLanguageModalVisible(true);
  const hideLanguageModal = () => setLanguageModalVisible(false);

  return (
    <View>
      <TouchableRipple onPress={onSwitchTheme}>
        <View className="flex-row justify-between p-3">
          <Text>{t('theme')}</Text>
          <Text>{t(appTheme)}</Text>
        </View>
      </TouchableRipple>
      <TouchableRipple onPress={showLanguageModal}>
        <View className="flex-row justify-between p-3">
          <Text>{t('language')}</Text>
          <Text>{t(`lang.${appLanguage}`)}</Text>
        </View>
      </TouchableRipple>
      <LanguageModal
        visible={languageModalVisible}
        onDismiss={hideLanguageModal}
      />
    </View>
  );
};

export default SettingsScreen;
