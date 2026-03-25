const upload = require("../middleware/upload");
const { checkAuthenticated } = require("../middleware/auth");
const experienceController = require("../controllers/experienceController");
const BaseRouter = require("./BaseRouter");

class experienceRouter extends BaseRouter {
  constructor() {
    super();
    this.registerRoutes();
  }

  

  registerRoutes() {

    console.log({
  add: typeof experienceController.addExperience,
  get: typeof experienceController.getExperience,
  update: typeof experienceController.updateExperience,
  delete: typeof experienceController.deleteExperience,
  getAll: typeof experienceController.getAllExperiences,
});
    this.registerRoute("post", "/experience/add", checkAuthenticated, upload.array("files", 5),  experienceController.addExperience);
    this.registerRoute("get", "/experience/:id", experienceController.getExperience);
    this.registerRoute("put", "/experience/:id", checkAuthenticated, upload.array("files", 5), experienceController.updateExperience);
    this.registerRoute("delete", "/experience/:id", checkAuthenticated, experienceController.deleteExperience);
   
    this.registerRoute("get", "/experiences/",checkAuthenticated, experienceController.getAllExperiences);

    this.registerRoute("get", "/approve", experienceController.getApproveExperience);
    this.registerRoute("post", "/approve", experienceController.approveExperience);
}
}

module.exports = new experienceRouter().getRouter();