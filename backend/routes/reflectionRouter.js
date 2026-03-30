const reflectionController = require("../controllers/reflectionController");
const BaseRouter = require("./BaseRouter");
const { checkAuthenticated } = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");


class reflectionRouter extends BaseRouter {
    constructor() {
        super();
        this.registerRoutes();
    }

    registerRoutes() {
        this.registerRoute("post", "/reflection", checkAuthenticated, isAdmin, reflectionController.addReflection);
        this.registerRoute("get", "/reflection/:id", reflectionController.getReflection);
        this.registerRoute("get", "/reflections", reflectionController.getAllReflections);
        this.registerRoute("put", "/reflection/:id", checkAuthenticated, isAdmin, reflectionController.updateReflection);
        this.registerRoute("delete", "/reflection/:id",checkAuthenticated, isAdmin, reflectionController.deleteReflection);
    }
}

module.exports = new reflectionRouter().getRouter();