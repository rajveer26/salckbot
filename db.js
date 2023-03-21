const pg = require('pg');
const Pool = require(`pg`).Pool;
const pool = new Pool({
    client: `postgres`,
    // host: 'db',
    host: 'clapit.postgres.database.azure.com',
    user: `clapit`,
    port:  5432,//comment it use in docker
    password: `talview@18`,
    database: `clapit12azure`,
    ssl: true

});
const client = new pg.Client(pool);


//const getEmployeeByEmpId = "SELECT * FROM employee WHERE $args like $1";

module.exports =  pool;