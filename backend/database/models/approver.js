module.exports = (sequelize, DataTypes) => {
  const Approver = sequelize.define(
    "Approver",
    {
      approver_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      feedback: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "approver",
      freezeTableName: true,
      timestamps: false,
    },
  );
  Approver.associate = (models) => {
    Approver.hasMany(models.Experience, {
      foreignKey: "approver_id",
      as: "experiences",
    });
  };

  return Approver;
};
