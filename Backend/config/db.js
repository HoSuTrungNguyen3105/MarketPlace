import mysql from "mysql2/promise";

const mysqlpool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Nguyen",
  database: "node-mysql",
});
export default mysqlpool;
