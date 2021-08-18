/*
 * Purpose: Provides implementation for the mapped request and forwards the request to the service layer.
 * Also, returns the response to the client
 * @description
 *
 * @author: Ananya K
 * @version: 1.0.0
 * @since: 14-08-2021
 */
const service = require("../service/note.js");
const logger = require("../config/loggerConfig.js");
const messages = require("../utils/messages.js");
const {
  validateCreateNote,
  validateDeleteNote,
  validatePinNote,
  validateArchiveNote,
} = require("../utils/validation.js");

class NoteController {
  /**
   * @description create and save note
   * @param {*} request from client
   * @param {*} response to client
   */
  create = (req, res) => {
    try {
      if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        logger.error(
          "Invalid Params. Usage: { 'title': '<title>','description': '<description>', 'userId': '<userId>'"
        );
        return res.status(400).json({
          message:
            "Invalid Params. Usage: { " +
            "'title': '<title>'," +
            "'description': '<description>', 'userId': '<userId>'",
        });
      }
      const { error, value } = validateCreateNote.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }
      // Create a Note
      const note = {
        title: req.body.title || "Untitled Note",
        description: req.body.description,
        isPinned: req.body.isPinned || false,
        userId: req.body.userId,
      };
      service
        .createNote(note)
        .then((note) => {
          res.status(201).send({
            success: true,
            message: "Note created successfully!",
            data: note,
          });
        })
        .catch((err) => {
          logger.error("Error while creating the new note", err);
          res.status(500).json({
            success: false,
            message: err,
          });
        });
    } catch (error) {
      logger.error("Error while creating the new note", error);
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  };

  /**
   * @description Retrieve and return all notes from the database.
   * @param {*} request from client
   * @param {*} response to client
   */
  findAll = (req, res) => {
    try {
      const reqParam = {
        userId: req.body.userId,
        isTrashed: req.body.isTrashed || false,
        isArchived: req.body.isArchived || false,
      };
      service
        .findAllNotes(reqParam)
        .then((notes) => {
          if (!notes) {
            return res.status(404).send({
              success: false,
              message: "Notes not found",
            });
          }
          res.send({
            success: true,
            message: "Notes retrieved successfully!",
            data: notes,
          });
        })
        .catch((err) => {
          logger.error("Error while finding notes", err);
          res.status(500).send({
            success: false,
            message: "Some error occurred while retrieving notes",
          });
        });
    } catch (error) {
      logger.error("Error while finding the notes", error);
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  };

  /**
   * @description Find a single note with a noteId
   * @param {*} request from client
   * @param {*} response to client
   */
  findOne = (req, res) => {
    try {
      service
        .findNoteById(req.params.noteId)
        .then((note) => {
          if (!note) {
            return res.status(404).send({
              success: false,
              message: "Note not found with id " + req.params.noteId,
            });
          }
          res.send({
            success: true,
            message: "Note retrieved successfully!",
            data: note,
          });
        })
        .catch((error) => {
          logger.error("Error while finding the note by id", error);
          res.status(500).send({
            success: false,
            message: "Some error occurred while retrieving note",
          });
        });
    } catch (error) {
      logger.error("Error while finding the note by id", error);
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  };

  /**
   * @description Update a note identified by the noteId in the request
   * @param {*} request from client
   * @param {*} response to client
   */
  update = (req, res) => {
    try {
      const { error, value } = validateCreateNote.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }
      // Create a Note
      const note = {
        userId: req.body.userId,
        title: req.body.title || "Untitled Note",
        description: req.body.description,
        isPinned: req.body.isPinned,
      };
      // Find note and update it with the request body
      service
        .updateNoteById(req.params.noteId, note)
        .then((note) => {
          if (!note) {
            return res.status(404).send({
              success: false,
              message: "Note not found with id " + req.params.noteId,
            });
          }
          res.status(200).send({
            success: true,
            message: "Note updated successfully!",
            data: note,
          });
        })
        .catch((error) => {
          logger.error("Error while updating the new note", error);
          res.status(500).json({
            success: false,
            message: error,
          });
        });
    } catch (err) {
      logger.error("Error while updating the new note", err);
      res.status(500).json({
        success: false,
        message: err,
      });
    }
  };

  /**
   * @description  Trash a note with the specified noteId in the request
   * @param {*} request from client
   * @param {*} response to client
   */
  trash = (req, res) => {
    try {
      const { error, value } = validateDeleteNote.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }
      // Create a Note
      const note = {
        isTrashed: req.body.isTrashed,
      };
      // Find note and update it with the request body
      service.updateNoteById(req.params.noteId, note, (error, data) => {
        if (error) {
          if (error === messages.NOTE_NOT_FOUND) {
            res.status(404).send({
              success: false,
              message: `Note with id ${req.params.noteId} not found`,
            });
          } else {
            res.status(500).send({
              success: false,
              message: "Some error occurred while trashing note",
            });
          }
        } else {
          res.status(200).send({
            success: true,
            message: "Note trashed successfully!",
            data: data,
          });
        }
      });
    } catch (error) {
      logger.error("Error while trashing the new note", error);
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  };

  /**
   * @description  Delete a note forever with the specified noteId in the request
   * @param {*} request from client
   * @param {*} response to client
   */
  deleteForever = (req, res) => {
    try {
      // Find note and update it with the request body
      service
        .deleteNoteById(req.params.noteId)
        .then((note) => {
          if (!note) {
            return res.status(404).send({
              success: false,
              message: "Note not found with id " + req.params.noteId,
            });
          }
          res.send({
            success: true,
            message: "Note deleted successfully!",
            data: note,
          });
        })
        .catch((err) => {
          logger.error("Error while deleting the note", err);
          res.status(500).json({
            success: false,
            message: err,
          });
        });
    } catch (error) {
      logger.error("Error while deleting the note", error);
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  };

  /**
   * @description  Archive a note
   * @param {*} request from client
   * @param {*} response to client
   */
  archive = (req, res) => {
    try {
      const { error, value } = validateArchiveNote.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }
      // Create a Note
      const note = {
        isArchived: req.body.isArchived,
      };
      // Find note and update it with the request body
      service.updateNoteById(req.params.noteId, note, (error, data) => {
        if (error) {
          if (error === messages.NOTE_NOT_FOUND) {
            res.status(404).send({
              success: false,
              message: `Note with id ${req.params.noteId} not found`,
            });
          } else {
            res.status(500).send({
              success: false,
              message: "Some error occurred while archiving note",
            });
          }
        } else {
          res.status(200).send({
            success: true,
            message: "Note archived successfully!",
            data: data,
          });
        }
      });
    } catch (error) {
      logger.error("Error while archiving the new note", error);
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  };

  /**
   * @description Pin a note
   * @param {*} request from client
   * @param {*} response to client
   */
  pin = (req, res) => {
    try {
      const { error, value } = validatePinNote.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message,
        });
      }
      // Create a Note
      const note = {
        isPinned: req.body.isPinned,
      };
      // Find note and update it with the request body
      service.updateNoteById(req.params.noteId, note, (error, data) => {
        if (error) {
          if (error === messages.NOTE_NOT_FOUND) {
            res.status(404).send({
              success: false,
              message: `Note with id ${req.params.noteId} not found`,
            });
          } else {
            res.status(500).send({
              success: false,
              message: "Some error occurred while pinning note",
            });
          }
        } else {
          res.status(200).send({
            success: true,
            message: "Note pinned successfully!",
            data: data,
          });
        }
      });
    } catch (error) {
      logger.error("Error while pinning the new note", error);
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  };
}
module.exports = new NoteController();
