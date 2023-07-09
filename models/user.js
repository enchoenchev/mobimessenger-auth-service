const mongoose = require("mongoose");
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");
const cryptService = require("../services/crypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    index: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Invalid email address."],
    uniqueCaseInsensitive: true,
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minLength: [8, "Password must be at least 8 characters long."],
    validate: [
      validator.isStrongPassword,
      "Password should contain at least one lowercase, one uppercase, one number and one special character.",
    ],
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

userSchema.plugin(uniqueValidator, { message: "The {PATH} is already taken." });

userSchema.methods.isValidPassword = async function (password) {
  if (!this.password) {
    return false;
  }

  return await cryptService.verify(password, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await cryptService.encrypt(this.password);

  next();
});

module.exports = mongoose.model("User", userSchema);
