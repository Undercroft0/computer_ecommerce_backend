const { DataTypes, Model } = require('sequelize');
const moment = require('moment');
const Product = require('./product');
const db = require("../services/database");

class ProductRating extends Model {}

ProductRating.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    modelName: 'ProductRating', 
    freezeTableName: true, 
  }
);


ProductRating.belongsTo(Product, {
  foreignKey: 'productId',
  targetKey: 'id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

module.exports = ProductRating;
