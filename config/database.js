const mongoose = require("mongoose");

const ConnectDB = () => {
    mongoose
        .connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => console.log("DB Connected! ✅"))
        .catch((err) => {
            console.log(err);
        });
};

module.exports = ConnectDB;
