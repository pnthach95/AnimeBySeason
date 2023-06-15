import {MediaFormat, MediaSource, MediaStatus} from 'typings/globalTypes';

// ====================================================
// GraphQL query operation: Anime
// ====================================================

export interface Anime_Media_Date {
  __typename: 'FuzzyDate';
  /**
   * Numeric Year (2017)
   */
  year: number | null;
  /**
   * Numeric Month (3)
   */
  month: number | null;
  /**
   * Numeric Day (24)
   */
  day: number | null;
}

export interface Anime_Media_tags {
  __typename: 'MediaTag';
  /**
   * The id of the tag
   */
  id: number;
  /**
   * The name of the tag
   */
  name: string;
}

export interface Anime_Media_characters_nodes_name {
  __typename: 'CharacterName';
  /**
   * The character's first and last name
   */
  full: string | null;
  /**
   * The character's full name in their native language
   */
  native: string | null;
  /**
   * The currently authenticated users preferred name language. Default romaji for non-authenticated
   */
  userPreferred: string | null;
}

export interface Anime_Media_characters_nodes_image {
  __typename: 'CharacterImage';
  /**
   * The character's image of media at its largest size
   */
  large: string | null;
}

export interface Anime_Media_characters_nodes {
  __typename: 'Character';
  /**
   * The id of the character
   */
  id: number;
  /**
   * The names of the character
   */
  name: Anime_Media_characters_nodes_name;
  /**
   * Character images
   */
  image: Anime_Media_characters_nodes_image;
}

export interface Anime_Media_characters {
  __typename: 'CharacterConnection';
  nodes: Anime_Media_characters_nodes[] | null;
}

export interface Anime_Media_staff_nodes_name {
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
}

export interface Anime_Media_staff_nodes_image {
  __typename: 'StaffImage';
  /**
   * The person's image of media at its largest size
   */
  large: string | null;
}

export interface Anime_Media_staff_nodes {
  __typename: 'Staff';
  /**
   * The id of the staff member
   */
  id: number;
  /**
   * The names of the staff member
   */
  name: Anime_Media_staff_nodes_name;
  /**
   * The staff images
   */
  image: Anime_Media_staff_nodes_image;
  /**
   * The person's primary occupations
   */
  primaryOccupations: string[] | null;
}

export interface Anime_Media_staff {
  __typename: 'StaffConnection';
  nodes: Anime_Media_staff_nodes[] | null;
}

export interface Anime_Media_studios_nodes {
  __typename: 'Studio';
  /**
   * The id of the studio
   */
  id: number;
  /**
   * The name of the studio
   */
  name: string;
}

export interface Anime_Media_studios {
  __typename: 'StudioConnection';
  nodes: Anime_Media_studios_nodes[] | null;
}

export interface Anime_Media {
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
  title: MediaTitle;
  /**
   * The format the media was released in
   */
  format: MediaFormat | null;
  /**
   * The current releasing status of the media
   */
  status: MediaStatus;
  /**
   * Short description of the media's story and characters
   */
  description: string;
  /**
   * The first official release date of the media
   */
  startDate: Anime_Media_Date | null;
  /**
   * The last official release date of the media
   */
  endDate: Anime_Media_Date | null;
  /**
   * The general length of each anime episode in minutes
   */
  duration: number | null;
  /**
   * Source type the media was adapted from.
   */
  source: MediaSource;
  /**
   * List of tags that describes elements and themes of the media
   */
  tags: Anime_Media_tags[];
  /**
   * The characters in the media
   */
  characters: Anime_Media_characters;
  /**
   * The staff who produced the media
   */
  staff: Anime_Media_staff;
  /**
   * The companies who produced the media
   */
  studios: Anime_Media_studios;
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
   * If the media is intended only for 18+ adult audiences
   */
  isAdult: boolean;
}

export interface Anime {
  /**
   * Media query
   */
  Media: Anime_Media;
}

export interface AnimeVariables {
  id: number;
}