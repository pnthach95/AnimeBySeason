import {gql} from '@apollo/client';

export const QUERY = gql`
  query SearchResultList($keyword: String, $page: Int) {
    SearchResult: Page(page: $page) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      media(
        search: $keyword
        type: ANIME
        sort: [POPULARITY_DESC, SCORE_DESC]
      ) {
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
