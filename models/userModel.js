const moongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = moongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"], // validation from backend
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      trim: true, // to remove space between email
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email address",
      ], // validate email from backend- rejex for email (search on google)
    },

    password: {
      type: String,
      required: [true, "please enter your password"],
      minLength: [6, "Password must be up to 6 characters"],
      // maxLength: [24, "PAssword must not be more than 24 characters"],
    },

    photo: {
      type: String,
      required: [true, "please enter a photo"],
      default:
        "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
    },
    phone: {
      type: String,
      default: "+92",
    },
    bio: {
      type: String,
      maxLength: [250, "Bio must not be more than 250 characters"],
      default: "Bio",
    },
  },
  {
    timestamps: true, // it stores 2 values, time of when the data has been created (createdAt_), second when data has been updated(updatedAt_)
  }
);

// encrypt password before saving to DB(Creating new user)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  // hashed password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});

// to access user Schema, user defines model name, then second parameter clears that user comes from userSchema
const User = moongoose.model("User", userSchema);

module.exports = User;
