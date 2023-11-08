const { Router} = require("express");

const UserController = require("../controllers/UserController");
const UserAvatarController = require("../controllers/UserAvatarController");

const usersRoutes = Router();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const multer = require("multer");
const uploadConfigs = require("../configs/upload");

const userController = new UserController();
const userAvatarController = new UserAvatarController();

const upload = multer(uploadConfigs.MULTER)


usersRoutes.post("/", userController.create)
usersRoutes.put("/", ensureAuthenticated, userController.update)
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update)

module.exports = usersRoutes;