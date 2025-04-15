const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true }, // ID of the reported prompt or comment
    targetType: { type: String, enum: ['prompt', 'comment'], required: true },
    reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    reason: [{ type: String, required: true }],
    reportCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Report', ReportSchema);
