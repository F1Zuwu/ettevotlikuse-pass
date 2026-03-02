const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { models } = require("../database");
const BaseController = require("./BaseController");

class AuthController extends BaseController {
    constructor() {
        super();
        this.googleAuth = this.googleAuth.bind(this);

        this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async googleAuth(req, res) {
        try {
            const { credential } = req.body;

            // Verify Google token
            const ticket = await this.googleClient.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            const { sub, email, name, picture, email_verified } = payload;

            if (!email_verified) {
                return this.sendError(res, "Email not verified by Google");
            }

            // Check if user exists
            let user = await models.User.findOne({
                where: { email: email },
            });

            // Create user
            if (!user) {
                user = await models.User.create({
                    googleId: sub,
                    email: email,
                    name: name,
                    profileimg: picture,
                    password: null,
                    role: "user",
                });
            } else {
                if (!user.googleId) {
                    user.googleId = sub;
                    await user.save();
                }
            }

            // Generate JWT
            const token = jwt.sign(
                { id: user.user_id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            return this.sendResponse(res, {
                success: true,
                token,
                user,
            });

        } catch (error) {
            console.error(error);
            return res.status(400).json({ success: false, message: "Google authentication failed" });
        }
    }
}

module.exports = new AuthController();