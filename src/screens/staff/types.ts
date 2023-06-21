import {
  CharacterRole,
  IMediaItem,
  MediaListStatus,
  MediaSort,
  MediaType,
} from 'typings/globalTypes';

// ====================================================
// GraphQL query operation: StaffCharacters
// ====================================================

export interface StaffCharacters_Staff_characterMedia_edges_node_startDate {
  __typename: 'FuzzyDate';
  /**
   * Numeric Year (2017)
   */
  year: number | null;
}

export interface MediaListEntry {
  __typename: 'MediaList';
  /**
   * The id of the list entry
   */
  id: number;
  /**
   * The watching/reading status
   */
  status: MediaListStatus | null;
}

export interface StaffCharacters_Staff_characterMedia_edges_node
  extends IMediaItem {
  /**
   * The type of the media; anime or manga
   */
  type: MediaType | null;
  /**
   * The first official release date of the media
   */
  startDate: StaffCharacters_Staff_characterMedia_edges_node_startDate | null;
  /**
   * The authenticated user's media list entry for the media
   */
  mediaListEntry: MediaListEntry | null;
}

export interface StaffCharacters_Staff_characterMedia_edges_characters_name {
  __typename: 'CharacterName';
  /**
   * The currently authenticated users preferred name language. Default romaji for non-authenticated
   */
  userPreferred: string | null;
}

export interface StaffCharacters_Staff_characterMedia_edges_characters {
  __typename: 'Character';
  /**
   * The id of the character
   */
  id: number;
  /**
   * The names of the character
   */
  name: StaffCharacters_Staff_characterMedia_edges_characters_name | null;
  /**
   * Character images
   */
  image: MediaCoverImage | null;
}

export interface StaffCharacters_Staff_characterMedia_edges {
  __typename: 'MediaEdge';
  /**
   * The characters role in the media
   */
  characterRole: CharacterRole | null;
  /**
   * Media specific character name
   */
  characterName: string | null;
  node: StaffCharacters_Staff_characterMedia_edges_node;
  /**
   * The characters in the media voiced by the parent actor
   */
  characters: StaffCharacters_Staff_characterMedia_edges_characters[];
}

export interface StaffCharacters_Staff_characterMedia {
  __typename: 'MediaConnection';
  pageInfo: PageInfo;
  edges: StaffCharacters_Staff_characterMedia_edges[];
}

export interface StaffCharacters_Staff {
  __typename: 'Staff';
  /**
   * The id of the staff member
   */
  id: number;
  /**
   * Media the actor voiced characters in. (Same data as characters with media as node instead of characters)
   */
  characterMedia: StaffCharacters_Staff_characterMedia | null;
}

export interface StaffCharacters {
  /**
   * Staff query
   */
  StaffCharacters: StaffCharacters_Staff;
}

export interface StaffCharactersVariables {
  id: number;
  sort: MediaSort[];
  characterPage: number;
}

// ====================================================
// GraphQL query operation: StaffInfo
// ====================================================

export interface StaffInfo_Staff_name {
  __typename: 'StaffName';
  /**
   * The person's first and last name
   */
  full: string | null;
  /**
   * The person's full name in their native language
   */
  native: string | null;
  /**
   * The currently authenticated users preferred name language. Default romaji for non-authenticated
   */
  userPreferred: string | null;
  /**
   * Other names the staff member might be referred to as (pen names)
   */
  alternative: string[] | null;
}

export interface StaffInfo_Staff {
  __typename: 'Staff';
  /**
   * The id of the staff member
   */
  id: number;
  /**
   * The names of the staff member
   */
  name: StaffInfo_Staff_name;
  /**
   * The staff images
   */
  image: MediaCoverImage | null;
  /**
   * A general description of the staff member
   */
  description: string | null;
  /**
   * The person's age in years
   */
  age: number | null;
  /**
   * The staff's gender. Usually Male, Female, or Non-binary but can be any string.
   */
  gender: string | null;
  /**
   * [startYear, endYear] (If the 2nd value is not present staff is still active)
   */
  yearsActive: number[];
  /**
   * The persons birthplace or hometown
   */
  homeTown: string | null;
  /**
   * The persons blood type
   */
  bloodType: string | null;
  /**
   * The person's primary occupations
   */
  primaryOccupations: string[] | null;
  dateOfBirth: FuzzyDate;
  dateOfDeath: FuzzyDate;
  /**
   * The primary language of the staff member. Current values: Japanese, English, Korean, Italian, Spanish, Portuguese, French, German, Hebrew, Hungarian, Chinese, Arabic, Filipino, Catalan, Finnish, Turkish, Dutch, Swedish, Thai, Tagalog, Malaysian, Indonesian, Vietnamese, Nepali, Hindi, Urdu
   */
  language: string | null;
}

export interface StaffInfo {
  /**
   * Staff query
   */
  StaffInfo: StaffInfo_Staff;
}

export interface StaffInfoVariables {
  id: number;
}

// ====================================================
// GraphQL query operation: StaffMedia
// ====================================================

export interface StaffMedia_Staff_staffMedia_edges_node extends IMediaItem {
  /**
   * The type of the media; anime or manga
   */
  type: MediaType | null;
  mediaListEntry: MediaListEntry | null;
}

export interface StaffMedia_Staff_staffMedia_edges {
  __typename: 'MediaEdge';
  /**
   * The role of the staff member in the production of the media
   */
  staffRole: string | null;
  node: StaffMedia_Staff_staffMedia_edges_node;
}

export interface StaffMedia_Staff_staffMedia {
  __typename: 'MediaConnection';
  pageInfo: PageInfo;
  edges: StaffMedia_Staff_staffMedia_edges[];
}

export interface StaffMedia_Staff {
  __typename: 'Staff';
  /**
   * The id of the staff member
   */
  id: number;
  /**
   * Media where the staff member has a production role
   */
  staffMedia: StaffMedia_Staff_staffMedia | null;
}

export interface StaffMedia {
  /**
   * Staff query
   */
  StaffMedia: StaffMedia_Staff;
}

export interface StaffMediaVariables {
  id: number;
  sort: MediaSort[];
  staffPage: number;
}
