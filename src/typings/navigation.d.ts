import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type {StackScreenProps} from '@react-navigation/stack';

type RootStackParamList = {
  Main: NavigatorScreenParams<MainTabParamList>;
  Anime: {
    item: {
      /**
       * The id of the media
       */
      id: number;
      /**
       * The official titles of the media in various languages
       */
      title: MediaTitle;
      /**
       * The cover images of the media
       */
      coverImage: MediaCoverImage;
      /**
       * The banner image of the media
       */
      bannerImage: string | null;
    };
  };
  Character: {
    id: number;
    image: string;
    name: string;
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
