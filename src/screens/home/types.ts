import {IMediaItem} from 'typings/globalTypes';

// ====================================================
// GraphQL query operation: AnimeList
// ====================================================

export interface AnimeList_Page {
  media: IMediaItem[];
}

export interface AnimeList {
  Page: AnimeList_Page;
}
