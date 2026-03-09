const { models } = require("../database");

const adminController = {
  async updateUserRole(req, res) {
    const userIdToUpdate = parseInt(req.params.id, 10);
    console.log("req.params.id:", userIdToUpdate);
    const { role } = req.body;

    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await models.User.findByPk(userIdToUpdate);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.update({ role });

    return res.status(200).json({
      success: true,
      message: "User role updated",
      user: {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      },
    });
  },
  async getAllExperiencesForAdmin(req, res) {
    const stats = await models.Experience.findAll({
  attributes: ["category_id", [sequelize.fn("COUNT", sequelize.col("experience_id")), "count"]],
  group: ["category_id"]
});
const stats2 = await models.Experience.findAll({
  attributes: ["user_id", [sequelize.fn("COUNT", sequelize.col("experience_id")), "count"]],
  group: ["user_id"]
});

  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied" });
  }

  const experiences = await models.Experience.findAll({
    include: [
      { model: models.User, as: "user" },
      { model: models.Category, as: "category" },
      { model: models.Reflection, as: "reflection" },
      { model: models.Proof, as: "proofs" },
    ],
  });

  return res.json({ success: true, experiences });
  
}



};

module.exports = adminController;