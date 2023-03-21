const fetchGraphQL = require("../../HASURA/conn");
const graphqueries = require("../addUSer/graphQLqueries/graphqueries");
const clients = require("../../HASURA/conn");
const {gql} = require("@apollo/client");
const {HASURA_OPERATIONS_add} = require("./graphQLqueries/graphqueries");

module.exports.add =  async (event, context, callback) => {

        try{
                const data_received = JSON.parse(event.body);


                const {data, errors} = await clients.query({
                        query: gql`${HASURA_OPERATIONS_add}`,

                        variables: {
                                "slack_id": data_received.slack_id,
                                "external_id": data_received.external_id,
                                "name": data_received.name,
                                "email": data_received.email,
                                "region": data_received.region,
                                "created_at": data_received.created_at,
                                "updated_at": data_received.updated_at,
                                "is_admin": data_received.is_admin,
                                "is_active": data_received.is_active
                        }
                });
                        if (errors) {
                                // handle those errors like a pro
                                if (errors[0].message.includes('Uniqueness violation. duplicate key value violates unique constraint \"user_pk\"')) {
                                        console.log(errors);
                                        const response = {
                                                statusCode: 400,

                                                body: JSON.stringify({message: "User already exists"}),
                                        };
                                        console.log(response);
                                        callback(null, response);

                                        JSON.parse(event.body);
                                }
                                console.log(errors);
                                const response = {
                                        statusCode: 400,

                                        body: JSON.stringify({error: errors.message}),
                                };
                                console.log(response);
                                if (callback)
                                        callback(null, response);

                                JSON.parse(event.body);
                                return response.statusCode;
                        } else {

                                // do something great with this precious data
                                const response = {
                                        statusCode: 200,

                                        body: JSON.stringify({message: "User created"}),
                                };
                                console.log(response);
                                if (callback)
                                        callback(null, response);

                                JSON.parse(event.body);
                                console.log(JSON.stringify({data}));

                                return response.statusCode;
                        }


        }




        catch (error) {
                const response = {
                        statusCode: 400,

                        body: JSON.stringify({error:error.message}),
                };
                console.log(response);
                callback(null, response);

                JSON.parse(event.body);

                return response.statusCode;
        }








}
