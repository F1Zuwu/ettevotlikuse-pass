const { models } = require("../database");
const category = require("../database/models/category");
const BaseController = require("./BaseController");
const sendApprovalEmail = require("../mail/sendApprovalEmail").sendApprovalEmail;

const moment = require("moment");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

require("dotenv").config();

const normalizeStatus = (value) =>
  (value || "").toString().trim().toLowerCase();



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
    const normalizedStatus = normalizeStatus(status || "ootel");

    try {

      const experience = await models.Experience.create(
        {
          title,
          date: validDate,
          description,
          reflectionanswer,
          status: normalizedStatus,
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
  approval_token_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

console.log("signed jwt", experience.dataValues.approval_token)

const decoded = jwt.verify(experience.dataValues.approval_token, process.env.JWT_SECRET)
console.log("decoded jwt", decoded.id)

       if (approver_email && normalizedStatus !== "mustand") {
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

    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required" });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ success: false, message: "Token expired or invalid" });
    }

    const experience = await models.Experience.findOne({
    where: { approval_token: token },
  });
    

    if (!experience) {
      return res.status(404).json({ success: false, message: "Invalid token" });
    }

    if (experience.approval_token_expires_at && new Date(experience.approval_token_expires_at) < new Date()) {
    return res.status(400).json({ success: false, message: "Token expired" });
  }

    const approvedStatus = normalizeStatus(status || "kinnitatud");

    await experience.update({
      status: approvedStatus,
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
    approver_email,
    proofs: proofsFromBody,
  } = req.body;

  const previousStatus = normalizeStatus(experience.status);
  const previousApproverEmail = experience.approver_email || "";
  const nextStatus = normalizeStatus(status ?? experience.status ?? "");

  if (previousStatus === "kinnitatud") {
    return res.status(403).json({
      success: false,
      message: "Kinnitatud tegevust ei saa muuta.",
    });
  }

  const updates = {
    title: title ?? experience.title,
    description: description ?? experience.description,
    reflectionanswer: reflectionanswer ?? experience.reflectionanswer,
    status: nextStatus,
    category_id: category_id ?? experience.category_id,
    reflection_id: reflection_id ?? experience.reflection_id,
    approver_email: approver_email ?? experience.approver_email,
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
  const proofsProvided = typeof proofsFromBody !== "undefined";
  if (proofsProvided) {
    try {
      const parsed = typeof proofsFromBody === "string" ? JSON.parse(proofsFromBody) : proofsFromBody;
      const urlRegex = /^https?:\/\/[^\s]+$/;
      const existingUrlProofs = (experience.proofs || []).filter((proof) =>
        urlRegex.test((proof.proof_url || "").trim()),
      );
      const existingProofUrls = new Set(existingUrlProofs.map((proof) => (proof.proof_url || "").trim()));
      const incomingUniqueUrls = new Set();

      (Array.isArray(parsed) ? parsed : []).forEach((p) => {
        const proofUrl = (p?.proof_url || "").trim();
        if (!proofUrl || !urlRegex.test(proofUrl)) {
          throw new Error("Invalid URL in proofs");
        }

        // Skip duplicates inside current payload.
        if (incomingUniqueUrls.has(proofUrl)) {
          return;
        }

        incomingUniqueUrls.add(proofUrl);
      });

      // Remove URL proofs that user deleted in edit form.
      const proofIdsToDelete = existingUrlProofs
        .filter((proof) => !incomingUniqueUrls.has((proof.proof_url || "").trim()))
        .map((proof) => proof.proof_id);

      if (proofIdsToDelete.length > 0) {
        await models.Proof.destroy({
          where: {
            proof_id: { [Op.in]: proofIdsToDelete },
            experience_id: experience.experience_id,
          },
        });
      }

      // Add new URL proofs not already attached.
      incomingUniqueUrls.forEach((proofUrl) => {
        if (!existingProofUrls.has(proofUrl)) {
          urlProofs.push({
            proof_url: proofUrl,
            experience_id: experience.experience_id,
          });
        }
      });
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  }

  const allNewProofs = [...urlProofs, ...proofsFromFiles];

  if (allNewProofs.length > 0) {
    await models.Proof.bulkCreate(allNewProofs);
  }

  const nextApproverEmail = updates.approver_email || "";
  const movedOutOfDraft = previousStatus === "mustand" && nextStatus !== "mustand";
  const approverChanged = nextApproverEmail && nextApproverEmail !== previousApproverEmail;

  if (nextApproverEmail && nextStatus !== "mustand" && (movedOutOfDraft || approverChanged)) {
    let token = experience.approval_token;
    if (!token) {
      token = jwt.sign({ id: experience.experience_id }, process.env.JWT_SECRET, { expiresIn: "24h" });
      await experience.update({
        approval_token: token,
        approval_token_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
    }

    const user = await models.User.findByPk(experience.user_id);
    const submittedBy = user ? user.name : "Unknown";
    await sendApprovalEmail(nextApproverEmail, updates.title, submittedBy, token);
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
