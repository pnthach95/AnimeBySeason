import {IMediaItem} from 'typings/globalTypes';

// ====================================================
// GraphQL query operation: AnimeList
// ====================================================

export interface AnimeList_Page {
  pageInfo: PageInfo;
  media: IMediaItem[];
}

export interface AnimeList {
  Page: AnimeList_Page;
}
