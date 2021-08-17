const mongoose = require("mongoose");
const logger = require("../config/loggerConfig.js");
const NoteSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserRegister",
    },
    title: String,
    description: String,
    isPinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isTrashed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Note = mongoose.model("Note", NoteSchema);

class NoteModel {
  createNote = (note) => {
    const newNote = new Note({
      title: note.title,
      description: note.description,
      isPinned: note.isPinned || false,
      isArchived: false,
      isTrashed: false,
      userId: note.userId,
    });
    return newNote
      .save()
      .then((note) => {
        logger.info("UserNote saved successfully", note);
        return note;
      })
      .catch((err) => {
        logger.error("Error while saving the new note", err);
        throw err;
      });
  };

  findAllNotes = (reqParam) => {
    return Note.find({ isTrashed: reqParam.isTrashed, isArchived: reqParam.isArchived, userId: reqParam.userId })
      .then((notes) => {
        logger.info("Notes found successfully", notes);
        return notes;
      })
      .catch((error) => {
        logger.error("Error while finding the notes", error);
        throw error;
      });
  };

  findNoteById = (noteId) => {
    return Note.findById(noteId)
      .then((note) => {
        logger.info("Note found successfully", note);
        return note;
      })
      .catch((error) => {
        logger.error("Error while finding the note by id", error);
        throw error;
      });
  };

  updateNoteById = (noteId, note) => {
    return Note.findByIdAndUpdate(noteId, note, {
      new: true,
    })
      .then((note) => {
        logger.info("Note updated successfully", note);
        return note;
      })
      .catch((err) => {
        logger.error("Error while updating the note by id", err);
        throw err;
      });
  };

  deleteNoteById = (noteId) => {
    return Note.findByIdAndRemove(noteId)
      .then((note) => {
        logger.info("Note deleted successfully", note);
        return note;
      })
      .catch((error) => {
        logger.error("Error while deleting the note by id", error);
        throw error;
      });
  };
}
module.exports = new NoteModel();
