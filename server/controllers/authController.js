import Joi from 'joi'
import UsersModel from '../models/complaints'
import bcrypt from 'bcrypt'


const index = async(req, res) => {

    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    })

    const result = schema.validate(req.body);

    if (result.error) {

        return res.status(400).send(result.error.details[0].message);

    }

    const Data = new UsersModel(req.body);

    const salt = await bcrypt.genSalt(10);

    Data.password = await bcrypt.hash(Data.password, salt);

    return Data.save().then((success) => res.status(201).send(success));

    // return res.render('index', { name: "Mahmoud Abd Alziem" });
};
const user = async(req, res) => {

    return res.render('user', { name: "ahmed reda hamza" });
};

const Login = async(req, res) => {

    const User = await UsersModel.findOne({ email: req.body.email });

    if (User) {

        // return res.status(201).json(req.body.password);

        const ValidatePasword = await bcrypt.compare(req.body.password, User.password);

        // return res.status(201).json(ValidatePasword);

        if (ValidatePasword) {

            res.status(200).json({ message: "Success Login" });

        } else {

            res.status(400).json({ error: "Invalid Email Or Password" });
        }
    } else {
        res.status(401).json({ error: "User does not exist" });

    }
};

export { index, user, Login };