const { models } = require("../database");
const BaseController = require("./BaseController");
const jwt = require("jsonwebtoken");


class statisticsController extends BaseController {
  constructor() {
    super();
    this.Register = this.Register.bind(this);
  }


  async getAll(req, res) {
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

}

module.exports = new statisticsController();