import { ApolloClient, InMemoryCache } from '@apollo/client/core';

const client = new ApolloClient({
  uri: '/graphql', // Use the relative path
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
});

export default client;