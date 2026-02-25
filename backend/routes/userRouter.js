const userController = require("../controllers/userController");
const BaseRouter = require("./BaseRouter");
const { checkAuthenticated } = require("../middleware/auth");

class userRouter extends BaseRouter {
  constructor() {
    super();
    this.registerRoutes();
  }

  registerRoutes() {
    this.registerRoute("post", "/user/register", userController.Register);
    this.registerRoute("post", "/user/login", userController.Login);
    this.registerRoute('get', '/sessions', checkAuthenticated, userController.getSession);
    this.registerRoute('get', '/users', checkAuthenticated, userController.getUsers);

    this.registerRoute('get', '/user/profile', checkAuthenticated, userController.getProfile);
    this.registerRoute('put', '/user/profile', checkAuthenticated, userController.updateProfile);
}
}

module.exports = new userRouter().getRouter();