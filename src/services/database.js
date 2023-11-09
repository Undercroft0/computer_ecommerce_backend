const { Pool } = require("pg");
const { Sequelize, DataTypes, Op } = require("sequelize");
let pool;
const sequelize = new Sequelize(
  process.env.PG_DB,
  process.env.PG_USER,
  process.env.PG_PASSWORD,

  {
    host: process.env.PG_HOST,
    dialect: "postgres",
    query: { raw: true },
    dialectOptions: {
      requestTimeout: 3000,
      useUTC: false,
    },
    timezone: "+08:00",

    pool: {
      max: 30,
      min: 0,
      acquire: 600000,
      idle: 5000,
    },
    logging: false,
  }
);

async function initialize() {
  console.log("Connecting to database");

  pool = new Pool({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DB,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
  });

  //console.log(pool)
}

async function close() {
  console.log("Database closed");
}

module.exports = sequelize;

module.exports.initialize = initialize;
module.exports.close = close;
