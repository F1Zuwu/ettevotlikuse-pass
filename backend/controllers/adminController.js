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
};

module.exports = adminController;