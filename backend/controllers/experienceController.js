const { models } = require("../database");
const category = require("../database/models/category");
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
    const {
      title,
      date,
      description,
      reflectionanswer,
      status,
      category_id,
      reflection_id,
    } = req.body;

     const user_id = req.user.id;

    if (!title || !date || !description || !reflectionanswer) {
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
      const experience = await models.Experience.create(
        {
          title,
          date: validDate,
          description,
          reflectionanswer,
          status: status || "ootel",
          category_id,
          reflection_id,
          user_id,
          proofs: [
            {
              file_name: "test.pdf",
              proof_url: "uploads/test.pdf",
            },
          ],
        },
        {
          include: [{ model: models.Proof, as: "proofs" }],
        }
      );

      return res.status(201).json({
        success: true,
        message: "Experience created",
        experience,
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

  async approveExperience(req, res) {
    const { email, feedback, status } = req.body;

    const experience = await models.Experience.findByPk(req.params.id);

    if (!experience) {
      return res.status(404).json({ success: false });
    }

    await experience.update({
      status: status,
      approver_email: email,
      approver_feedback: feedback,
      approved_at: new Date(),
    });
    return res.json({ success: true });
  }

  async getExperience(req, res) {
  this.handleRequest(req, res, async () => {
    const experience = await models.Experience.findByPk(req.params.id, {
      include: [
        {
          model: models.Proof,
          as: "proofs",
        },
        {
          model: models.Category,
          as: "category",
        },
      ],
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    return res.status(200).json({
      success: true,
      experience,
    });
  });
}




async updateExperience(req, res) {
  const experience = await models.Experience.findByPk(req.params.id);

  if (!experience)
    return res
      .status(404)
      .json({ success: false, message: "Experience not found" });

  const {
    title,
    date,
    description,
    reflectionanswer,
    status,
    category_id,
    reflection_id,
  } = req.body;

  const updates = {
    title: title ?? experience.title,
    description: description ?? experience.description,
    reflectionanswer: reflectionanswer ?? experience.reflectionanswer,
    status: status ?? experience.status,
    category_id: category_id ?? experience.category_id,
    reflection_id: reflection_id ?? experience.reflection_id,
  };

  if (date) {
    const parsedDate = moment(date, "DD-MM-YYYY", true);
    if (!parsedDate.isValid()) {
      return res.status(400).json({
        success: false,
        error: "Invalid date format. Please use DD-MM-YYYY",
      });
    }
    updates.date = parsedDate.toDate();
  }

  await experience.update(updates);

  const updatedExperience = await models.Experience.findByPk(req.params.id, {
    include: [
      { model: models.Proof, as: "proofs" },
      { model: models.Category, as: "category" },
      { model: models.Reflection, as: "reflection" },
    ],
  });

  return res
    .status(200)
    .json({ success: true, message: "Experience updated", experience: updatedExperience });
}

  async deleteExperience(req, res) {
    const experience = await models.Experience.findByPk(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: "Experience not found",
      });
    }

    await experience.destroy();

    return res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });
  }

  async getAllExperiences(req, res) {
    this.handleRequest(req, res, async () => {
      const experiences = await models.Experience.findAll({
        include: [
          {
            model: models.Proof,
            as: "proofs",
          },
        ],
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
