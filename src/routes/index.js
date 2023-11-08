const { Router }  = require("express");

const usersRoutes = require("./user.routes");
const notesRoutes = require("./notes.routes");
const tagsRoutes = require("./tags.routes");
const sessionsRoutes = require("./sessions.routes")

const routes = Router(); //Aqui vamos reunir todas as nossas rotas

routes.use("/user", usersRoutes) //Depois de ser direcionado pra ca, ele olha o que eu digitei e vai em alguma rota, de eu digitei user ele manda para user.routes
routes.use("/notes", notesRoutes)
routes.use("/tags", tagsRoutes)
routes.use("/sessions", sessionsRoutes)

module.exports = routes; 