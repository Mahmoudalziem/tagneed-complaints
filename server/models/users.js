import mongoose from "mongoose";
import Joi from "joi";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true,
    },

    password: { type: String, required: true, minlength: 5, maxlength: 1024 },
    role: { type: String, required: true }
});

userSchema.methods.generateToken = function() {
    const token = jwt.sign({ _id: this._id, role: this.role, code: this.code }, process.env.JWT_KEY);
    return token;
};

const userModel = mongoose.model("users", userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().min(5).max(1024).required(),
        role: Joi.string()
            .required()
            .valid(...Object.values(role))
    });
    return schema.validate(user);
}

const role = {
    Admin: "Admin",
    Register: "Register",
    Confirm: "Confirm",
    Inquire: "Inquire"
};

export { userModel, validateUser, role };