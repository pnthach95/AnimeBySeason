import {gql} from '@apollo/client';

export const QUERY = gql`
  query AnimeList($keyword: String, $page: Int) {
    Page(page: $page, perPage: 20) {
      media(search: $keyword, type: ANIME) {
        id
        episodes
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
        genres
        format
        isAdult
      }
    }
  }
`;
