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
    this.registerRoute("get", "/experience/", experienceController.getExperience);
    this.registerRoute("put", "/experience/update", experienceController.updateExperience);
    this.registerRoute("delete", "/experience/", experienceController.deleteExperience);
   
    this.registerRoute("get", "/experiences/", experienceController.getAllExperiences);

}
}

module.exports = new experienceRouter().getRouter();