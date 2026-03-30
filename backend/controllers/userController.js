const { models } = require("../database");
const BaseController = require("./BaseController");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const maxProfileImageUrlLength = 255;
const maxNameLength = 120;
const maxEmailLength = 100;
const maxPhoneLength = 30;
const maxMotoLength = 255;

const isValidDateOnly = (value) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

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
            promotional_content: user.promotional_content,
            moto: user.moto
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

        await user.update({ last_login: new Date() });

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
            moto: user.moto,
            last_login: user.last_login,
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
    this.handleRequest(req, res, async () => {
      req.body = req.body || {};

      const user = await models.User.findByPk(req.user.id);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const {
        name,
        email,
        phone,
        birthday,
        profileimg,
        promotional_content,
        role,
        moto,
        currentPassword,
        newPassword,
      } = req.body;

      const hasUploadedProfileImage = Boolean(req.file);
      const trimmedName = typeof name === "string" ? name.trim() : name;
      const trimmedPhone = typeof phone === "string" ? phone.trim() : phone;
      const trimmedMoto = typeof moto === "string" ? moto.trim() : moto;
      const rawBirthday = typeof birthday === "string" ? birthday.trim() : birthday;
      let normalizedBirthday = user.birthday;

      if (typeof rawBirthday !== "undefined") {
        if (rawBirthday === "" || rawBirthday === null) {
          normalizedBirthday = null;
        } else if (typeof rawBirthday === "string") {
          if (!isValidDateOnly(rawBirthday)) {
            return res.status(400).json({
              success: false,
              message: "Sunnipaev peab olema formaadis YYYY-MM-DD.",
            });
          }

          normalizedBirthday = rawBirthday;
        }
      }

      if (typeof trimmedName === "string" && trimmedName.length > maxNameLength) {
        return res.status(400).json({
          success: false,
          message: "Nimi on liiga pikk.",
        });
      }

      if (typeof trimmedPhone === "string" && trimmedPhone.length > maxPhoneLength) {
        return res.status(400).json({
          success: false,
          message: "Telefoninumber on liiga pikk.",
        });
      }

      if (typeof trimmedMoto === "string" && trimmedMoto.length > maxMotoLength) {
        return res.status(400).json({
          success: false,
          message: "Moto on liiga pikk.",
        });
      }

      if (typeof profileimg === "string") {
        const trimmedProfileImg = profileimg.trim();

        if (trimmedProfileImg.startsWith("data:")) {
          return res.status(400).json({
            success: false,
            message: "Base64 pildi salvestamine ei ole toetatud. Kasuta faili üleslaadimist või URL-i.",
          });
        }

        if (trimmedProfileImg.length > maxProfileImageUrlLength) {
          return res.status(400).json({
            success: false,
            message: "Profiilipildi URL on liiga pikk.",
          });
        }
      }

      if (typeof email === "string" && email.trim()) {
        const normalizedEmail = email.trim().toLowerCase();

        if (!emailRegex.test(normalizedEmail)) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid email format" });
        }

        if (normalizedEmail.length > maxEmailLength) {
          return res
            .status(400)
            .json({ success: false, message: "E-mail on liiga pikk." });
        }

        const existingUserWithEmail = await models.User.findOne({
          where: { email: normalizedEmail },
        });

        if (
          existingUserWithEmail &&
          existingUserWithEmail.user_id !== user.user_id
        ) {
          return res
            .status(400)
            .json({ success: false, message: "Email is already in use" });
        }
      }

      if (newPassword) {
        if (String(newPassword).length < 8) {
          return res.status(400).json({
            success: false,
            message: "New password must be at least 8 characters long",
          });
        }

        if (user.password) {
          if (!currentPassword) {
            return res.status(400).json({
              success: false,
              message: "Current password is required",
            });
          }

          const isCurrentPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password,
          );

          if (!isCurrentPasswordValid) {
            return res.status(400).json({
              success: false,
              message: "Current password is incorrect",
            });
          }
        }
      }

      const updates = {
        name: trimmedName ?? user.name,
        email:
          typeof email === "string" && email.trim()
            ? email.trim().toLowerCase()
            : user.email,
        phone: trimmedPhone ?? user.phone,
        birthday: normalizedBirthday,
        profileimg: profileimg ?? user.profileimg,
        promotional_content:
          typeof promotional_content === "string"
            ? promotional_content === "true"
            : promotional_content ?? user.promotional_content,
        moto: trimmedMoto ?? user.moto,
      };

      if (hasUploadedProfileImage) {
        updates.profileimg = `/uploads/${req.file.filename}`;
      } else if (typeof profileimg !== "undefined") {
        updates.profileimg = typeof profileimg === "string" ? profileimg.trim() : profileimg;
      }

      if (newPassword) {
        updates.password = await bcrypt.hash(newPassword, 10);
      }

      if (req.user.role === "admin" && role) {
        updates.role = role;
      }

      await user.update(updates);

      return res
        .status(200)
        .json({ success: true, message: "Profile updated", user });
    });
  }
}

module.exports = new userController();
