import mysqlpool from "../config/db.js";

import { Sequelize, DataTypes } from "sequelize";
import userModel from "./userModel.js";
import postModel from "./postModel.js";

const sequelize = new Sequelize(
  mysqlpool.database,
  mysqlpool.user,
  mysqlpool.password,
  {
    host: mysqlpool.host,
    dialect: mysqlpool.dialect,
    operatorsAliases: false,

    pool: {
      max: mysqlpool.pool.max,
      min: mysqlpool.pool.min,
      acquire: mysqlpool.pool.acquire,
      idle: mysqlpool.pool.idle,
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("connected..");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Khởi tạo models
db.users = userModel(sequelize, DataTypes);
db.posts = postModel(sequelize, DataTypes);

// Thiết lập mối quan hệ 1-nhiều giữa products và reviews
db.users.hasMany(db.posts, {
  foreignKey: "user_id",
  as: "post", // Tên alias sửa lại cho thống nhất (plural)
});

db.posts.belongsTo(db.products, {
  foreignKey: "user_id",
  as: "user",
});

// Đồng bộ hóa models với cơ sở dữ liệu
(async () => {
  try {
    await sequelize.sync({ force: false });
    console.log("Database synchronized successfully!");
  } catch (error) {
    console.error("Failed to synchronize the database:", error);
  }
})();

export default db;
