const User = require("../models/user");

exports.all = async (req, res, next) => {
  try {
    // Get all users sorted by name
    const users = await User.find()
      .select(["-email", "-active", "-__v"])
      .sort({ name: 1 })
      .exec();

    // Return response
    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });
  } catch (err) {
    next(err);
  }
};
