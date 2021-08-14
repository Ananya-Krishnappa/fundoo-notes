const mongoose = require("mongoose");
const logger = require("../config/loggerConfig.js");
const NoteSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    isPinned: Boolean,
    isArchived: Boolean,
    isTrashed: Boolean,
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model("Note", NoteSchema);

class NoteModel {
  createNote = (note, callback) => {
    const newNote = new Note({
      title: note.title,
      description: note.description,
      isPinned: note.isPinned || false,
      isArchived: false,
      isTrashed: false,
    });
    newNote.save((err, doc) => {
      if (err) {
        logger.error("Error while saving the new note", err);
        callback(err, null);
      } else {
        logger.info("UserNote saved successfully", doc);
        callback(null, doc);
      }
    });
  };

  findAllNotes = (callback) => {
    Note.find((err, doc) => {
      if (err) {
        logger.error("Error while finding the notes", err);
        callback(err, null);
      } else {
        logger.info("Note found successfully", doc);
        callback(null, doc);
      }
    });
  };

  findNoteById = (noteId, callback) => {
    Note.findById(noteId, (err, doc) => {
      if (err) {
        logger.error("Error while finding the note by id", err);
        callback(err, null);
      } else {
        logger.info("Note found successfully", doc);
        callback(null, doc);
      }
    });
  };

  updateNoteById = (noteId, note, callback) => {
    Note.findByIdAndUpdate(
      noteId,
      note,
      {
        new: true,
      },
      (err, doc) => {
        if (err) {
          logger.error("Error while updating the note by id", err);
          callback(err, null);
        } else {
          logger.info("Note updated successfully", doc);
          callback(null, doc);
        }
      }
    );
  };

  deleteNoteById = (noteId, callback) => {
    Note.findByIdAndRemove(noteId, (err, doc) => {
      if (err) {
        logger.error("Error while deleting the note by id", err);
        callback(err, null);
      } else {
        logger.info("Note deleted successfully", doc);
        callback(null, doc);
      }
    });
  };
}
module.exports = new NoteModel();
