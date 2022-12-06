const _ = require("lodash");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const controller = require("../controller");

module.exports = new (class extends controller {
  async createProduct(req, res) {
    try {
      const product = this.Product(_.pick(req.body, ["lenz", "bord", "photo"]));
      await product.save();
      this.response({
        res,
        message: "product added successfully",
        data: product,
      });
    } catch (error) {
      this.response({
        code: 404,
        res,
        message: "somthing went wrong",
        data: error.error,
      });
    }
  }

  async getProduct(req, res) {
    try {
      const products = await this.Product.find({});
      this.response({
        res,
        message: "successfully",
        data: products,
      });
    } catch (error) {
      this.response({
        code: 404,
        res,
        message: "somthing went wrong",
        data: error.error,
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const products = await this.Product.findByIdAndDelete(req.body.id);
      this.response({
        res,
        message: "deleted successfully",
        data: products,
      });
    } catch (error) {
      this.response({
        code: 404,
        res,
        message: "somthing went wrong",
        data: error.error,
      });
    }
  }

  async editProduct(req, res) {
    try {
      const products = await this.Product.findByIdAndUpdate(req.body.id, {
        bord: req.body.bord,
        lenz: req.body.lenz,
        photo: req.body.photo,
      });
      this.response({
        res,
        message: "updated successfully",
        data: products,
      });
    } catch (error) {
      this.response({
        code: 404,
        res,
        message: "somthing went wrong",
        data: error.error,
      });
    }
  }

  async uploadProductImage(req, res) {
    const data = {
      src: "asset/images/products/" + req.productName,
    };
    this.response({
      res,
      message: "updated successfully",
      data,
    });
  }
})();
