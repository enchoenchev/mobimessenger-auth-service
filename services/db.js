const mongoose = require("mongoose");

/**
 * Connect to DB
 */
exports.connect = () => {
  if (process.env.DB_CONNECTION !== "mongodb") {
    console.error("Invalid DB driver `" + process.env.DB_CONNECTION + "`!");
    process.exit(1);
  }
  const databaseUri =
    "{CONNECTION}://{USER}:{PASSWORD}@{HOST}:{PORT}/{AUTH_DB}?authMechanism=DEFAULT"
      .replace("{CONNECTION}", process.env.DB_CONNECTION)
      .replace("{USER}", process.env.DB_USER)
      .replace("{PASSWORD}", process.env.DB_PASSWORD)
      .replace("{HOST}", process.env.DB_HOST)
      .replace("{PORT}", process.env.DB_PORT)
      .replace("{AUTH_DB}", process.env.DB_AUTH_DATABASE);

  mongoose
    .connect(databaseUri, {
      dbName: process.env.DB_DATABASE,
    })
    .then((con) => {
      console.log("DB connected successfully!");
    })
    .catch((err) => {
      console.error(err, "There was an error when connecting to DB.");
      process.exit(1);
    });
};

/**
 * Close connection to DB
 */
exports.disconnect = () => {
  if (mongoose.connection) {
    mongoose.connection
      .close()
      .then(() => {
        console.log("DB connection closed.");
      })
      .catch((err) => {
        console.error(
          err,
          "There was an error when closing the connection to DB."
        );
      });
  } else {
    console.log("No DB connection to close!");
  }
};
