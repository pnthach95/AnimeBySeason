import {ApolloError} from '@apollo/client';
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

export const normalizeEnumName = (str: string | null) => {
  if (str) {
    if (str === 'ONA' || str === 'OVA' || str === 'TV') {
      return str;
    }
    return capitalizeFirstLetter(
      str.toLowerCase().replaceAll('_', ' ').replace('tv', 'TV'),
    );
  }
  return '';
};

export const handleNetworkError = (error?: ApolloError) => {
  if (error) {
    return (
      (
        error?.networkError as unknown as {
          result: {errors: {message: string}[]};
        }
      ).result as {
        errors: {message: string}[];
      }
    ).errors
      .map(e => e.message)
      .join(', ');
  }
  return undefined;
};
