const _ = require("lodash");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const controller = require("../controller");

module.exports = new (class extends controller {
  async createProduct(req, res) {
    const features = JSON.stringify(req.body.features);
    try {
      const product = this.Product(
        _.pick(req.body, [
          "priceForUser",
          "photo",
          "model",
          "price",
          "exist",
          "priceForWorkmate",
          "warranty",
          "numberOf",
          "numberOfExist",
          "deliveryMethod",
        ])
      );
      product.features = features;
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

  async getProducts(req, res) {
    try {
      const products = await this.Product.find({});
      const finalProducts = products.map((item) => {
        let features = null;
        if (item?.features) {
          features = JSON.parse(item?.features);
        }

        const item2 = {
          ...item._doc,
          features,
        };
        return {
          ...item2,
        };
      });
      this.response({
        res,
        message: "successfully",
        data: finalProducts,
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
      const id = req.params.id;
      const product = await this.Product.findById(id);
      let features = null;
      if (product?.features) {
        features = JSON.parse(product?.features);
      }
      product._doc.features = features;

      this.response({
        res,
        message: "successfully",
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
      const data = _.pick(req.body, [
        "priceForUser",
        "photo",
        "model",
        "price",
        "exist",
        "priceForWorkmate",
        "warranty",
        "features",
        "numberOfExist",
        "deliveryMethod",
      ]);
      let features = null;
      if (data?.features) {
        features = JSON.stringify(data?.features);
      }
      data.features = features;
      const product = await this.Product.findByIdAndUpdate(req.body.id, data);
      console.log(product);
      this.response({
        res,
        message: "updated successfully",
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
