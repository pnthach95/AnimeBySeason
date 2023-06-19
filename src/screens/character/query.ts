import {gql} from '@apollo/client';

export const QUERY = gql`
  query Character($id: Int) {
    Character(id: $id) {
      id
      name {
        full
        native
      }
      image {
        large
      }
      description(asHtml: true)
      age
      gender
      bloodType
      dateOfBirth {
        year
        month
        day
      }
      media {
        edges {
          id
          characterRole
          voiceActorRoles {
            roleNotes
            voiceActor {
              id
              name {
                userPreferred
              }
              image {
                large
              }
            }
          }
          node {
            id
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
            type
            format
            episodes
            genres
            isAdult
          }
        }
      }
    }
  }
`;
