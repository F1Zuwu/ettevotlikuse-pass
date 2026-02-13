module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
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
            tableName: 'category',
            freezeTableName: true,
            timeStamps: false,
        },
    );
    return Category;
}