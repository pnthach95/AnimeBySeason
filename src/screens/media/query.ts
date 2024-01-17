import {gql} from '@apollo/client';

export const QUERY = gql`
  query Anime($id: Int) {
    Media(id: $id) {
      id
      episodes
      title {
        romaji
        english
        native
      }
      format
      status(version: 2)
      description(asHtml: false)
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      duration
      source(version: 3)
      tags {
        id
        name
        description
        rank
      }
      characters(sort: [ROLE, RELEVANCE, ID]) {
        edges {
          id
          role
          name
          voiceActors(language: JAPANESE, sort: [RELEVANCE, ID]) {
            id
            name {
              full
              native
              userPreferred
            }
            language: languageV2
            image {
              large
            }
          }
          node {
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
      staff(sort: [RELEVANCE, ID]) {
        nodes {
          id
          name {
            full
            native
            userPreferred
          }
          image {
            large
          }
          primaryOccupations
        }
      }
      studios {
        nodes {
          id
          name
        }
      }
      coverImage {
        large
        medium
        color
      }
      bannerImage
      genres
      format
      relations {
        edges {
          id
          relationType(version: 2)
          node {
            id
            title {
              romaji
              english
              native
            }
            format
            type
            bannerImage
            coverImage {
              color
              large
              medium
            }
          }
        }
      }
      trailer {
        id
        site
      }
      isAdult
    }
  }
`;
