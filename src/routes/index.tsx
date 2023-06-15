import 'locales';
import {ApolloProvider} from '@apollo/client';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {client} from 'api';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import BootSplash from 'react-native-bootsplash';
import ErrorBoundary from 'react-native-error-boundary';
import FlashMessage from 'react-native-flash-message';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ErrorBoundaryScreen from 'screens/errorboundary';
import {useAppColorScheme, useAppLanguage, useHydration} from 'stores';
import {appMaterialDark, appMaterialLight} from 'utils/themes';
import Routes from './routes';

dayjs.extend(localizedFormat);
dayjs.extend(duration);
dayjs.extend(customParseFormat);

const App = () => {
  const {i18n} = useTranslation(),
    hydrated = useHydration(),
    appLanguage = useAppLanguage(),
    appTheme = useAppColorScheme();

  useEffect(() => {
    if (i18n.isInitialized && hydrated) {
      i18n.changeLanguage(appLanguage);
      dayjs.locale(appLanguage);
      BootSplash.hide({fade: true, duration: 750});
    }
  }, [i18n.isInitialized, hydrated]);

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <PaperProvider
          theme={appTheme === 'dark' ? appMaterialDark : appMaterialLight}>
          <BottomSheetModalProvider>
            <ErrorBoundary FallbackComponent={ErrorBoundaryScreen}>
              <ApolloProvider client={client}>
                <Routes />
              </ApolloProvider>
              <FlashMessage position="top" />
            </ErrorBoundary>
          </BottomSheetModalProvider>
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
