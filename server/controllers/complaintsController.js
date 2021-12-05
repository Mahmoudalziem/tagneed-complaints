import complaintModel from '../models/complaints'
import XLSX from "xlsx";
import governorates from "./governorate.json";
import excelToJson from "convert-excel-to-json";
import Joi from 'joi'
import fs from 'fs'
import path from 'path'
import moment from 'moment'

const caclBirthday = (nationalId) => {
    const year =
        (parseInt(nationalId.slice(0, 1)) + 17) * 100 +
        parseInt(nationalId.slice(1, 3));
    const month = nationalId.slice(3, 5);
    const day = nationalId.slice(5, 7);

    return `${year}-${month}-${day}`;
};


class Complaints {

    index = async(req, res) => {

        let { page, m, d, id } = req.query;
        const pageNum = Math.max(0, Number(page));
        const pageSize = 10;

        if (id && id.length === 14) {
            return complaintModel
                .findOne({ nationalId: id })
                .then((response) => {
                    if (response) {
                        return res.json({
                            status: true,
                            data: response,
                        })
                    } else {
                        return res.json({
                            status: false,
                            message: "هذه الشكوي ليست موجودة"
                        })
                    }
                });
        } else if (m) {
            m = Number(m) ? "شكوي طبية" : "لجنة عليا";
            return complaintModel
                .find({ tagnidMedical: m })
                .limit(pageSize)
                .skip(pageSize * pageNum)
                .sort({ gover: -1 })
                .exec((err, response) => {
                    complaintModel.find({ tagnidMedical: m }).count().exec((err, count) => {
                        return res.status(201).json({
                            status: true,
                            page: pageNum,
                            data: response,
                            count: Math.ceil(count / pageSize)
                        })
                    })
                });
        } else if (d) {
            let result = d.split(',');
            return complaintModel
                .find({ tagnidDate: { $gte: result[0], $lte: result[1] } })
                .limit(pageSize)
                .skip(pageSize * pageNum)
                .sort({ gover: -1 })
                .exec((err, response) => {
                    complaintModel.find({ tagnidDate: { $gte: result[0], $lte: result[1] } }).count().exec((err, count) => {
                        return res.status(201).json({
                            status: true,
                            page: pageNum,
                            data: response,
                            count: Math.ceil(count / pageSize)
                        })
                    })
                });
        }


        complaintModel
            .find()
            .limit(pageSize)
            .skip(pageSize * pageNum)
            .sort({ gover: -1 })
            .exec((err, response) => {
                complaintModel.count().exec((err, count) => {
                    res.status(201).json({
                        status: true,
                        page: pageNum,
                        data: response,
                        count: Math.ceil(count / pageSize)
                    })
                })
            });
    };
    store = async(req, res) => {

        let diagNumber;

        delete req.body.birth;

        delete req.body.markaz;

        delete req.body.serial;

        const Schema = Joi.object({
            name: Joi.string().max(150).required(),
            tribleNum: Joi.object({
                serial: Joi.number(),
                birth: Joi.number(),
                markaz: Joi.number(),
            }),
            nationalId: Joi.string().length(14).required(),
            gover: Joi.string().required(),
            dob: Joi.string().required(),
            tagnidMedical: Joi.string().required(),
            tagnidPosition: Joi.string().required(),
            tagnidDate: Joi.string().required(),
            speci: Joi.string().required(),
        });

        diagNumber = req.body.gover === "الشرقية" ? true : false;

        const result = Schema.validate(req.body);

        complaintModel.findOne({ nationalId: req.body.nationalId }).then(success => {
            if (success) {

                let dataForm = {
                    tagnidMedical: req.body.tagnidMedical,
                    tagnidPosition: req.body.tagnidPosition,
                    tagnidDate: req.body.tagnidDate,
                    speci: req.body.speci,
                }
                return complaintModel
                    .findById(success._id)
                    .updateOne(dataForm)
                    .then(success => {
                        if (success) {
                            return res.json({
                                status: true,
                                message: 'تم تعديل الشكوي'
                            });
                        }
                    });

            }


            if (result.error) {

                return res.status(400).send(result.error.details[0].message);
            }

            req.body.created_at = new Date();

            req.body.diagNumber = diagNumber;

            const Data = new complaintModel(req.body);

            return Data.save().then((success) =>
                res.status(201).json({
                    status: true,
                    message: " تم تسجيل الشكوي بنجاح"
                }));
        })

    };

    show = async(req, res) => {
        console.log((req.params.id).split("-"))
        let tribleNum = (req.params.id).split("-");

        tribleNum = {
            birth: Number(tribleNum[0]),
            markaz: Number(tribleNum[1]),
            serial: Number(tribleNum[2])
        }

        complaintModel
            .findOne({ tribleNum: tribleNum })
            .then(response => {
                if (response) {
                    res.status(201).json({
                        status: true,
                        data: response
                    });
                } else {
                    res.json({
                        status: false,
                        message: "هذه الشكوي ليست موجودة"
                    })
                }
            })

    };

    file = async(req, res) => {

        let { file } = req.body;

        let fileData = XLSX.read(file, {
            type: "base64",
        })

        fileData = XLSX.writeFile(fileData, './x.xlsx');

        fileData = excelToJson({ sourceFile: "./x.xlsx" })

        Object.values(fileData)[0].shift();

        fileData = Object.values(fileData)[0];

        await fileData.forEach((item) => {

            let postData = {
                name: item.G,
                nationalId: item.D,
                dob: caclBirthday((item.D).toString()),
                gover: governorates[((item.D).toString()).slice(7, 9)],
                speci: "",
                tagnidMedical: "",
                tagnidPosition: "",
                diagNumber: "",
                tagnidDate: "",
                tribleNum: {
                    birth: item.M,
                    markaz: item.L,
                    serial: item.K
                }
            };

            postData.diagNumber = postData.gover === "الشرقية" ? true : false;

            complaintModel.findOne({ nationalId: item.D }).then(success => {
                if (success === null) {
                    const Data = new complaintModel(postData);
                    Data.save();
                }
            })
        });

        return res.status(201).json({
            status: true,
            message: " تم تسجيل الملف بنجاح"
        })
    }

    update = async(req, res, next) => {

        let { commissionMedical, commissionDate, image, procedures, nationalId } = req.body;

        image = image.split(',');

        let raw = Buffer.from(image[1], 'base64'),

            pa = `images/${req.body.nationalId}/${Math.floor(Math.random() * 1000000)}.jpeg`,

            dir = path.resolve('public', pa);

        if (fs.existsSync(path.resolve(`public/images/${req.body.nationalId}`))) {

            fs.rmdirSync(path.resolve(`public/images/${req.body.nationalId}`), { recursive: true });

        }

        fs.mkdir(`public/images/${req.body.nationalId}`, { recursive: true }, (err) => {

            if (err) return next(err);

            fs.writeFile(dir, raw, (err) => {

                if (err) return next(err);

            })
        })

        let newData = {
            commissionMedical: commissionMedical,
            commissionDate: commissionDate,
            image: pa,
            procedures: procedures
        }

        complaintModel
            .findOne({ nationalId: nationalId })
            .updateOne(newData).then(response => {
                if (response) {
                    return res.json({
                        status: true,
                        message: 'تم اضافة قرار الادارة '
                    });
                }
            })
    };

    destroy = async(req, res) => {

    }

    count = async(req, res) => {

        return complaintModel.find({ tagnidDate: moment(new Date()).format('YYYY-MM-DD') }).count().exec((err, count) => {
            return res.status(201).json({
                status: true,
                data: count
            })
        })
    }
}

const Complaint = new Complaints();

export default Complaint;