import { Sequelize } from "sequelize";
// Khởi tạo Sequelize với mysql2
const sequelize = new Sequelize("node-mysql", "root", "Nguyen", {
  host: "localhost",
  dialect: "mysql", // Sử dụng mysql (mysql2 đã được cài sẵn)
  logging: false, // Tắt logging (tuỳ chọn)
});

// Kiểm tra kết nối
const connect = async (req, res) => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

connect();
export default sequelize;
