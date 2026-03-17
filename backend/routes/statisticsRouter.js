const BaseRouter = require("./BaseRouter");
const statisticsController = require("../controllers/statisticsController");
const { checkAuthenticated } = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

class statisticsRouter extends BaseRouter {
  constructor() {
    super();
    this.registerRoutes();
  }

  registerRoutes() {
    this.registerRoute("get", "/statistics/active-users", checkAuthenticated, isAdmin, statisticsController.getActiveUsers);
    this.registerRoute("get", "/statistics/new-users", checkAuthenticated, isAdmin, statisticsController.getNewUsers);
    this.registerRoute("get", "/statistics/recent-users", checkAuthenticated, isAdmin, statisticsController.getRecentUsers);
    this.registerRoute("get", "/statistics/experience-status", checkAuthenticated, isAdmin, statisticsController.getExperienceStatus);
    this.registerRoute("get", "/statistics/popular-categories", checkAuthenticated, isAdmin, statisticsController.getPopularCategories);
  }
}

module.exports = new statisticsRouter().getRouter();