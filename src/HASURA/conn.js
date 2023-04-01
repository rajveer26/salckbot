// const fetch = require("cross-fetch");
// const { ApolloClient, InMemoryCache, HttpLink} =require( "@apollo/client");

// module.exports = async function fetchGraphQL(operationsDoc, operationName, variables) {
    // const result = await fetch(
    //     "http://localhost:8080/v1/graphql",
    //     {
    //         method: "POST",
    //         body: JSON.stringify({
    //             query: operationsDoc,
    //             variables: variables,
    //             operationName: operationName,
    //         })
    //     }
    // );

    // return await result.json();
// }
// const client = new ApolloClient({
//     link: new HttpLink({
//         uri:"http://localhost:8081/v1/graphql",
//          headers: { 'x-hasura-admin-secret': 'myadminsecretkey' },
//
//         fetch,
//     }) ,
//     cache: new InMemoryCache(),
// });
//
// module.exports = client;

const { ApolloClient, InMemoryCache, HttpLink } = require('@apollo/client');
const fetch = require('cross-fetch');

const clientUrl =
    process.env.NODE_ENV === 'production' ? 'http://graphql-engine:8080/v1/graphql' : 'http://localhost:8081/v1/graphql';

const headers = {
    'Content-Type': 'application/json',
    'Hasura-Client-Name': 'hasura-console',
    'x-hasura-admin-secret': 'myadminsecretkey',
};

const client = new ApolloClient({
    link: new HttpLink({
        uri: clientUrl,
        headers,
        fetch,
    }),
    cache: new InMemoryCache(),
});

module.exports = client;
