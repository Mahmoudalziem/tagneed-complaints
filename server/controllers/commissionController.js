import complaintModel from '../models/complaints'
import fs from 'fs'
import path from 'path'
import moment from 'moment'

class Commissions {

    index = async(req, res) => {

        let { page, g, d, c } = req.query;
        const pageNum = Math.max(0, Number(page));
        const pageSize = 10;

        if (c) {
            c = (c === "1" ? ("غير لائق") : ({ $in: ['لائق', 'تاجيل دورة'] }));

            return complaintModel
                .find({ commissionMedical: c })
                .limit(pageSize)
                .skip(pageSize * pageNum)
                .sort({ gover: -1 })
                .exec((err, response) => {
                    complaintModel.find({ commissionMedical: c }).count().exec((err, count) => {
                        return res.status(201).json({
                            status: true,
                            page: pageNum,
                            data: response,
                            count: count
                        })
                    })
                });
        } else if (g) {

            g = (g === "1" ? true : false);

            return complaintModel
                .find({ diagNumber: g })
                // .limit(pageSize)
                // .skip(pageSize * pageNum)
                .sort({ gover: -1 })
                .exec((err, response) => {

                    let count = 0;

                    let newData = [];

                    response.forEach(item => {
                        if (item.commissionDate) {
                            count = count + 1;
                            newData.push(item);
                        }
                    })

                    return res.status(201).json({
                        status: true,
                        page: pageNum,
                        data: newData,
                        count: count
                    })
                });
        } else if (d) {
            return complaintModel
                .find({ commissionDate: d })
                .limit(pageSize)
                .skip(pageSize * pageNum)
                .sort({ gover: -1 })
                .exec((err, response) => {
                    complaintModel.find({ commissionDate: d }).count().exec((err, count) => {
                        return res.status(201).json({
                            status: true,
                            page: pageNum,
                            data: response,
                            count: count
                        })
                    })
                });
        }

        complaintModel
            .find()
            // .limit(pageSize)
            // .skip(pageSize * pageNum)
            .sort({ gover: -1 })
            .exec((err, response) => {

                let count = 0;

                let newData = [];

                response.forEach(item => {
                    if (item.commissionDate) {
                        count = count + 1;
                        newData.push(item);
                    }
                })

                return res.status(201).json({
                    status: true,
                    page: pageNum,
                    data: newData,
                    count: count
                })
            });
    };


    show = async(req, res) => {
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
                    response.image = `http://${req.headers.host}/${response.image}`;
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

    statistics = async(req, res) => {
        const pageNum = Math.max(0, Number(req.query.page));
        const pageSize = 10;
        complaintModel
            .find()
            // .limit(pageSize)
            // .skip(pageSize * pageNum)
            .sort({ gover: -1 })
            .exec((err, response) => {

                let count = 0;

                let newData = [];

                let match = [];

                let notMatch = [];

                response.forEach(item => {
                    if (item.commissionDate) {
                        if (item.commissionMedical === "لائق" || item.commissionMedical === "تاجيل دورة") {
                            match.push(item);
                        } else if (item.commissionMedical === "غير لائق") {
                            notMatch.push(item);
                        }
                        count = count + 1;
                        newData.push(item);
                    }
                })


                let NotMatchPer = Math.ceil((notMatch.length * 100) / newData.length);

                let MatchPer = Math.floor((match.length * 100) / newData.length);

                console.log(NotMatchPer, MatchPer);

                return res.status(201).json({
                    status: true,
                    page: pageNum,
                    data: {
                        data: newData,
                        match: MatchPer,
                        notMatch: NotMatchPer
                    },
                    count: Math.ceil(count / pageSize)
                })
            });
    };

    update = async(req, res, next) => {

        let { commissionMedical, commissionDate, image, procedures, nationalId } = req.body;

        image = image.split(',');

        let raw = Buffer.from(image[1], 'base64'),

            pa = `images/${req.body.nationalId}/${Math.floor(Math.random() * 1000000)}.jpeg`,

            dir = path.resolve(pa);

        if (fs.existsSync(path.resolve(`images/${req.body.nationalId}`))) {

            fs.rmdirSync(path.resolve(`images/${req.body.nationalId}`), { recursive: true });

        }

        fs.mkdir(`images/${req.body.nationalId}`, { recursive: true }, (err) => {

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

    count = async(req, res) => {

        return complaintModel.find({ tagnidDate: moment(new Date()).format('YYYY-MM-DD') }).count().exec((err, count) => {
            return res.status(201).json({
                status: true,
                data: count
            })
        })
    }
}

const Commission = new Commissions();

export default Commission;