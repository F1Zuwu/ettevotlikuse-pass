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
    this.registerRoute("post", "/experience/add", experienceController.addExperience);
    this.registerRoute("get", "/experience/:id", experienceController.getExperience);
    this.registerRoute("put", "/experience/:id", experienceController.updateExperience);
    this.registerRoute("delete", "/experience/:id", experienceController.deleteExperience);
   
    this.registerRoute("get", "/experiences/", experienceController.getAllExperiences);

    this.registerRoute("get", "/:id/approve", experienceController.getAllExperiences);

}
}

module.exports = new experienceRouter().getRouter();