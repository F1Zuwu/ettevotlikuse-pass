const { models } = require("../database");
const category = require("../database/models/category");
const BaseController = require("./BaseController");
const sendApprovalEmail = require("../mail/sendApprovalEmail").sendApprovalEmail;

const moment = require("moment");
const jwt = require("jsonwebtoken");

require("dotenv").config();



class experienceController extends BaseController {
  constructor() {
    super();
    this.addExperience = this.addExperience.bind(this);
    this.getExperience = this.getExperience.bind(this);
    this.updateExperience = this.updateExperience.bind(this);
    this.deleteExperience = this.deleteExperience.bind(this);

    this.getAllExperiences = this.getAllExperiences.bind(this);

    this.getApproveExperience = this.getApproveExperience.bind(this);

    this.approveExperience = this.approveExperience.bind(this);
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
      approver_email,
      proofs: proofsFromBody,
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

    const proofsFromFiles = (req.files || []).map((file) => ({
      file_name: file.originalname,
      proof_url: `/uploads/${file.filename}`,
    }));

    let urlProofs = [];
    if (proofsFromBody) {
      try {
        const parsed = typeof proofsFromBody === "string" ? JSON.parse(proofsFromBody) : proofsFromBody;
        const urlRegex = /^https?:\/\/[^\s]+$/;
        parsed.forEach((p) => {
          if (!p.proof_url || !urlRegex.test(p.proof_url)) {
            throw new Error("Invalid URL in proofs");
          }
        });
        urlProofs = parsed;
      } catch (err) {
        return res.status(400).json({ success: false, error: err.message });
      }
    }

    const allProofs = [...urlProofs, ...proofsFromFiles];

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
          proofs: allProofs,
          approver_email,
          approval_token: null,
          approval_token_expires_at: null,
        },
        { include: [{ model: models.Proof, as: "proofs" }] }
      );


const token = jwt.sign({id: experience.dataValues.experience_id}, process.env.JWT_SECRET, {expiresIn: "24h"})


await experience.update({
      approval_token: token,
    });

console.log("signed jwt", experience.dataValues.approval_token)

const decoded = jwt.verify(experience.dataValues.approval_token, process.env.JWT_SECRET)
console.log("decoded jwt", decoded.id)

       if (approver_email) {
          const user = await models.User.findByPk(user_id);
          const submittedBy = user ? user.name : "Unknown";
          await sendApprovalEmail(approver_email, title, submittedBy, token);
        }

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

async getApproveExperience(req, res){
  const exp_id = jwt.verify(req.query.token, process.env.JWT_SECRET)
  const experience = await models.Experience.findByPk(exp_id.id, {
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

  res.json(experience)

}


  async approveExperience(req, res) {
    const { email, feedback, status } = req.body;
    const token = req.query.token || req.body.token;

    const experience = await models.Experience.findOne({
    where: { approval_token: token },
  });
    

    if (!experience) {
      return res.status(404).json({ success: false, message: "Invalid token" });
    }

    if (experience.approval_token_expires_at < new Date()) {
    return res.status(400).json({ success: false, message: "Token expired" });
  }

    await experience.update({
      status: status,
      approver_email: email,
      approver_feedback: feedback,
      approved_at: new Date(),
      approval_token: null,
      approval_token_expires_at: null,
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
  const experience = await models.Experience.findByPk(req.params.id, {
    include: [{ model: models.Proof, as: "proofs" }],
  });

  if (!experience)
    return res.status(404).json({ success: false, message: "Experience not found" });

  const {
    title,
    date,
    description,
    reflectionanswer,
    status,
    category_id,
    reflection_id,
    proofs: proofsFromBody,
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

  // Handle new proofs
  const proofsFromFiles = (req.files || []).map((file) => ({
    file_name: file.originalname,
    proof_url: `/uploads/${file.filename}`,
    experience_id: experience.experience_id,
  }));

  let urlProofs = [];
  if (proofsFromBody) {
    try {
      const parsed = typeof proofsFromBody === "string" ? JSON.parse(proofsFromBody) : proofsFromBody;
      const urlRegex = /^https?:\/\/[^\s]+$/;
      parsed.forEach((p) => {
        if (!p.proof_url || !urlRegex.test(p.proof_url)) throw new Error("Invalid URL in proofs");
        p.experience_id = experience.experience_id;
      });
      urlProofs = parsed;
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  const allNewProofs = [...urlProofs, ...proofsFromFiles];

  if (allNewProofs.length > 0) {
    await models.Proof.bulkCreate(allNewProofs);
  }

  const updatedExperience = await models.Experience.findByPk(req.params.id, {
    include: [
      { model: models.Proof, as: "proofs" },
      { model: models.Category, as: "category" },
      { model: models.Reflection, as: "reflection" },
    ],
  });

  return res.status(200).json({
    success: true,
    message: "Experience updated",
    experience: updatedExperience,
  });
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
          {
            model: models.Category,
            as: "category",
          },
          {
            model: models.Reflection,
            as: "reflection",
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
