const { models } = require("../database");
const BaseController = require("./BaseController");

const moment = require("moment");

class experienceController extends BaseController {
  constructor() {
    super();
    this.addExperience = this.addExperience.bind(this);
    this.getExperience = this.getExperience.bind(this);
    this.updateExperience = this.updateExperience.bind(this);
    this.deleteExperience = this.deleteExperience.bind(this);

    this.getAllExperiences = this.getAllExperiences.bind(this);
  }

  
async addExperience(req, res) {
  this.handleRequest(req, res, async () => {
    const { title, date, description, reflectionanswer, status } = req.body;

    if (!title || !date || !description || !reflectionanswer || !status) {
      return res.status(400).json({
        success: false,
        error: "Required fields cannot be empty!",
      });
    }

    const parsedDate = moment(date, "DD-MM-YYYY", true);
    if (!parsedDate.isValid()) {
      return res.status(400).json({
        success: false,
        error: "Invalid date format. Please use DD-MM-YYYY",
      });
    }

    const validDate = parsedDate.toDate();

    try {
      const experience = await models.Experience.create({
        title,
        date: validDate, 
        description,
        reflectionanswer,
        status,
      });

      return res.status(201).json({
        success: true,
        message: "Experience created",
        experience: {
          experience_id: experience.experience_id,
          title: experience.title,
          date: experience.date,
          status: experience.status,
        },
      });
    } catch (dbErr) {
      console.error("Database error occurred: ", dbErr);
      return res.status(500).json({
        success: false,
        message: "Failed to create an experience.",
        error: dbErr.message,
      });
    }
  });
}
    async getExperience (req, res) {
  const experience = await models.Experience.findByPk(req.experience.experience_id);

  return res.status(200).json({
    success: true,
    experience
  });

    }

    async updateExperience(req, res) {
  const experience = await models.Experience.findByPk(req.experience.experience_id);

  if (!experience) return res.status(404).json({ success: false, message: 'Experience not found' });

  const { title, date, description, reflectionanswer, status } = req.body;

  const updates = {
    title: title ?? experience.title,
    description: description ?? experience.description,
    reflectionanswer: reflectionanswer ?? experience.reflectionanswer,
  };

    if (req.user.role === 'admin' && role) {
    updates.role = role;
  }

  await experience.update(updates);

  return res.status(200).json({ success: true, message: 'Experience updated', experience });
}


async deleteExperience(req, res) {
  const experience = await models.Experience.findByPk(
    req.experience.experience_id
  );

  if (!experience) {
    return res.status(404).json({
      success: false,
      message: 'Experience not found',
    });
  }

  await experience.destroy();

  return res.status(200).json({
    success: true,
    message: 'Experience deleted successfully',
  });
}



// mingi admin asi
    async getAllExperiences (req, res) {
        this.handleRequest(req, res, async () => {
      const experiences = await models.Experience.findAll({
      });
      return res.status(200).json({
        success: true,
        message: "All experiences in the database",
        experiences,
      });
    });

    }



    }


    module.exports = new experienceController();