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
  createNote = (note) => {
    return new Promise(function (resolve, reject) {
      try {
        noteModel
          .createNote(note)
          .then((note) => {
            logger.info("Note created successfully!", note);
            resolve(note);
          })
          .catch((error) => {
            logger.error("Error while creating the new note", error);
            reject(error);
          });
      } catch (err) {
        logger.error("Error while creating the new note", err);
        reject(err);
      }
    });
  };

  /**
   * @description Retrieve all the notes
   * @param {*} noteDetails
   * @param {*} callback
   */
  findAllNotes = (reqParam) => {
    return new Promise(function (resolve, reject) {
      try {
        noteModel
          .findAllNotes(reqParam)
          .then((notes) => {
            logger.info("Notes found successfully!", notes);
            resolve(notes);
          })
          .catch((error) => {
            logger.error("Error while finding the notes", error);
            reject(error);
          });
      } catch (err) {
        logger.error("Error while finding the notes", error);
        reject(error);
      }
    });
  };

  /**
   * @description Retrieve note by id
   * @param {*} noteDetails
   * @param {*} callback
   */
  findNoteById = (noteId) => {
    return new Promise(function (resolve, reject) {
      try {
        noteModel
          .findNoteById(noteId)
          .then((note) => {
            logger.info("Note found successfully!", note);
            resolve(note);
          })
          .catch((error) => {
            logger.error("Error while finding note by id", error);
            reject(error);
          });
      } catch (err) {
        logger.error("Error while finding note by id", err);
        reject(err);
      }
    });
  };
  /**
   * @description update note by id
   * @param {*} noteDetails
   * @param {*} callback
   */
  updateNoteById = (noteId, note) => {
    return new Promise(function (resolve, reject) {
      try {
        noteModel
          .updateNoteById(noteId, note)
          .then((note) => {
            logger.info("Note updated successfully!", note);
            resolve(note);
          })
          .catch((err) => {
            logger.error("Error while updating note by id", err);
            reject(err);
          });
      } catch (error) {
        logger.error("Error while updating note by id", error);
        reject(error);
      }
    });
  };

  /**
   * @description delete note by id
   * @param {*} noteDetails
   * @param {*} callback
   */
  deleteNoteById = (noteId) => {
    return new Promise(function (resolve, reject) {
      try {
        noteModel
          .deleteNoteById(noteId)
          .then((note) => {
            logger.info("Note deleted successfully!", note);
            resolve(note);
          })
          .catch((error) => {
            logger.error("Error while deleting note by id", error);
            reject(error);
          });
      } catch (err) {
        logger.error("Error while deleting note by id", err);
        reject(err);
      }
    });
  };
}
module.exports = new NoteService();
