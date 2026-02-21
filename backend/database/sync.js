require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  define: {
    freezeTableName: true,
  },
});

const User = require('./models/user')(sequelize, Sequelize.DataTypes);
const Approver = require('./models/approver')(sequelize, Sequelize.DataTypes);
const Reflection = require('./models/reflection')(sequelize, Sequelize.DataTypes);
const Category = require('./models/category')(sequelize, Sequelize.DataTypes);
const Experience = require('./models/experience')(sequelize, Sequelize.DataTypes);
const Proof = require('./models/proof')(sequelize, Sequelize.DataTypes);


if (require.main === module) {
  sequelize.sync({ force: true }).then(() => {
    console.log('Tables created!');
    process.exit();
  });
}

module.exports = { sequelize, models: sequelize.models };