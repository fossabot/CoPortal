import mongoose from 'mongoose';
var Schema = mongoose.Schema;

const ReportSchema = new mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: mongoose.Types.ObjectId()
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student'
    },
    lecturerId: {
        type: Schema.Types.ObjectId,
        ref: 'Lecturer'
    },
    method: {
        type: String,
        enum: ['EMAIL', 'SMS'],
        default: 'EMAIL'
    },
    message: String,
    subject: String,
    date: {
        type: Date,
        default: Date.now()
    },
    removed: {
        type: Boolean,
        default: false
    }
});

ReportSchema.methods.findSimilarTypes = function (cb) {
    return this.model('Animal').find({
        type: this.type
    }, cb);
};

const Report = mongoose.model('Report', ReportSchema);
module.exports = Report;