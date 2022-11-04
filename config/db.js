// Import mongoose
const mongoose = require("mongoose");

// Connect mongoose with MongoDB
mongoose.connect(
  `mongodb+srv://${process.env.DB_TRECK_USER_PASS}@cluster0.mib1ckm.mongodb.net/back-treck-adventure`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.once("open", () => {
  console.log("MongoDB is connected");
});
