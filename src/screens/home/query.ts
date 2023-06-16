import {gql} from '@apollo/client';

export const QUERY = gql`
  query AnimeList(
    $season: MediaSeason
    $seasonYear: Int
    $sort: [MediaSort]
    $page: Int
    $type: MediaType
    $format: [MediaFormat]
  ) {
    Page(page: $page, perPage: 20) {
      media(
        season: $season
        seasonYear: $seasonYear
        sort: $sort
        type: $type
        format_in: $format
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
