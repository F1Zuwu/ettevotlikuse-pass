const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { models } = require("../database");
const BaseController = require("./BaseController");

class AuthController extends BaseController {
    constructor() {
        super();
        this.googleAuth = this.googleAuth.bind(this);

        this.googleClient = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            'postmessage' // Special redirect URI for @react-oauth/google with auth-code flow
        );
    }

    async googleAuth(req, res) {
        try {
            const { code, credential } = req.body;

            let email, name, picture, sub, email_verified;

            // Handle authorization code flow
            if (code) {
                // Exchange authorization code for tokens
                const { tokens } = await this.googleClient.getToken(code);
                this.googleClient.setCredentials(tokens);

                // Verify the ID token
                const ticket = await this.googleClient.verifyIdToken({
                    idToken: tokens.id_token,
                    audience: process.env.GOOGLE_CLIENT_ID,
                });

                const payload = ticket.getPayload();
                ({ sub, email, name, picture, email_verified } = payload);
            } 
            // Handle credential (ID token) flow - backward compatibility
            else if (credential) {
                const ticket = await this.googleClient.verifyIdToken({
                    idToken: credential,
                    audience: process.env.GOOGLE_CLIENT_ID,
                });

                const payload = ticket.getPayload();
                ({ sub, email, name, picture, email_verified } = payload);
            } else {
                return res.status(400).json({ 
                    success: false, 
                    message: "Missing code or credential" 
                });
            }

            if (!email_verified) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Email not verified by Google" 
                });
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
                { id: user.user_id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            return this.sendResponse(res, {
                success: true,
                message: "User logged in via Google.",
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

        } catch (error) {
            console.error(error);
            return res.status(400).json({ success: false, message: "Google authentication failed" });
        }
    }
}

module.exports = new AuthController();