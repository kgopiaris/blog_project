const express = require("express");
const { Post } = require("../models/Posts");

const indexRouter = express.Router();

indexRouter.route("/").get((req, res) => {
  Post.findAll()
    .then(postsInstance => {
      const posts = postsInstance.map(instance => instance.get());
      res.render("home", {
        layout: "hero",
        posts,
        title: "Blog Home"
      });
    })
    .catch(console.error);
});

module.exports = indexRouter;
