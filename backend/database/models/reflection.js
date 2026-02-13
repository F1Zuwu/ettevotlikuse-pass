module.exports = (sequelize, DataTypes) => {
    const Reflection = sequelize.define('Reflection', {
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

        });
    return Reflection;
};