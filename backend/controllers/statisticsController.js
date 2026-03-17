const { models } = require("../database");
const { Sequelize, Op } = require("sequelize");
const BaseController = require("./BaseController");

class statisticsController extends BaseController {
    constructor() {
        super();

        this.getActiveUsers = this.getActiveUsers.bind(this);
        this.getNewUsers = this.getNewUsers.bind(this);
        this.getRecentUsers = this.getRecentUsers.bind(this);
        this.getExperienceStatus = this.getExperienceStatus.bind(this);
        this.getPopularCategories = this.getPopularCategories.bind(this);
    }

    async getActiveUsers(req, res) {
        try {
            const today = new Date();
            today.setHours(0,0,0,0);

            const count = await models.User.count({
                where: { last_login: { [Op.gte]: today } }
            });

            return res.status(200).json({ activeUsers: count });
        } catch (error) {
            return res.status(500).json({ message: "Error fetching active users", error: error.message });
        }
    }

    async getNewUsers(req, res) {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            thirtyDaysAgo.setHours(0,0,0,0);

            const count = await models.User.count({
                where: { createdAt: { [Op.gte]: thirtyDaysAgo } }
            });

            return res.status(200).json({ newUsers: count });
        } catch (error) {
            return res.status(500).json({ message: "Error fetching new users", error: error.message });
        }
    }

    async getRecentUsers(req, res) {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            thirtyDaysAgo.setHours(0,0,0,0);

            const users = await models.User.findAll({
                where: { createdAt: { [Op.gte]: thirtyDaysAgo } },
                attributes: ["name"],
                order: [["createdAt", "DESC"]],
                limit: 10
            });

            return res.status(200).json({ recentUsers: users });
        } catch (error) {
            return res.status(500).json({ message: "Error fetching recent users", error: error.message });
        }
    }

    async getExperienceStatus(req, res) {
        try {
            const status = await models.Experience.findAll({
                attributes: [
                    "status",
                    [Sequelize.fn("COUNT", Sequelize.col("Experience.status")), "count"]
                ],
                group: ["Experience.status"]
            });

            return res.status(200).json({ experienceStatus: status });
        } catch (error) {
            return res.status(500).json({ message: "Error fetching experience status", error: error.message });
        }
    }

    async getPopularCategories(req, res) {
        try {
            const categories = await models.Experience.findAll({
                attributes: [
                    [Sequelize.col("Experience.category_id"), "category_id"],
                    [Sequelize.fn("COUNT", Sequelize.col("Experience.category_id")), "count"]
                ],
                include: [
                    {
                        model: models.Category,
                        as: "category",
                        attributes: ["category_id", "name"]
                    }
                ],
                group: ["Experience.category_id","category.category_id","category.name"],
                order: [[Sequelize.literal("count"), "DESC"]],
                limit: 5
            });

            return res.status(200).json({ popularCategories: categories });
        } catch (error) {
            return res.status(500).json({ message: "Error fetching popular categories", error: error.message });
        }
    }
}

module.exports = new statisticsController();