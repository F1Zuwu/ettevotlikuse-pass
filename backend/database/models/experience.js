module.exports = (sequelize, DataTypes) => {
  const Experience = sequelize.define(
    "Experience",
    {
      experience_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      reflectionanswer: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          "ootel",
          "kinnitatud",
          "tagasi lükatud",
          "mustand",
        ),
        allowNull: false,
      },
    },
    {
      tableName: "experience",
      freezeTableName: true,
      timestamps: true,
    },
  );

  Experience.associate = (models) => {
    Experience.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });

    Experience.belongsTo(models.Approver, {
      foreignKey: "approver_id",
      as: "approver",
      allowNull: true,
    });

    Experience.hasMany(models.Proof, {
      foreignKey: "experience_id",
      as: "proofs",
      onDelete: "CASCADE",
    });

    Experience.belongsTo(models.Reflection, {
      foreignKey: "reflection_id",
      as: "reflection",
    });

    Experience.belongsTo(models.Category, {
      foreignKey: "category_id",
      as: "category",
    });
  };

  return Experience;
};
