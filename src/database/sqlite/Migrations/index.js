const createUsers = require("./createUsers")
const sqlConnection = require("../../sqlite")

async function migrationsRun(){
    const schemas = [
        createUsers,
    ].join("");

    sqlConnection().then(db => db.exec(schemas)).catch(error => console.log(error))
    

    
}

module.exports = migrationsRun;
 
