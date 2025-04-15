const Report = require('../models/Report');
const Comment = require('../models/Comment');
const User = require('../models/User');
const Prompt = require('../models/Prompt');


// Submit a report
const reportContent = async (req, res) => {
    try {
        const { targetId, targetType, reason } = req.body;
        const reportedBy = req?.user?.id;

        if (!['prompt', 'comment'].includes(targetType)) {
            return res.status(400).json({ message: 'Invalid report type' });
        }

        // Check if a report already exists for this target
        let existingReport = await Report.findOne({ targetId, targetType });

        if (existingReport) {
            // Prevent duplicate reports from the same user
            const alreadyReported = existingReport.reportedBy.includes(reportedBy);
            if (alreadyReported) {
                return res.status(400).json({ message: 'You have already reported this item' });
            }

            // Append user and reason
            existingReport.reportedBy.push(reportedBy);
            existingReport.reason.push(reason);
            existingReport.reportCount += 1;

            await existingReport.save();
            return res.status(200).json({ message: 'Report updated successfully' });
        } else {
            // Create a new report
            const newReport = new Report({
                targetId,
                targetType,
                reportedBy: [reportedBy],
                reason: [reason],
                reportCount: 1
            });

            await newReport.save();
            return res.status(201).json({ message: 'Report submitted successfully' });
        }
    } catch (error) {
        console.error('Error submitting report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all reports (for moderators/admins)
const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('reportedBy', 'username email');

        res.status(200).json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Delete a reported item
const deleteReportedItem = async (req, res) => {
    try {
        const { targetId, targetType, _id } = req.body;
        let contentUserId = null;

        if (targetType === 'prompt') {
            const prompt = await Prompt.findById(targetId);
            if (!prompt) return res.status(404).json({ message: 'Prompt not found' });
            contentUserId = prompt.user;
            await Prompt.findByIdAndDelete(targetId);
        } else if (targetType === 'comment') {
            const comment = await Comment.findById(targetId);
            console.log(comment);
            // if (!comment) return res.status(404).json({ message: 'Comment not found' });
            console.log(comment.user);
            contentUserId = comment.user;
            await Comment.findByIdAndDelete(targetId);
        } else {
            return res.status(400).json({ message: 'Invalid content type' });
        }
        // Increment flag count
        if (contentUserId) {
            await User.findByIdAndUpdate(contentUserId, { $inc: { flagCount: 1 } });
        }

        await Report.findByIdAndDelete( _id );
        res.status(200).json({ message: 'Reported content deleted and user flagged successfully' });
    } catch (error) {
        console.error('Error deleting reported content:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const approveReportedItem = async (req, res) => {
    try {
      const { targetId } = req.body;
  
      // Delete all reports for the target item (prompt or comment)
      await Report.deleteMany({ targetId });
  
      res.status(200).json({ message: 'Reports removed. Item approved.' });
    } catch (error) {
      console.error('Error approving content:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  



module.exports = { reportContent, getAllReports, deleteReportedItem, approveReportedItem };
