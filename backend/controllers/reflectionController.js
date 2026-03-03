const { models } = require("../database");
const BaseController = require("./BaseController");

class reflectionController extends BaseController {
    constructor() {
        super();
        this.addReflection = this.addReflection.bind(this);
        this.getReflection = this.getReflection.bind(this);
        this.updateReflection = this.updateReflection.bind(this);
        this.deleteReflection = this.deleteReflection.bind(this);

        this.getAllReflections = this.getAllReflections.bind(this);
    }

    async addReflection(req, res) {
        try {
            if (!req.body || !req.body.question) {
                return res.status(400).json({ message: "Reflection question is required" });
            }

            const { question } = req.body;

            const reflection = await models.Reflection.create({ question });

            return res.status(201).json({
                message: "Reflection question created successfully",
                data: reflection,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error creating reflection question",
                error: error.message,
            });
        }
    }

    async getReflection(req, res) {
        try {
            const { id } = req.params;

            const reflection = await models.Reflection.findByPk(id, {
            });

            if (!reflection) {
                return res.status(404).json({ message: "Reflection question not found" });
            }

            return res.status(200).json(reflection);
        } catch (error) {
            return res.status(500).json({
                message: "Error fetching reflection question",
                error: error.message,
            });
        }
    }

    async getAllReflections(req, res) {
        try {
            const reflections = await models.Reflection.findAll({
            });

            return res.status(200).json(reflections);
        } catch (error) {
            return res.status(500).json({
                message: "Error fetching reflection questions",
                error: error.message,
            });
        }
    }

    async updateReflection(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            const reflection = await models.Reflection.findByPk(id);

            if (!reflection) {
                return res.status(404).json({ message: "Reflection question not found" });
            }

            await reflection.update({
                name: name ?? reflection.name,
            });

            return res.status(200).json({
                message: "Reflection question updated successfully",
                data: reflection,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error updating reflection question",
                error: error.message,
            });
        }
    }

    async deleteReflection(req, res) {
        try {
            const { id } = req.params;

            const reflection = await models.Reflection.findByPk(id);

            if (!reflection) {
                return res.status(404).json({ message: "Reflection question not found" });
            }

            await reflection.destroy();

            return res.status(200).json({
                message: "Reflection question deleted successfully",
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error deleting reflection question",
                error: error.message,
            });
        }
    }
}
module.exports = new reflectionController();