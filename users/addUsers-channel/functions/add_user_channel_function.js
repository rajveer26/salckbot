import {validMail} from "../../functions/toCheckMail.js";
import {getAllUserInfo} from "./togetInfoOfAllUsers.js";
import {memberNotPresent_db} from "../../functions/memberNotPresent_db.js";
import { to_addData} from "../../functions/addingUserTodb.js";
import {toCheckExistingUser} from "../../functions/toCheckExistingUser.js";
import {to_validateDomain} from "../../functions/toCheckDomain.js";



const token = process.env.SLACK_BOT_TOKEN;
 async function add_user_channel_function(slack_id,client)
{
  const variables={
    slack_id:slack_id
  }
  let memberNotPresent = await memberNotPresent_db(variables)
    if ( memberNotPresent === true) {
      //calling function to fetch users info
      const info = await getAllUserInfo(slack_id,client,token);
      let email = info.user.profile.email;

      //to check email is valid or not
      if (validMail(email)) {


        //to validate domain
        if ( await to_validateDomain(email)) {

          let name = info.user.real_name;
          let region = info.user.tz;
          if (region === 'Asia/Kolkata') region = "India"; else region = "USA"

          let external_id=info.user.team_id;//team_id
          const variables = { slack_id: slack_id,
            name: name,
            email: email,
            region: region,
            external_id:external_id,
            created_at:new Date().toLocaleString(),
            updated_at:new Date().toLocaleString(),
            created_by:"bot",
            updated_by:"bot" };
          await to_addData(variables,slack_id,client);


        } else {
          console.log("domain mismatched");
        }
      }
    }
    else
    {
      const variables ={
        slack_id: slack_id
      }
       await toCheckExistingUser(variables);
    }
}
export {add_user_channel_function}
