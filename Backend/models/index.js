
import Sequelize from "sequelize";
import createUserModel from './user.js';
import createFileSystemModel from './fileSystem.js';
import { config } from "dotenv";
config();

const sequelize = new Sequelize(process.env.MYSQL_URL, {
  logging: false
});


try {
  await sequelize.authenticate();    // Check whether the connection is established or not.
  console.log('Connection with MySql has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = createUserModel(sequelize, Sequelize);
db.fileSystem = createFileSystemModel(sequelize, Sequelize);

export default db;