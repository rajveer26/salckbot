const fetch = require("cross-fetch");
const { ApolloClient, InMemoryCache, HttpLink} =require( "@apollo/client");

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
const client = new ApolloClient({
    link: new HttpLink({
        uri:"http://localhost:8081/v1/graphql",
         headers: { 'x-hasura-admin-secret': 'myadminsecretkey' },

        fetch,
    }) ,
    cache: new InMemoryCache(),
});

module.exports = client;