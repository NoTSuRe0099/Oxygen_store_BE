const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

exports.Register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const user = await User.findOne({ email });

        if (user) {
            return res
                .status(401)
                .json({ success: false, message: "Email already registered" });
        }
        // const avatar = await req.files.avatar;

        // await cloudinary.uploader.upload(
        //     avatar.tempFilePath,
        //     {
        //         folder: "E-Commerce-MERN",
        //     },
        //     (err, result) => {

        //     }
        // );

        const newUser = new User({
            username,
            email,
            password,
            avatar: "avatar.png",
        });
        User.create(newUser)
            .then((user) => {
                res.json({
                    status: "success",
                    data: user,
                });
            })
            .catch((error) => {
                res.json({
                    status: "error",
                    message: error.message,
                });
            });
    } catch (error) {
        console.log(error);
    }
};

exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.json({
                status: "error",
                message: "Email not found",
            });
        }
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }
        const token = await user.generateToken();
        const options = {
            expires: new Date(Date.now() + 30 * 60 * 1000),
            httpOnly: true,
        };
        res.status(200).cookie("token", token, options).json({
            success: true,
            message: "Logged in successfully",
            token,
        });
    } catch (error) {
        console.log(error);
    }
};

exports.myProfile = async (req, res) => {
    try {
        const id = req.id;
        const user = await User.findById(id);
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error,
        });
    }
};
