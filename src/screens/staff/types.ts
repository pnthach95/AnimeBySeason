import {
  CharacterRole,
  IMediaItem,
  MediaListStatus,
  MediaSort,
  MediaType,
} from 'typings/globalTypes';

// ====================================================
// GraphQL query operation: Staff
// ====================================================

export interface Staff_Staff_name {
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

export interface Staff_Staff_image {
  __typename: 'StaffImage';
  /**
   * The person's image of media at its largest size
   */
  large: string | null;
}

export interface Staff_Staff_characterMedia_edges_node_title {
  __typename: 'MediaTitle';
  /**
   * The currently authenticated users preferred title language. Default romaji for non-authenticated
   */
  userPreferred: string | null;
}

export interface Staff_Staff_characterMedia_edges_node_startDate {
  __typename: 'FuzzyDate';
  /**
   * Numeric Year (2017)
   */
  year: number | null;
}

export interface Staff_Staff_characterMedia_edges_node_mediaListEntry {
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

export interface Staff_Staff_characterMedia_edges_node extends IMediaItem {
  /**
   * The type of the media; anime or manga
   */
  type: MediaType | null;
  /**
   * The first official release date of the media
   */
  startDate: Staff_Staff_characterMedia_edges_node_startDate | null;
  /**
   * The authenticated user's media list entry for the media
   */
  mediaListEntry: Staff_Staff_characterMedia_edges_node_mediaListEntry | null;
}

export interface Staff_Staff_characterMedia_edges_characters_name {
  __typename: 'CharacterName';
  /**
   * The currently authenticated users preferred name language. Default romaji for non-authenticated
   */
  userPreferred: string | null;
}

export interface Staff_Staff_characterMedia_edges_characters_image {
  __typename: 'CharacterImage';
  /**
   * The character's image of media at its largest size
   */
  large: string | null;
}

export interface Staff_Staff_characterMedia_edges_characters {
  __typename: 'Character';
  /**
   * The id of the character
   */
  id: number;
  /**
   * The names of the character
   */
  name: Staff_Staff_characterMedia_edges_characters_name | null;
  /**
   * Character images
   */
  image: Staff_Staff_characterMedia_edges_characters_image | null;
}

export interface Staff_Staff_characterMedia_edges {
  __typename: 'MediaEdge';
  /**
   * The characters role in the media
   */
  characterRole: CharacterRole | null;
  /**
   * Media specific character name
   */
  characterName: string | null;
  node: Staff_Staff_characterMedia_edges_node;
  /**
   * The characters in the media voiced by the parent actor
   */
  characters: Staff_Staff_characterMedia_edges_characters[];
}

export interface Staff_Staff_characterMedia {
  __typename: 'MediaConnection';
  edges: Staff_Staff_characterMedia_edges[];
}

export interface Staff_Staff_staffMedia_edges_node_title {
  __typename: 'MediaTitle';
  /**
   * The currently authenticated users preferred title language. Default romaji for non-authenticated
   */
  userPreferred: string | null;
}

export interface Staff_Staff_staffMedia_edges_node_coverImage {
  __typename: 'MediaCoverImage';
  /**
   * The cover image url of the media at a large size
   */
  large: string | null;
}

export interface Staff_Staff_staffMedia_edges_node_mediaListEntry {
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

export interface Staff_Staff_staffMedia_edges_node extends IMediaItem {
  /**
   * The type of the media; anime or manga
   */
  type: MediaType | null;
  /**
   * The authenticated user's media list entry for the media
   */
  mediaListEntry: Staff_Staff_staffMedia_edges_node_mediaListEntry | null;
}

export interface Staff_Staff_staffMedia_edges {
  __typename: 'MediaEdge';
  /**
   * The role of the staff member in the production of the media
   */
  staffRole: string;
  node: Staff_Staff_staffMedia_edges_node;
}

export interface Staff_Staff_staffMedia {
  __typename: 'MediaConnection';
  edges: Staff_Staff_staffMedia_edges[];
}

export interface Staff_Staff {
  __typename: 'Staff';
  /**
   * The id of the staff member
   */
  id: number;
  /**
   * The names of the staff member
   */
  name: Staff_Staff_name;
  /**
   * The staff images
   */
  image: Staff_Staff_image;
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
  /**
   * Media the actor voiced characters in. (Same data as characters with media as node instead of characters)
   */
  characterMedia: Staff_Staff_characterMedia;
  /**
   * Media where the staff member has a production role
   */
  staffMedia: Staff_Staff_staffMedia;
}

export interface Staff {
  /**
   * Staff query
   */
  Staff: Staff_Staff;
}

export interface StaffVariables {
  id: number;
  sort?: MediaSort[] | null;
  onList?: boolean | null;
  type?: MediaType | null;
}
