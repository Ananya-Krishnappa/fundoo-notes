/*
 * Purpose: Provides the business logic for each functionality
 *
 * @description
 *
 * @author: Ananya K
 * @version: 1.0.0
 * @since: 30-07-2021
 */
const labelModel = require("../models/label.js");
const logger = require("../config/loggerConfig.js");

class LabelService {
  /**
   * @description create a label
   * @param {*} labelDetails
   * @param {*} callback
   */
  createLabel = (label) => {
    return new Promise(function (resolve, reject) {
      try {
        labelModel
          .createLabel(label)
          .then((label) => {
            logger.info("Label created successfully!", label);
            resolve(label);
          })
          .catch((error) => {
            logger.error("Error while creating the new label", error);
            reject(error);
          });
      } catch (err) {
        logger.error("Error while creating the new label", err);
        reject(err);
      }
    });
  };

  /**
   * @description Retrieve all the labels
   * @param {*} labelDetails
   * @param {*} callback
   */
  findAllLabel = (noteId) => {
    return new Promise(function (resolve, reject) {
      try {
        labelModel
          .findAllLabel(noteId)
          .then((labels) => {
            logger.info("Labels found successfully!", labels);
            resolve(labels);
          })
          .catch((error) => {
            logger.error("Error while finding the labels", error);
            reject(error);
          });
      } catch (err) {
        logger.error("Error while finding the labels", err);
        reject(err);
      }
    });
  };

  /**
   * @description Update label by id
   * @param {*} labelId
   * @param {*} labelDetails
   */
  updateLabelById = (labelId, label) => {
    return new Promise(function (resolve, reject) {
      try {
        labelModel
          .updateLabelById(labelId, label)
          .then((label) => {
            logger.info("Label updated successfully!", label);
            resolve(label);
          })
          .catch((error) => {
            logger.error("Error while updating label by id", error);
            reject(error);
          });
      } catch (err) {
        logger.error("Error while updating label by id", err);
        reject(err);
      }
    });
  };
}
module.exports = new LabelService();
