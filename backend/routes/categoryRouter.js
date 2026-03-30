const categoryController = require("../controllers/categoryController");
const BaseRouter = require("./BaseRouter");
const { checkAuthenticated } = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

class categoryRouter extends BaseRouter {
    constructor() {
        super();
        this.registerRoutes();
    }

    registerRoutes() {
        this.registerRoute("post", "/category", checkAuthenticated, isAdmin, categoryController.addCategory);
        this.registerRoute("get", "/category/:id", categoryController.getCategory);
        this.registerRoute("get", "/categories", categoryController.getAllCategories);
        this.registerRoute("put", "/category/:id", checkAuthenticated, isAdmin, categoryController.updateCategory);
        this.registerRoute("delete", "/category/:id", checkAuthenticated, isAdmin, categoryController.deleteCategory);
    }
}

module.exports = new categoryRouter().getRouter();