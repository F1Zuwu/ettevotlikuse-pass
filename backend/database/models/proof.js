const experience = require("./experience");

module.exports = (sequelize, DataTypes) => {
  const Proof = sequelize.define(
    "Proof",
    {
      proof_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      proof_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      experience_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "experience",
          key: "experience_id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "proof",
      freezeTableName: true,
      timestamps: false,
    },
  );

  Proof.associate = (models) => {
    Proof.belongsTo(models.Experience, {
      foreignKey: {
        name: "experience_id",
      },
      as: "experience",
    });
  };

  return Proof;
};
