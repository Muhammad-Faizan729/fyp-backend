const asyncHandler = require("express-async-handler"); // install this package and use. After that you dont have to use TRY-Catch . this makes our code looks pretty and good.
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// function for creating JWT token, it takes 3 parameters 1. user id(database wali) 2.JWT_secret(present in env) 3.date to be expire
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register Controller
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Fill In All Required Fields");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be atleast 6 Characters");
  }

  // check if user email already exist
  const userExists = await User.findOne({ email }); // here email is put from req.body, and checking this email with email present in database
  if (userExists) {
    res.status(400);
    throw new Error("User Already Exists ");
  }

  // encrypt password before saving to DB(Creating new user)  =====>>>> we have done on UserModel
  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(password, salt); // it takes two parameters, one is password which is to be hashed, and second salt ..this is only two lines of code that's it

  // Create new user in database
  // For creating new user, what information you want to store in database.here we want to store name, email, password
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate Token calling when user created
  const token = generateToken(user._id);

  // send HTTP-only cookie // storing  user login-logout states //// 3-parameter...1.Name of cookie(here is token) 2.create cookie on the bases of what(here we have create on the basis of token) 3. path, secure, expire etc
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true,
  });

  // we have to get information of user created in database
  if (user) {
    const { _id, name, email, photo, phone, bio } = user; // here we de-structure the user info
    res.status(201).json({
      _id,
      name,
      email,
      password,
      phone,
      photo,
      bio,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Login Controller

const LoginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // validate request

  if (!email || !password) {
    res.status(400);
    throw new Error("Please add email and password");
  }

  // user exist or not
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("user not found, please signup");
  }

  // user exist, check if password is correct
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (user || passwordIsCorrect) {
    const { _id, name, email, photo, phone, bio } = user; // here we de-structure the user info
    res.status(201).json({
      _id,
      name,
      email,
      password,
      phone,
      photo,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

module.exports = {
  registerUser,
  LoginUser,
};
