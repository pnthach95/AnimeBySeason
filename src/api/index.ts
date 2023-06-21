import {ApolloClient, InMemoryCache} from '@apollo/client';
import type {AnimeList_Page} from 'screens/home/types';
import type {
  StaffCharacters_Staff,
  StaffCharacters_Staff_characterMedia,
  StaffInfo_Staff,
  StaffMedia_Staff,
  StaffMedia_Staff_staffMedia,
} from 'screens/staff/types';
import type {IMediaItem} from 'typings/globalTypes';

type StaffObj = StaffCharacters_Staff & StaffInfo_Staff & StaffMedia_Staff;

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
              existing: Record<string, IMediaItem[] | string> | undefined,
              incoming: Record<string, IMediaItem[] | string>,
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
                      ...(final[k as keyof AnimeList_Page] as IMediaItem[]),
                      ...(incoming[k as keyof AnimeList_Page] as IMediaItem[]),
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
      Media: {
        merge: false,
      },
      Staff: {
        keyFields: false,
        merge(existing: StaffObj | undefined, incoming: StaffObj) {
          return {...existing, ...incoming};
        },
        fields: {
          characterMedia: {
            keyArgs: false,
            merge(
              existing: StaffCharacters_Staff_characterMedia | undefined,
              incoming: StaffCharacters_Staff_characterMedia,
              {args},
            ) {
              if (existing === undefined || args?.page === 1) {
                return incoming;
              }
              const final: StaffCharacters_Staff_characterMedia = {
                ...existing,
                ...incoming,
                edges: Array.from(
                  new Set([...existing.edges, ...incoming.edges]),
                ),
              };
              return final;
            },
          },
          staffMedia: {
            keyArgs: false,
            merge(
              existing: StaffMedia_Staff_staffMedia | undefined,
              incoming: StaffMedia_Staff_staffMedia,
              {args},
            ) {
              if (existing === undefined || args?.page === 1) {
                return incoming;
              }
              const final: StaffMedia_Staff_staffMedia = {
                ...existing,
                ...incoming,
                edges: Array.from(
                  new Set([...existing.edges, ...incoming.edges]),
                ),
              };
              return final;
            },
          },
        },
      },
    },
  }),
});
