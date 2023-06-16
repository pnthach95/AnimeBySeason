//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * The role the character plays in the media
 */
export enum CharacterRole {
  BACKGROUND = 'BACKGROUND',
  MAIN = 'MAIN',
  SUPPORTING = 'SUPPORTING',
}

/**
 * The format the media was released in
 */
export enum MediaFormat {
  MANGA = 'MANGA',
  MOVIE = 'MOVIE',
  MUSIC = 'MUSIC',
  NOVEL = 'NOVEL',
  ONA = 'ONA',
  ONE_SHOT = 'ONE_SHOT',
  OVA = 'OVA',
  SPECIAL = 'SPECIAL',
  TV = 'TV',
  TV_SHORT = 'TV_SHORT',
}

export enum MediaSeason {
  FALL = 'FALL',
  SPRING = 'SPRING',
  SUMMER = 'SUMMER',
  WINTER = 'WINTER',
}

/**
 * Media sort enums
 */
export enum MediaSort {
  CHAPTERS = 'CHAPTERS',
  CHAPTERS_DESC = 'CHAPTERS_DESC',
  DURATION = 'DURATION',
  DURATION_DESC = 'DURATION_DESC',
  END_DATE = 'END_DATE',
  END_DATE_DESC = 'END_DATE_DESC',
  EPISODES = 'EPISODES',
  EPISODES_DESC = 'EPISODES_DESC',
  FAVOURITES = 'FAVOURITES',
  FAVOURITES_DESC = 'FAVOURITES_DESC',
  FORMAT = 'FORMAT',
  FORMAT_DESC = 'FORMAT_DESC',
  ID = 'ID',
  ID_DESC = 'ID_DESC',
  POPULARITY = 'POPULARITY',
  POPULARITY_DESC = 'POPULARITY_DESC',
  SCORE = 'SCORE',
  SCORE_DESC = 'SCORE_DESC',
  SEARCH_MATCH = 'SEARCH_MATCH',
  START_DATE = 'START_DATE',
  START_DATE_DESC = 'START_DATE_DESC',
  STATUS = 'STATUS',
  STATUS_DESC = 'STATUS_DESC',
  TITLE_ENGLISH = 'TITLE_ENGLISH',
  TITLE_ENGLISH_DESC = 'TITLE_ENGLISH_DESC',
  TITLE_NATIVE = 'TITLE_NATIVE',
  TITLE_NATIVE_DESC = 'TITLE_NATIVE_DESC',
  TITLE_ROMAJI = 'TITLE_ROMAJI',
  TITLE_ROMAJI_DESC = 'TITLE_ROMAJI_DESC',
  TRENDING = 'TRENDING',
  TRENDING_DESC = 'TRENDING_DESC',
  TYPE = 'TYPE',
  TYPE_DESC = 'TYPE_DESC',
  UPDATED_AT = 'UPDATED_AT',
  UPDATED_AT_DESC = 'UPDATED_AT_DESC',
  VOLUMES = 'VOLUMES',
  VOLUMES_DESC = 'VOLUMES_DESC',
}

/**
 * Source type the media was adapted from
 */
export enum MediaSource {
  ANIME = 'ANIME',
  COMIC = 'COMIC',
  DOUJINSHI = 'DOUJINSHI',
  GAME = 'GAME',
  LIGHT_NOVEL = 'LIGHT_NOVEL',
  LIVE_ACTION = 'LIVE_ACTION',
  MANGA = 'MANGA',
  MULTIMEDIA_PROJECT = 'MULTIMEDIA_PROJECT',
  NOVEL = 'NOVEL',
  ORIGINAL = 'ORIGINAL',
  OTHER = 'OTHER',
  PICTURE_BOOK = 'PICTURE_BOOK',
  VIDEO_GAME = 'VIDEO_GAME',
  VISUAL_NOVEL = 'VISUAL_NOVEL',
  WEB_NOVEL = 'WEB_NOVEL',
}

/**
 * The current releasing status of the media
 */
export enum MediaStatus {
  CANCELLED = 'CANCELLED',
  FINISHED = 'FINISHED',
  HIATUS = 'HIATUS',
  NOT_YET_RELEASED = 'NOT_YET_RELEASED',
  RELEASING = 'RELEASING',
}

/**
 * Media type enum, anime or manga.
 */
export enum MediaType {
  ANIME = 'ANIME',
  MANGA = 'MANGA',
}

//==============================================================
// END Enums and Input Objects
//==============================================================
