type TLanguage = 'en' | 'vi';

type StoreState = {
  bundleVersion: string;
  appTheme: 'dark' | 'light';
  appLanguage: TLanguage;
};

interface MediaTitle {
  __typename: 'MediaTitle';
  /**
   * The romanization of the native language title
   */
  romaji: string;
  /**
   * The official english title
   */
  english: string | null;
  /**
   * Official title in it's native language
   */
  native: string;
}

interface MediaCoverImage {
  __typename: 'MediaCoverImage';
  /**
   * The cover image url of the media at a large size
   */
  large: string | null;
  /**
   * The cover image url of the media at medium size
   */
  medium: string | null;
  /**
   * Average #hex color of cover image
   */
  color: string | null;
}
