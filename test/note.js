/*
 * Purpose: Provides the test cases for each functionality
 *
 * @description
 *
 * @author: Ananya K
 * @version: 1.0.0
 * @since: 18-08-2021
 */
const mocha = require("mocha");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server.js");
const noteInput = require("./note.json");
const userInput = require("./userAuth.json");

//assertion style
chai.should();
chai.use(chaiHttp);

describe("Notes API", () => {
  let token = "";
  let noteId="";

  before((done) => {
    chai
      .request(server)
      .post("/login")
      .send(userInput.userLogin)
      .end((error, res) => {
        if (error) {
          return done(error);
        }
        token = res.body.token;
        console.log("token", token);
        res.should.have.status(200);
        return done();
      });
  });
  /**
   * /POST request test
   * Positive and Negative - Creation of Notes
   */
  describe("POST Create Notes /notes", () => {
    it("givenValidInputs_whenCreateFunctionIsCalled_thenReturnSuccessMessage", (done) => {
      let notesData = noteInput.createNote;
      chai
        .request(server)
        .post("/notes")
        .send(notesData)
        .set("Authorization", "Bearer " + token)
        .end((error, res) => {
          if (error) {
            return done(error);
          }
          noteId=res.body.data._id;
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("success").eql(true);
          res.body.should.have.property("message").eql("Note created successfully!");
          res.body.should.have.property("data").should.be.a("object");
          return done();
        });
    });

    it("givenInvalidTitle_whenCreateFunctionIsCalled_thenReturnErrorMessage", (done) => {
      let notesData = noteInput.createNoteWithNoTitle;
      chai
        .request(server)
        .post("/notes")
        .send(notesData)
        .set("Authorization", "Bearer " + token)
        .end((error, res) => {
          if (error) {
            return done(error);
          }
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql('"title" is not allowed to be empty');
          return done();
        });
    });

    it("givenInvalidDescription_whenCreateFunctionIsCalled_thenReturnErrorMessage", (done) => {
      let notesData = noteInput.createNoteWithNoDescription;
      chai
        .request(server)
        .post("/notes")
        .send(notesData)
        .set("Authorization", "Bearer " + token)
        .end((error, res) => {
          if (error) {
            return done(error);
          }
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql('"description" is not allowed to be empty');
          return done();
        });
    });

    it("givenInvalidUserId_whenCreateFunctionIsCalled_thenReturnErrorMessage", (done) => {
      let notesData = noteInput.createNoteWithNoUserid;
      chai
        .request(server)
        .post("/notes")
        .send(notesData)
        .set("Authorization", "Bearer " + token)
        .end((error, res) => {
          if (error) {
            return done(error);
          }
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql('"userId" is not allowed to be empty');
          return done();
        });
    });
  });

  describe("PUT Update Notes /notes/:noteId", () => {
    it("givenValidInputs_whenUpdateFunctionIsCalled_thenReturnSuccessMessage", (done) => {
      let notesData = noteInput.updateNote;
      chai
        .request(server)
        .put("/notes/611bd480dd4342055c4fc72a")
        .send(notesData)
        .set("Authorization", "Bearer " + token)
        .end((error, res) => {
          if (error) {
            return done(error);
          }
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success").eql(true);
          res.body.should.have.property("message").eql("Note updated successfully!");
          res.body.should.have.property("data").should.be.a("object");
          return done();
        });
    });

    it("givenInvalidTitle_whenUpdateFunctionIsCalled_thenReturnErrorMessage", (done) => {
      let notesData = noteInput.updateNoteWithNoTitle;
      chai
        .request(server)
        .put("/notes/611bd480dd4342055c4fc72a")
        .send(notesData)
        .set("Authorization", "Bearer " + token)
        .end((error, res) => {
          if (error) {
            return done(error);
          }
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql('"title" is not allowed to be empty');
          return done();
        });
    });

    it("givenInvalidDescription_whenUpdateFunctionIsCalled_thenReturnErrorMessage", (done) => {
      let notesData = noteInput.updateNoteWithNoDescription;
      chai
        .request(server)
        .put("/notes/611bd480dd4342055c4fc72a")
        .send(notesData)
        .set("Authorization", "Bearer " + token)
        .end((error, res) => {
          if (error) {
            return done(error);
          }
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql('"description" is not allowed to be empty');
          return done();
        });
    });

    it("givenInvalidUserId_whenUpdateFunctionIsCalled_thenReturnErrorMessage", (done) => {
      let notesData = noteInput.updateNoteWithNoUserid;
      chai
        .request(server)
        .put("/notes/611bd480dd4342055c4fc72a")
        .send(notesData)
        .set("Authorization", "Bearer " + token)
        .end((error, res) => {
          if (error) {
            return done(error);
          }
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql('"userId" is not allowed to be empty');
          return done();
        });
    });
  });

  /**
   * /GET request test
   * Positive and Negative - Get all Notes from database
   */
  describe("POST all /notes", (done) => {
    let notesData = noteInput.getAllNotes;
    it("givenValidInputs_whenPostRequestToGetAllNotes_thenReturnSuccessMessage", (done) => {
      chai
        .request(server)
        .post("/findNotes")
        .send(notesData)
        .set("Authorization", "Bearer " + token)
        .end((error, res) => {
          if (error) {
            return done(error);
          }
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success").eql(true);
          res.body.should.have.property("message").eql("Notes retrieved successfully!");
          res.body.should.have.property("data").should.be.a("object");
          return done();
        });
    });
  });

  /**
   * /DELETE request test
   * Positive and Negative - Deleting a single contact using ID into database
   */
  describe("DELETE /notes/:noteId", () => {
    it("givenValidInput_whenDeleteFunctionIsCalled_thenReturnSuccessMessage", (done) => {
      chai
        .request(server)
        .delete(`/notes/${noteId}`)
        .set("Authorization", "Bearer " + token)
        .end((error, res) => {
          if (error) {
            return done(error);
          }
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success").eql(true);
          res.body.should.have.property("message").eql("Note deleted successfully!");
          return done();
        });
    });
  });
});
