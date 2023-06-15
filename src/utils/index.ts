import {Linking} from 'react-native';
import {showMessage} from 'react-native-flash-message';

export const DATE_FORMAT = {
  SERVER: {
    FULL: 'YYYY-MM-DD HH:mm:ss',
    DATE: 'YYYY-MM-DD',
  },
  CLIENT: {
    FULL: 'HH:mm DD/MM/YYYY',
    DATE: 'DD/MM/YYYY',
  },
};

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const openLink = (link?: string) => {
  try {
    link && Linking.openURL(link);
  } catch (error) {
    if (error instanceof Error) {
      showMessage({message: error.message, type: 'warning'});
    }
  }
};
