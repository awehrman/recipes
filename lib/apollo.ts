import { ApolloClient, InMemoryCache } from '@apollo/client';

const apolloClient = new ApolloClient({
  uri: 'http://localhost:3000/api/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          parserRule: {
            read(_, { args, toReference }) {
              return toReference({
                __typename: 'ParserRule',
                id: args?.id ?? '-1'
              });
            }
          },
          parserRules: {
            merge(existing, incoming) {
              console.log({ existing, incoming });
              return incoming;
            }
          }
        }
      }
    }
  })
});

export default apolloClient;
