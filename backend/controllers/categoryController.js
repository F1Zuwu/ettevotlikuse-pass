const { models } = require("../database");
const BaseController = require("./BaseController");

class categoryController extends BaseController {
    constructor() {
        super();
        this.addCategory = this.addCategory.bind(this);
        this.getCategory = this.getCategory.bind(this);
        this.updateCategory = this.updateCategory.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);

        this.getAllCategories = this.getAllCategories.bind(this);
    }

    async addCategory(req, res) {
        try {
            if (!req.body || !req.body.name) {
                return res.status(400).json({ message: "Category name is required" });
            }

            const { name } = req.body;

            const category = await models.Category.create({ name });

            return res.status(201).json({
                message: "Category created successfully",
                data: category,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error creating category",
                error: error.message,
            });
        }
    }

    async getCategory(req, res) {
        try {
            const { id } = req.params;

            const category = await models.Category.findByPk(id, {
            });

            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            return res.status(200).json(category);
        } catch (error) {
            return res.status(500).json({
                message: "Error fetching category",
                error: error.message,
            });
        }
    }

    async getAllCategories(req, res) {
        try {
            const categories = await models.Category.findAll({
            });

            return res.status(200).json(categories);
        } catch (error) {
            return res.status(500).json({
                message: "Error fetching categories",
                error: error.message,
            });
        }
    }

    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            const category = await models.Category.findByPk(id);

            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            await category.update({
                name: name ?? category.name,
            });

            return res.status(200).json({
                message: "Category updated successfully",
                data: category,
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error updating category",
                error: error.message,
            });
        }
    }

    async deleteCategory(req, res) {
        try {
            const { id } = req.params;

            const category = await models.Category.findByPk(id);

            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            await category.destroy();

            return res.status(200).json({
                message: "Category deleted successfully",
            });
        } catch (error) {
            return res.status(500).json({
                message: "Error deleting category",
                error: error.message,
            });
        }
    }
}
module.exports = new categoryController();