import {getAllUsersFromSlack} from "./getAllUsersFromSlack.js";
import {validMail} from "../../functions/toCheckMail.js";
import {to_addData} from "../../functions/addingUserTodb.js";
import {toCheckExistingUser} from "../../functions/toCheckExistingUser.js";
import {memberNotPresent_db} from "../../functions/memberNotPresent_db.js";
import {to_validateDomain} from "../../functions/toCheckDomain.js";
let interval = 1000; // how much time should the delay between two iterations be (in milliseconds)?
let promise = Promise.resolve();

async function main3(client) {

const members = await getAllUsersFromSlack(client);
  for (const n in members) {

    //promise chaining
    promise = promise.then( async function () {
      let email = members[n].profile.email;

      //to check if the user is having valid mail id or not
      if (validMail(email)) {


        //checking domain
        if ( await to_validateDomain(email)) {


          let slack_id = members[n].id;
          const variables={
            slack_id:slack_id
          }
          //to check member is already present or not
          let memberNotPresent = await memberNotPresent_db(variables)
          if (memberNotPresent === true) {

            let name = members[n].real_name;
            let region = members[n].tz;
            if (region === 'Asia/Kolkata') region = "India"; else region = "USA"

            //after all the checks adding user to the db
            const variables = { slack_id: "1234",
              name: name,
              email: email,
              region: region,
              external_id:"0",
              created_at:new Date().toLocaleString(),
              updated_at:new Date().toLocaleString(),
              created_by:"bot",
              updated_by:"bot" };
            await to_addData(variables,slack_id,client);
          }
          else
          {
            const variables ={
              slack_id: slack_id
            }
            await toCheckExistingUser(variables);
          }

          return new Promise(function (resolve) {
            setTimeout(resolve, interval);
          })
        }
      }
    });

  }

}

export {main3}
