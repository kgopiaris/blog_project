const express = require("express");
const { User } = require("../models/Users");
const { compareHash } = require("../utils/hash");
const {
  userTokenGenerator,
  userTokenValidator
} = require("../utils/userTokenManager");
const userAuth = require("../middlewares/userAuth");
const userRouter = express.Router();

userRouter
  .route("/login")
  .get((req, res) => {
    const { jwt = "" } = req.cookies;
    const user = userTokenValidator(jwt);
    if (user) {
      res.redirect("/");
    } else {
      res.render("login-form", {
        layout: "login"
      });
    }
  })
  .post((req, res) => {
    const { email = "", password = "" } = req.body;
    User.findOne({
      where: {
        email
      }
    })
      .then(userInstance => {
        if (userInstance) {
          const user = userInstance.get();
          const {
            id = "",
            email: emailFromDb = "",
            firstName = "",
            lastName = "",
            password: passwordFromDB = ""
          } = user;
          compareHash(password, passwordFromDB)
            .then(isSuccess => {
              if (isSuccess) {
                const jwtToken = userTokenGenerator({
                  id,
                  email: emailFromDb,
                  firstName,
                  lastName
                });
                res.cookie("jwt", jwtToken, { httpOnly: true });
                res.status(200).send("Logged in");
              } else {
                res.status(400).send("No user found");
              }
            })
            .catch(error => {
              console.error(error);
              res.status(500).send("Internal Server Error");
            });
        } else {
          res.status(400).send("No user found");
        }
      })
      .catch(console.error);
  });

userRouter.route("/profile").get(userAuth, (req, res) => {
  res.send(req.user.firstName + "'s profile");
});

userRouter.route("/logout").get(userAuth, (req, res) => {
  console.log("hello....");
  res.clearCookie("jwt");
  res.redirect("/");
});

module.exports = userRouter;
