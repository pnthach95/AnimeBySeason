import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type {StackScreenProps} from '@react-navigation/stack';
import type {AnimeList_Page_media} from 'screens/home/types';

type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  Anime: {
    item: AnimeList_Page_media;
  };
  Gallery: {
    idx: number;
    images: string[];
  };
};

type MainTabParamList = {
  Home: undefined;
  Settings: undefined;
};

type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
