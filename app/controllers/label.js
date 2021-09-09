/*
 * Purpose: Provides implementation for the mapped request and forwards the request to the service layer.
 * Also, returns the response to the client
 * @description
 *
 * @author: Ananya K
 * @version: 1.0.0
 * @since: 19-08-2021
 */
const service = require("../service/label.js");
const logger = require("../config/loggerConfig.js");
const { validateCreateLabel } = require("../utils/validation.js");
const redisCache = require("../middleware/redis.js");
class LabelController {
  /**
   * @description create and save label
   * @param {*} request from client
   * @param {*} response to client
   */
  create = (req, res) => {
    try {
      if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        logger.error("Invalid Params. Usage: { 'labelName': '<labelName>'");
        return res.status(400).json({
          message: "Invalid Params. Usage: { " + "'labelName': '<labelName>'",
        });
      }
      const validation = validateCreateLabel.validate(req.body);
      if (validation.error) {
        return res.status(400).json({
          success: false,
          message: validation.error.details[0].message,
        });
      }
      const label = {
        labelName: req.body.labelName || "Untitled Label",
      };
      service
        .createLabel(label)
        .then((label) => {
          redisCache.clearCache("labelList");
          res.status(201).send({
            success: true,
            message: "Label created successfully!",
            data: label,
          });
        })
        .catch((err) => {
          logger.error("Error while creating the new label", err);
          res.status(500).json({
            success: false,
            message: err,
          });
        });
    } catch (error) {
      logger.error("Error while creating the new label", error);
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  };

  /**
   * @description Retrieve and return all labels from the database.
   * @param {*} request from client
   * @param {*} response to client
   */
  findLabel = (req, res) => {
    try {
      service
        .findAllLabel()
        .then((labels) => {
          if (labels != null && labels.length === 0) {
            return res.status(404).send({
              success: false,
              message: "No labels present for this note",
            });
          }
          redisCache.updateCache("labelList", 60, labels);
          res.send({
            success: true,
            message: "Labels retrieved successfully from database",
            data: labels,
          });
        })
        .catch((err) => {
          logger.error("Error while finding labels", err);
          res.status(500).send({
            success: false,
            message: "Some error occurred while retrieving labels",
          });
        });
    } catch (error) {
      logger.error("Error while finding the labels", error);
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  };

  /**
   * @description  Update a label with the specified labelId in the request
   * @param {*} request from client
   * @param {*} response to client
   */
  removeLabel = (req, res) => {
    try {
      if (validation.error) {
        return res.status(400).json({
          success: false,
          message: validation.error.details[0].message,
        });
      }
      const label = {
        isActive: req.body.isActive,
      };
      service
        .updateLabelById(req.params.labelId, label)
        .then((label) => {
          if (!label) {
            return res.status(404).send({
              success: false,
              message: "Label not found with id " + req.params.labelId,
            });
          }
          res.send({
            success: true,
            message: "Label upated successfully!",
            data: label,
          });
        })
        .catch((err) => {
          logger.error("Error while updating the label", err);
          res.status(500).json({
            success: false,
            message: err,
          });
        });
    } catch (error) {
      logger.error("Error while updating the label", error);
      res.status(500).json({
        success: false,
        message: error,
      });
    }
  };
}
module.exports = new LabelController();
