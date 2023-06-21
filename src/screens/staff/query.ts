import {gql} from '@apollo/client';

export const QUERY_INFO = gql`
  query StaffInfo($id: Int) {
    StaffInfo: Staff(id: $id) {
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
    }
  }
`;

export const QUERY_CHARACTERS = gql`
  query StaffCharacters($id: Int, $sort: [MediaSort], $characterPage: Int) {
    StaffCharacters: Staff(id: $id) {
      id
      characterMedia(page: $characterPage, sort: $sort) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
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
    }
  }
`;

export const QUERY_STAFF_MEDIA = gql`
  query StaffMedia($id: Int, $sort: [MediaSort], $staffPage: Int) {
    StaffMedia: Staff(id: $id) {
      id
      staffMedia(page: $staffPage, sort: $sort) {
        pageInfo {
          total
          perPage
          currentPage
          lastPage
          hasNextPage
        }
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
