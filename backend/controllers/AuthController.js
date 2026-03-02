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
            process.env.GOOGLE_CLIENT_SECRET
        );
    }

    async googleAuth(req, res) {
        try {
            const { accessToken, userInfo } = req.body;

            if (!accessToken || !userInfo) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Missing access token or user info" 
                });
            }

            // Verify the access token by checking with Google
            const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
            const tokenInfo = await response.json();

            if (tokenInfo.error || tokenInfo.audience !== process.env.GOOGLE_CLIENT_ID) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Invalid access token" 
                });
            }

            const { sub, email, name, picture, email_verified } = userInfo;

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

            return res.status(200).json({
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