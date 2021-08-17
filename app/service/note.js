/*
 * Purpose: Provides the business logic for each functionality
 *
 * @description
 *
 * @author: Ananya K
 * @version: 1.0.0
 * @since: 30-07-2021
 */
const noteModel = require("../models/note.js");
const logger = require("../config/loggerConfig.js");
const messages = require("../utils/messages.js");

class NoteService {
  /**
   * @description create a note
   * @param {*} noteDetails
   * @param {*} callback
   */
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

  /**
   * @description Retrieve all the notes
   * @param {*} noteDetails
   * @param {*} callback
   */
  findAllNotes = (reqParam, callback) => {
    noteModel.findAllNotes(reqParam, (err, doc) => {
      if (err) {
        logger.error("Error while finding notes", err);
        callback(err, null);
      } else {
        logger.info("Note found successfully!", doc);
        callback(null, doc);
      }
    });
  };

  /**
   * @description Retrieve note by id
   * @param {*} noteDetails
   * @param {*} callback
   */
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
  /**
   * @description update note by id
   * @param {*} noteDetails
   * @param {*} callback
   */
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
  /**
   * @description delete note by id
   * @param {*} noteDetails
   * @param {*} callback
   */
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
