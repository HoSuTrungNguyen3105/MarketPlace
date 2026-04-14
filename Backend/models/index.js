import sequelize from "../config/db.js";

import { Sequelize, DataTypes } from "sequelize";
import userModel from "./userModel.js";
import postModel from "./postModel.js";

const sequelize_db = new Sequelize(
  sequelize.database,
  sequelize.user,
  sequelize.password,
  {
    host: sequelize.host,
    dialect: sequelize.dialect,
    operatorsAliases: false,

    // pool: {
    //   max: sequelize.pool.max,
    //   min: sequelize.pool.min,
    //   acquire: sequelize.pool.acquire,
    //   idle: sequelize.pool.idle,
    // },
  }
);

sequelize_db
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

export default sequelize_db;
