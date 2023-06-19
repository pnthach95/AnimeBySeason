import {CharacterRole, IMediaItem} from 'typings/globalTypes';

// ====================================================
// GraphQL query operation: Character
// ====================================================

export interface Character_Character_name {
  /**
   * The character's first and last name
   */
  full: string;
  /**
   * The character's full name in their native language
   */
  native: string;
}

export interface QImage {
  /**
   * The character's image of media at its largest size
   */
  large: string | null;
}

export interface Character_Character_media_edges_voiceActorRoles_voiceActor_name {
  __typename: 'StaffName';
  /**
   * The currently authenticated users preferred name language. Default romaji for non-authenticated
   */
  userPreferred: string | null;
}

export interface Character_Character_media_edges_voiceActorRoles_voiceActor {
  __typename: 'Staff';
  /**
   * The id of the staff member
   */
  id: number;
  /**
   * The names of the staff member
   */
  name: Character_Character_media_edges_voiceActorRoles_voiceActor_name | null;
  /**
   * The staff images
   */
  image: QImage | null;
}

export interface Character_Character_media_edges_voiceActorRoles {
  __typename: 'StaffRoleType';
  /**
   * Notes regarding the VA's role for the character
   */
  roleNotes: string | null;
  /**
   * The voice actors of the character
   */
  voiceActor: Character_Character_media_edges_voiceActorRoles_voiceActor | null;
}

export interface Character_Character_media_edges {
  /**
   * The id of the connection
   */
  id: number;
  /**
   * The characters role in the media
   */
  characterRole: CharacterRole;
  /**
   * The voice actors of the character with role date
   */
  voiceActorRoles: Character_Character_media_edges_voiceActorRoles[];
  node: IMediaItem;
}

export interface Character_Character_media {
  edges: Character_Character_media_edges[] | null;
}

export interface Character_Character {
  /**
   * The id of the character
   */
  id: number;
  /**
   * The names of the character
   */
  name: Character_Character_name;
  /**
   * Character images
   */
  image: QImage | null;
  /**
   * A general description of the character
   */
  description: string | null;
  /**
   * The character's age. Note this is a string, not an int, it may contain further text and additional ages.
   */
  age: string | null;
  /**
   * The character's gender. Usually Male, Female, or Non-binary but can be any string.
   */
  gender: string | null;
  /**
   * The characters blood type
   */
  bloodType: string | null;
  /**
   * The character's birth date
   */
  dateOfBirth: FuzzyDate;
  /**
   * Media that includes the character
   */
  media: Character_Character_media | null;
}

export interface QCharacter {
  /**
   * Character query
   */
  Character: Character_Character;
}
