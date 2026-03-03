const reflectionController = require("../controllers/reflectionController");
const BaseRouter = require("./BaseRouter");


class reflectionRouter extends BaseRouter {
    constructor() {
        super();
        this.registerRoutes();
    }

    registerRoutes() {
        this.registerRoute("post", "/reflection", reflectionController.addReflection);
        this.registerRoute("get", "/reflection/:id", reflectionController.getReflection);
        this.registerRoute("get", "/reflections", reflectionController.getAllReflections);
        this.registerRoute("put", "/reflection/:id", reflectionController.updateReflection);
        this.registerRoute("delete", "/reflection/:id", reflectionController.deleteReflection);
    }
}

module.exports = new reflectionRouter().getRouter();