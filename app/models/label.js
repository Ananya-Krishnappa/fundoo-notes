const mongoose = require("mongoose");
const logger = require("../config/loggerConfig.js");
const LabelSchema = mongoose.Schema(
  {
    noteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    },
    labelName: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Label = mongoose.model("Label", LabelSchema);

class LabelModel {
  createLabel = (label) => {
    const newLabel = new Label({
      labelName: label.labelName,
      isActive: label.isActive || true,
      noteId: label.noteId,
    });
    return newLabel
      .save()
      .then((label) => {
        logger.info("Label saved successfully", label);
        return label;
      })
      .catch((err) => {
        logger.error("Error while saving the new label", err);
        throw err;
      });
  };

  findAllLabel = (noteId) => {
    return Label.find({ noteId: noteId })
      .then((labels) => {
        logger.info("Labels found successfully", labels);
        return labels;
      })
      .catch((error) => {
        logger.error("Error while finding the labels", error);
        throw error;
      });
  };

  updateLabelById = (labelId, label) => {
    return Label.findByIdAndUpdate(labelId, label, {
      new: true,
    })
      .then((label) => {
        logger.info("Label updated successfully", label);
        return label;
      })
      .catch((error) => {
        logger.error("Error while updating the label by id", error);
        throw error;
      });
  };
}
module.exports = new LabelModel();
