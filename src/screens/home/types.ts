import {
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaType,
} from 'typings/globalTypes';

// ====================================================
// GraphQL query operation: AnimeList
// ====================================================

export interface AnimeList_Page_media {
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
  title: MediaTitle;
  /**
   * The cover images of the media
   */
  coverImage: MediaCoverImage;
  /**
   * The banner image of the media
   */
  bannerImage: string | null;
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
