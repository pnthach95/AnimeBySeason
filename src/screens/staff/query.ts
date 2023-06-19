import {gql} from '@apollo/client';

export const QUERY = gql`
  query Staff($id: Int, $sort: [MediaSort], $onList: Boolean) {
    Staff(id: $id) {
      id
      name {
        full
        native
        userPreferred
        alternative
      }
      image {
        large
      }
      description(asHtml: true)
      age
      gender
      yearsActive
      homeTown
      bloodType
      primaryOccupations
      dateOfBirth {
        year
        month
        day
      }
      dateOfDeath {
        year
        month
        day
      }
      language: languageV2
      characterMedia(sort: $sort, onList: $onList) {
        edges {
          characterRole
          characterName
          node {
            id
            episodes
            format
            type
            bannerImage
            isAdult
            genres
            title {
              romaji
              english
              native
            }
            coverImage {
              medium
              large
              color
            }
            startDate {
              year
            }
            mediaListEntry {
              id
              status
            }
          }
          characters {
            id
            name {
              userPreferred
            }
            image {
              large
            }
          }
        }
      }
      staffMedia(sort: $sort, onList: $onList) {
        edges {
          staffRole
          node {
            id
            episodes
            genres
            format
            type
            isAdult
            title {
              romaji
              english
              native
            }
            bannerImage
            coverImage {
              medium
              large
              color
            }
            mediaListEntry {
              id
              status
            }
          }
        }
      }
    }
  }
`;
