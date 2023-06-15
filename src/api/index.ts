import {ApolloClient, InMemoryCache} from '@apollo/client';
import type {AnimeList_Page, AnimeList_Page_media} from 'screens/home/types';

export const client = new ApolloClient({
  uri: 'https://graphql.anilist.co',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        keyFields: false,
        fields: {
          Page: {
            keyArgs: false,
            merge(
              existing:
                | Record<string, AnimeList_Page_media[] | string>
                | undefined,
              incoming: Record<string, AnimeList_Page_media[] | string>,
              {args},
            ) {
              if (existing === undefined || args?.page === 1) {
                return incoming;
              }
              const existingKeys = Object.keys(existing);
              const incomingKeys = Object.keys(incoming);
              const final = {...existing};
              existingKeys.forEach(k => {
                if (incoming[k as keyof AnimeList_Page]) {
                  if (
                    Array.isArray(final[k as keyof AnimeList_Page]) &&
                    Array.isArray(incoming[k as keyof AnimeList_Page])
                  ) {
                    final[k as keyof AnimeList_Page] = [
                      ...(final[
                        k as keyof AnimeList_Page
                      ] as AnimeList_Page_media[]),
                      ...(incoming[
                        k as keyof AnimeList_Page
                      ] as AnimeList_Page_media[]),
                    ];
                  } else {
                    final[k] = incoming[k];
                  }
                }
              });
              incomingKeys.forEach(k => {
                if (!final[k]) {
                  final[k] = incoming[k];
                }
              });
              return final;
            },
          },
        },
      },
    },
  }),
});
