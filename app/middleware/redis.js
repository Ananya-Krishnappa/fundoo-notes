const redis = require("redis");
const client = redis.createClient(process.env.REDIS_PORT);
const logger = require("../config/loggerConfig.js");

class RedisCache {
  /**
   * @description Retrieve and return all notes from the cache.
   * @param {*} request from client
   * @param {*} response to client
   */
  findNotes = (req, res, next) => {
    try {
      const userId = req.body.userId;
      client.get(userId, (err, notes) => {
        if (err) throw err;
        if (notes) {
          let filteredNotes = JSON.parse(notes);
          if (filteredNotes != null && filteredNotes.length === 0) {
            return res.status(404).json({
              success: false,
              message: "Notes not found",
            });
          }
          if (req.params.noteStatus === "trash") {
            filteredNotes = filteredNotes.filter((note) => note.isTrashed === true);
          } else if (req.params.noteStatus === "archive") {
            filteredNotes = filteredNotes.filter((note) => note.isArchived === true);
          }
          res.status(200).json({
            success: true,
            message: "Notes retrieved successfully from the cache!",
            data: filteredNotes,
          });
        } else {
          next();
        }
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
   * @description Retrieve and return all labels from the cache.
   * @param {*} request from client
   * @param {*} response to client
   */
  findLabel = (req, res, next) => {
    try {
      const noteId = req.params.noteId;
      client.get(noteId, (err, labels) => {
        if (err) throw err;
        if (labels) {
          let resultLabels = JSON.parse(labels);
          if (resultLabels != null && resultLabels.length === 0) {
            return res.status(404).send({
              success: false,
              message: "No labels present for this note",
            });
          }
          res.send({
            success: true,
            message: "Labels retrieved successfully from cache",
            data: resultLabels,
          });
        } else {
          next();
        }
      });
    } catch (error) {
      logger.error("Error while finding the labels", error);
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  };
  clearCache = (key) => {
    client.del(key);
  };
}

module.exports = new RedisCache();
