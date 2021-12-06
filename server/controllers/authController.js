import bcrypt from 'bcrypt'
import { userModel, validateUser } from "../models/users";
import _ from "lodash";

const Index = async(req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.send(error.details[0].message);
    let user = await userModel.findOne({ name: req.body.name });

    // check if already registered user
    if (user) return res.send("User already registerd!");
    user = new userModel(_.pick(req.body, ["name", "password", "role"]));
    // decrypting password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // saving to db and sendig response
    await user.save();

    const token = user.generateToken();
    res
        .header("x-auth-token", token)
        .send(_.pick(user, ["_id", "name", "role"]));
    // res.send({ "accessToken": token });};
}

const Login = async(req, res) => {

    let user = await userModel.findOne({ name: req.body.name });
    if (!user) return res.send({
        message: "خطا بكلمة السر او اسم المستخدم",
        status: false
    });

    const isCorrectPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );
    if (!isCorrectPassword)
        return res.send({
            message: "خطا بكلمة السر او اسم المستخدم",
            status: false
        });

    const token = user.generateToken();

    res.send({
        message: "تم التسجيل بنجاح",
        status: true,
        data: token
    });
};

export { Index, Login };