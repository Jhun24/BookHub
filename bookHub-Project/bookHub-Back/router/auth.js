import express from "express";
import {} from "express-async-errors";
import { body } from "express-validator";
import { validate } from "../middleware/validator.js";
import * as authContller from "../controller/auth.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

const validateCredential = [
  body("username")
    .notEmpty()
    .withMessage("username should be at least 5 characters"),
  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("password should be at least 5 characters"),
  validate,
];

const validateSignup = [
  ...validateCredential,
  body("name").notEmpty().withMessage("name is missing"),
  body("email").isEmail().normalizeEmail().withMessage("invalid email"),
  body("url")
    .isURL()
    .withMessage("invalid URL")
    .optional({ nullable: true, checkFalsy: true }),
  validate,
];

router.post("/signup", validateSignup, authContller.signup);
router.post("/login", validateCredential, authContller.login);
router.get("/me", isAuth, authContller.me);

let auth = (app)=>{
  app.get("/login",(req, res)=>{
    res.render("login.html");
  });

  app.post("/login",(req, res)=>{
      let text = "입력하신 id는 " + req.body.id + "이고, 비밀번호는 " + req.body.password + "입니다."; 
      res.send(200, text);
  });
}

export default router;
