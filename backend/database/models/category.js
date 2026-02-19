module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "Category",
    {
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      tableName: "category",
      freezeTableName: true,
      timestamps: false,
    },
  );
  Category.associate = (models) => {
    Category.hasMany(models.Experience, {
      foreignKey: "category_id",
      as: "experiences",
    });
  };

  return Category;
};
