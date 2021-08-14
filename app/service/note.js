const noteModel = require("../models/note.js");
const logger = require("../config/loggerConfig.js");
const messages = require("../utils/messages.js");

class NoteService {
  createNote = (note, callback) => {
    noteModel.createNote(note, (err, doc) => {
      if (err) {
        logger.error("Error while creating the new note", err);
        callback(err, null);
      } else {
        logger.info("Note created successfully!", doc);
        callback(null, doc);
      }
    });
  };

  findAllNotes = (callback) => {
    noteModel.findAllNotes((err, doc) => {
      if (err) {
        logger.error("Error while finding notes", err);
        callback(err, null);
      } else {
        logger.info("Note found successfully!", doc);
        callback(null, doc);
      }
    });
  };

  findNoteById = (noteId, callback) => {
    noteModel.findNoteById(noteId, (err, doc) => {
      if (err) {
        logger.error("Error while finding note by id", err);
        callback(err, null);
      } else {
        logger.info("Note found successfully!", doc);
        callback(null, doc);
      }
    });
  };

  updateNoteById = (noteId, note, callback) => {
    noteModel.updateNoteById(noteId, note, (err, doc) => {
      if (err) {
        logger.error("Error while updating note by id", err);
        callback(err, null);
      } else {
        logger.info("Note updated successfully!", doc);
        callback(null, doc);
      }
    });
  };

  deleteNoteById = (noteId, callback) => {
    noteModel.deleteNoteById(noteId, (err, doc) => {
      if (err) {
        logger.error("Error while deleting note by id", err);
        callback(err, null);
      } else {
        if (doc === null) {
          logger.info(messages.NOTE_NOT_FOUND);
          callback(messages.NOTE_NOT_FOUND, null);
        }
        logger.info("Note deleted successfully!", doc);
        callback(null, doc);
      }
    });
  };
}
module.exports = new NoteService();
