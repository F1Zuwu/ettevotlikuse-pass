module.exports = (sequelize, DataTypes) => {
  const Reflection = sequelize.define(
    "Reflection",
    {
      reflection_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      question: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "reflection",
      freezeTableName: true,
      timestamps: false,
    },
  );

  Reflection.associate = (models) => {
    Reflection.hasMany(models.Experience, {
      foreignKey: "reflection_id",
      as: "experiences",
    });
  };

  return Reflection;
};
