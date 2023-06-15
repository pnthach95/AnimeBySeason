import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {Button, Modal, Portal, Text, useTheme} from 'react-native-paper';
import {setAppLanguage, useAppLanguage} from 'stores';
import AppStyles from 'utils/styles';

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

const LanguageModal = ({onDismiss, visible}: Props) => {
  const appLanguage = useAppLanguage();
  const {t} = useTranslation();
  const {colors} = useTheme();
  const bg = {
    backgroundColor: colors.background,
  };

  const onPressEnglish = () => {
    setAppLanguage('en');
    onDismiss();
  };
  const onPressVietnamese = () => {
    setAppLanguage('vi');
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        style={AppStyles.justifyEnd}
        visible={visible}
        onDismiss={onDismiss}>
        <View className="m-3 space-y-3 rounded-3xl p-3" style={bg}>
          <Text variant="titleLarge">{t('language')}</Text>
          <Button
            mode={appLanguage === 'en' ? 'contained' : 'outlined'}
            onPress={onPressEnglish}>
            {t('lang.en')}
          </Button>
          <Button
            mode={appLanguage === 'vi' ? 'contained' : 'outlined'}
            onPress={onPressVietnamese}>
            {t('lang.vi')}
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

export default LanguageModal;
