require("express-async-errors")

const Migrations = require("./database/sqlite/Migrations") //Criamos essa funcionalidade para o próprio JS criar o banco de dados e as tabelas relacionais 

const express = require("express"); // importando o express para a aplicação

const routes = require("./routes");
const appError = require("./utils/appError");
const uploadConfigs = require("./configs/upload")
const cors = require("cors")

const app = express();
app.use(express.json())
app.use(cors());

app.use(routes) // -> primeiro venho aqui, e sou direcionado pra index no routes
routes.use("/files", express.static(uploadConfigs.UPLOAD_FOLDER))

Migrations();

app.use((error, request, response, next) => {
    if(error instanceof appError){
      return  response.status(error.statusCode).json({
            statusCode: "Error",
            message: error.message
        })
    }

    
    console.log(`Status do error: ${error.statusCode}
    Tipo do error: ${error}`)
    

    return response.status(500).json({
        statusCode: "Error",
        message: "Internal server error"
        
    })
})

const PORT = 3333;

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))


