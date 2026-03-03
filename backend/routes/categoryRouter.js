const categoryController = require("../controllers/categoryController");
const BaseRouter = require("./BaseRouter");


class categoryRouter extends BaseRouter {
    constructor() {
        super();
        this.registerRoutes();
    }

    registerRoutes() {
        this.registerRoute("post", "/category", categoryController.addCategory);
        this.registerRoute("get", "/category/:id", categoryController.getCategory);
        this.registerRoute("get", "/categories", categoryController.getAllCategories);
        this.registerRoute("put", "/category/:id", categoryController.updateCategory);
        this.registerRoute("delete", "/category/:id", categoryController.deleteCategory);
    }
}

module.exports = new categoryRouter().getRouter();