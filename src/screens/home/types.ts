import {
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaType,
} from 'typings/globalTypes';

// ====================================================
// GraphQL query operation: AnimeList
// ====================================================

export interface AnimeList_Page_media_title {
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

export interface AnimeList_Page_media_coverImage {
  __typename: 'MediaCoverImage';
  /**
   * The cover image url of the media at medium size
   */
  medium: string | null;
  /**
   * The cover image url of the media at a large size
   */
  large: string | null;
  /**
   * Average #hex color of cover image
   */
  color: string | null;
}

export interface AnimeList_Page_media {
  __typename: 'Media';
  /**
   * The id of the media
   */
  id: number;
  /**
   * The amount of episodes the anime has when complete
   */
  episodes: number | null;
  /**
   * The official titles of the media in various languages
   */
  title: AnimeList_Page_media_title;
  /**
   * The cover images of the media
   */
  coverImage: AnimeList_Page_media_coverImage;
  /**
   * The genres of the media
   */
  genres: string[];
  /**
   * The format the media was released in
   */
  format: MediaFormat;
  /**
   * If the media is intended only for 18+ adult audiences
   */
  isAdult: boolean;
}

export interface AnimeList_Page {
  __typename: 'Page';
  media: AnimeList_Page_media[];
}

export interface AnimeList {
  Page: AnimeList_Page;
}

export interface AnimeListVariables {
  season?: MediaSeason | null;
  seasonYear?: number | null;
  sort?: (MediaSort | null)[] | null;
  page?: number | null;
  type?: MediaType | null;
  format?: (MediaFormat | null)[] | null;
}
