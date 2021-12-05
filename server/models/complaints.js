import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 150,
    },
    tribleNum: {
        birth: { type: Number, required: true },
        markaz: { type: Number, required: true },
        serial: { type: Number, required: true },
    },
    nationalId: {
        type: String,
        required: true,
        minlength: 14,
        maxlength: 14,
        unique: true,
        description: "must be an integer and is required",
    },
    gover: {
        type: String,
        description: "gover must be an string"
    },
    diagNumber: {
        type: Boolean,
        required: true
    },
    dob: {
        type: String,
        required: true,
        description: "dateBirth must be an date and is required",
    },
    tagnidMedical: {
        type: String,
        description: "decision must be an string and is required",
    },
    tagnidPosition: {
        type: String,
        description: "category must be an string and is required",
    },
    tagnidDate: {
        type: String,
        description: "Date must be an date and is required",
    },
    speci: {
        type: String,
        description: "speci must be an string and is required",
    },

    commissionMedical: {
        type: String,
        required: false,
        description: "decision must be an string and is required",
    },

    commissionDate: {
        type: String,
        description: "commissionDate must be an date and is required",
    },
    procedures: {
        type: Array,
        description: "procedures must be an array and is required",
    },
    image: {
        type: String,
        description: "image must be an string and is required",
    }
});

const complaintModel = mongoose.model('Complaints', userSchema);

export default complaintModel;