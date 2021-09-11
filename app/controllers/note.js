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
const redisCache = require("../middleware/redis.js");
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
      const validation = validateCreateNote.validate(req.body);
      if (validation.error) {
        return res.status(400).json({
          success: false,
          message: validation.error.details[0].message,
        });
      }
      // Create a Note
      const note = {
        title: req.body.title || "Untitled Note",
        description: req.body.description,
        isPinned: req.body.isPinned === true ? true : false,
        userId: req.body.userId,
        labels: req.body.labels,
      };
      service
        .createNote(note)
        .then((note) => {
          redisCache.clearCache(req.body.userId);
          res.status(201).json({
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
  findNotes = (req, res) => {
    try {
      const userId = req.body.userId;
      service
        .findAllNotes(userId)
        .then((notes) => {
          if (notes != null && notes.length === 0) {
            return res.status(404).json({
              success: false,
              message: "Notes not found",
            });
          }
          redisCache.updateCache(userId, 60, notes);
          let filteredNotes = notes;
          if (req.params.noteStatus === "trash") {
            filteredNotes = filteredNotes.filter((note) => note.isTrashed === true);
          } else if (req.params.noteStatus === "archive") {
            filteredNotes = filteredNotes.filter((note) => note.isArchived === true);
          } else if (req.params.noteStatus === "all") {
            filteredNotes = filteredNotes.filter((note) => note.isArchived === false && note.isTrashed === false);
          }
          res.status(200).json({
            success: true,
            message: "Notes retrieved successfully from database!",
            data: filteredNotes,
          });
        })
        .catch((err) => {
          logger.error("Error while finding notes", err);
          res.status(500).json({
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
            return res.status(404).json({
              success: false,
              message: "Note not found with id " + req.params.noteId,
            });
          }
          res.json({
            success: true,
            message: "Note retrieved successfully!",
            data: note,
          });
        })
        .catch((error) => {
          logger.error("Error while finding the note by id", error);
          res.status(500).json({
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
  findNotesByLabelName = (req, res) => {
    try {
      const userId = req.body.userId;
      service
        .findNotesByLabelName(req.params.labelName, userId)
        .then((note) => {
          if (!note) {
            return res.status(404).json({
              success: false,
              message: "Note not found with id " + req.params.labelName,
            });
          }
          res.json({
            success: true,
            message: "Note retrieved successfully!",
            data: note,
          });
        })
        .catch((error) => {
          logger.error("Error while finding the note by id", error);
          res.status(500).json({
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
      const validation = validateCreateNote.validate(req.body);
      if (validation.error) {
        return res.status(400).json({
          success: false,
          message: validation.error.details[0].message,
        });
      }
      // Create a Note
      const note = {
        userId: req.body.userId,
        title: req.body.title || "Untitled Note",
        description: req.body.description,
        isPinned: req.body.isPinned,
        labels: req.body.labels,
      };
      // Find note and update it with the request body
      service
        .updateNoteById(req.params.noteId, note)
        .then((note) => {
          if (!note) {
            return res.status(404).json({
              success: false,
              message: "Note not found with id " + req.params.noteId,
            });
          }
          redisCache.clearCache(req.body.userId);
          res.status(200).json({
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
      const validation = validateDeleteNote.validate(req.body);
      if (validation.error) {
        return res.status(400).json({
          success: false,
          message: validation.error.details[0].message,
        });
      }
      let note = {
        isTrashed: req.body.isTrashed,
      };
      if (req.body.isTrashed) {
        note = {
          isTrashed: req.body.isTrashed,
          isPinned: false,
        };
      }
      // Find note and update it with the request body
      service
        .updateNoteById(req.params.noteId, note)
        .then((note) => {
          if (!note) {
            return res.status(404).json({
              success: false,
              message: "Note not found with id " + req.params.noteId,
            });
          }
          redisCache.clearCache(req.body.userId);
          res.status(200).json({
            success: true,
            message: "Note trashed/restored successfully!",
            data: note,
          });
        })
        .catch((error) => {
          logger.error("Error while trashing/restoring the note by id", error);
          res.status(500).json({
            success: false,
            message: "Some error occurred while trashing/restoring note",
          });
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
            return res.status(404).json({
              success: false,
              message: "Note not found with id " + req.params.noteId,
            });
          }
          redisCache.clearCache(req.body.userId);
          res.json({
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
      const validation = validateArchiveNote.validate(req.body);
      if (validation.error) {
        return res.status(400).json({
          success: false,
          message: validation.error.details[0].message,
        });
      }
      let note = {
        isArchived: req.body.isArchived,
      };
      if (req.body.isArchived) {
        note = {
          isArchived: req.body.isArchived,
          isPinned: false,
        };
      }
      // Find note and update it with the request body
      service
        .updateNoteById(req.params.noteId, note)
        .then((note) => {
          if (!note) {
            return res.status(404).json({
              success: false,
              message: "Note not found with id " + req.params.noteId,
            });
          }
          redisCache.clearCache(req.body.userId);
          res.json({
            success: true,
            message: "Note archived successfully!",
            data: note,
          });
        })
        .catch((err) => {
          logger.error("Error while archiving the note", err);
          res.status(500).json({
            success: false,
            message: err,
          });
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
      const validation = validatePinNote.validate(req.body);
      if (validation.error) {
        return res.status(400).json({
          success: false,
          message: validation.error.details[0].message,
        });
      }
      let note = {
        isPinned: req.body.isPinned,
      };
      if (req.body.isPinned) {
        note = {
          isPinned: req.body.isPinned,
          isArchived: false,
        };
      }
      // Find note and update it with the request body
      service
        .updateNoteById(req.params.noteId, note)
        .then((note) => {
          if (!note) {
            return res.status(404).json({
              success: false,
              message: "Note not found with id " + req.params.noteId,
            });
          }
          redisCache.clearCache(req.body.userId);
          res.json({
            success: true,
            message: "Note pinned successfully!",
            data: note,
          });
        })
        .catch((err) => {
          logger.error("Error while pinning the note", err);
          res.status(500).json({
            success: false,
            message: err,
          });
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
