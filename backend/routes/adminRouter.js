const BaseRouter = require("./BaseRouter");
const adminController = require("../controllers/adminController");
const { checkAuthenticated } = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

class AdminRouter extends BaseRouter {
  constructor() {
    super();
    this.registerRoutes();
  }

  registerRoutes() {
    this.registerRoute(
      "put",
      "/admin/users/:id/role",
      checkAuthenticated,
      isAdmin,
      adminController.updateUserRole
    );
  }
}

module.exports = new AdminRouter().getRouter();