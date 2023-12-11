const { DataTypes, Model } = require('sequelize');
const moment = require('moment');
const db = require("../services/database");

class ProductImage extends Model {}

ProductImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    imagePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY/MM/DD HH:mm');
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize: db,
    modelName: 'product_image',
    freezeTableName: true,
    tableName: 'product_image',
  }
);

module.exports = ProductImage;
