import { ApolloClient, InMemoryCache } from '@apollo/client';

const apolloClient = new ApolloClient({
  uri: 'http://localhost:3000/api/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          parserRule: {
            read(_init, { args, toReference, fieldName, ...rest }) {
              return toReference({
                __typename: 'ParserRule',
                id: args?.id ?? '-1'
              });
            }
          },
          parserRules: {
            merge(_existing, incoming, { fieldName }) {
              console.log('merge parserRules', {
                params: {
                  _existing,
                  incoming
                }
              });
              return incoming;
            }
          },
          definitions: {
            merge(_existing, incoming, { fieldName }) {
              console.log('merge definitions', {
                params: {
                  _existing,
                  incoming
                }
              });
              return incoming;
            }
          }
        }
      }
    }
  })
});

export default apolloClient;
