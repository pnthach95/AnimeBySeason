import {IMediaItem} from 'typings/globalTypes';

// ====================================================
// GraphQL query operation: AnimeList
// ====================================================

export interface SearchList_Page {
  pageInfo: PageInfo;
  media: IMediaItem[];
}

export interface SearchList {
  SearchResult: SearchList_Page;
}
