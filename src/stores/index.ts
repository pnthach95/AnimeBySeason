import dayjs from 'dayjs';
import {produce} from 'immer';
import i18n from 'locales';
import {useEffect, useState} from 'react';
import {Appearance} from 'react-native';
import {MMKVLoader} from 'react-native-mmkv-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import type {StateStorage} from 'zustand/middleware';

const storage = new MMKVLoader()
  // TODO: đổi id tùy ý
  .withInstanceID('Zuuist97sbs')
  .withEncryption()
  .initialize();

const useAppStore = create<StoreState>()(
  persist(
    _ => ({
      bundleVersion: '0',
      appTheme: Appearance.getColorScheme() || 'light',
      appLanguage: 'vi',
    }),
    {
      // TODO: đổi tên tùy ý
      name: 'AnimeBySeason',
      version: 1,
      storage: createJSONStorage(() => storage as unknown as StateStorage),
      partialize: state =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !['bundleVersion'].includes(key),
          ),
        ),
    },
  ),
);

export const useAppColorScheme = () => useAppStore(s => s.appTheme);
export const useBundleVersion = () => useAppStore(s => s.bundleVersion);
export const useAppLanguage = () => useAppStore(s => s.appLanguage);

export const setBundleVersion = (bundleVersion: string) => {
  useAppStore.setState({bundleVersion});
};

export const setAppLanguage = (appLanguage: TLanguage) => {
  useAppStore.setState({appLanguage});
  i18n.changeLanguage(appLanguage);
  dayjs.locale(appLanguage);
};

export const onSwitchTheme = () => {
  useAppStore.setState(
    produce<StoreState>(draft => {
      draft.appTheme = draft.appTheme === 'dark' ? 'light' : 'dark';
    }),
  );
};

export const useHydration = () => {
  const [hydrated, setHydrated] = useState(useAppStore.persist.hasHydrated);

  useEffect(() => {
    const unsubHydrate = useAppStore.persist.onHydrate(() =>
      setHydrated(false),
    );
    const unsubFinishHydration = useAppStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    setHydrated(useAppStore.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
};
