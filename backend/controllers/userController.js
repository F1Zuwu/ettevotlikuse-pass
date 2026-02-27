const { models } = require("../database");
const BaseController = require("./BaseController");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class userController extends BaseController {
  constructor() {
    super();
    this.Register = this.Register.bind(this);
    this.Login = this.Login.bind(this);
    this.getSession = this.getSession.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
  }

  generateToken(user) {
    return jwt.sign(
      { id: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );
  }

  async Register(req, res) {
    this.handleRequest(req, res, async () => {
      const { name, email, password, birthday, phone, promotional_content } =
        req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          error: "Required fields cannot be empty!",
        });
      }

      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid email format" });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await models.User.create({
          name,
          email,
          password: hashedPassword,
          promotional_content
        });

        const token = this.generateToken(user);

        return res.status(201).json({
          success: true,
          message: "User created and logged in.",
          token,
          user: {
            id: user.user_id,
            username: user.username,
            email: user.email,
            promotional_content: user.promotional_content
          },
        });
      } catch (dbErr) {
        console.error("Database error occurred: ", dbErr);
        return res.status(500).json({
          success: false,
          message: "Failed to create user.",
          error: dbErr.message,
        });
      }
    });
  }

  async Login(req, res) {
    this.handleRequest(req, res, async () => {
      const { email, phone, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, error: "Fields cannot be empty!" });
      }

      try {
        const user = await models.User.findOne({ where: { email } });

        if (!user) {
          return res
            .status(401)
            .json({ success: false, error: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res
            .status(401)
            .json({ success: false, error: "Invalid credentials" });
        }

        const token = this.generateToken(user);

        return res.status(200).json({
          success: true,
          message: "User logged in.",
          token,
          user: {
            id: user.user_id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            birthday: user.birthday,
            picture: user.profileimg,
            role: user.role,
          },
        });
      } catch (dbErr) {
        console.error("Database error occurred: ", dbErr);
        return res.status(500).json({
          success: false,
          message: "Failed to login user.",
          error: dbErr.message,
        });
      }
    });
  }

  async getUsers(req, res) {
    this.handleRequest(req, res, async () => {
      const users = await models.User.findAll({
        attributes: { exclude: ["password"] },
      });
      return res.status(200).json({
        success: true,
        message: "All users in the database",
        users,
      });
    });
  }

  async getSession(req, res) {
    this.handleRequest(req, res, async () => {
      return res.status(200).json({
        success: true,
        user: req.user,
      });
    });
  }

  async getProfile(req, res) {
  const user = await models.User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] }
  });

  return res.status(200).json({
    success: true,
    user
  });
}

  async updateProfile(req, res) {
  const user = await models.User.findByPk(req.user.id);

  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  const { name, phone, birthday, profileimg, promotional_content, role } = req.body;

  const updates = {
    name: name ?? user.name,
    phone: phone ?? user.phone,
    birthday: birthday ?? user.birthday,
    profileimg: profileimg ?? user.profileimg,
    promotional_content: promotional_content ?? user.promotional_content,
  };

    if (req.user.role === 'admin' && role) {
    updates.role = role;
  }

  await user.update(updates);

  return res.status(200).json({ success: true, message: 'Profile updated', user });
}
}

module.exports = new userController();
