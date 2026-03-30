const userController = require("../controllers/userController");
const AuthController = require("../controllers/AuthController");
const BaseRouter = require("./BaseRouter");
const { checkAuthenticated } = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const upload = require("../middleware/upload");

class userRouter extends BaseRouter {
  constructor() {
    super();
    this.registerRoutes();
  }

  registerRoutes() {
    this.registerRoute("post", "/user/register", userController.Register);
    this.registerRoute("post", "/user/login", userController.Login);
    this.registerRoute('get', '/sessions', checkAuthenticated, userController.getSession);
    this.registerRoute('get', '/users', checkAuthenticated, isAdmin, userController.getUsers);

    this.registerRoute('get', '/user/profile', checkAuthenticated, userController.getProfile);
    this.registerRoute(
      'put',
      '/user/profile',
      checkAuthenticated,
      upload.single("profileImage"),
      userController.updateProfile,
    );

    this.registerRoute('post', '/google', AuthController.googleAuth);
}
}

module.exports = new userRouter().getRouter();