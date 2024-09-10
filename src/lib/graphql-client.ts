import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';
import { readable } from 'svelte/store';
import type { DocumentNode } from 'graphql';

export const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://ison.gr/graphql', // Replace with your WordPress GraphQL endpoint
  }),
  cache: new InMemoryCache(),
});

export function query(document: DocumentNode, options: any = {}) {
  return readable(null, (set) => {
    const subscription = client.watchQuery({
      query: document,
      ...options,
    }).subscribe({
      next: ({ data, loading, error }) => set({ data, loading, error }),
      error: (error) => set({ error, loading: false }),
    });

    return () => subscription.unsubscribe();
  });
}