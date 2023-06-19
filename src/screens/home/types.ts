import {
  IMediaItem,
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaType,
} from 'typings/globalTypes';

// ====================================================
// GraphQL query operation: AnimeList
// ====================================================

export interface AnimeList_Page {
  media: IMediaItem[];
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
