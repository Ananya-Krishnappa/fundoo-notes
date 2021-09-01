const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../server");
const labelInputs = require("../label.json");
const userInput = require("../userAuth.json");
const expect = chai.expect;
chai.use(chaiHttp);

describe("Notes API", () => {
  let token = "";

  before((done) => {
    chai
      .request(server)
      .post("/login")
      .send(userInput.userLogin)
      .end((error, res) => {
        token = res.body.token;
        expect(error).to.be.null;
        res.should.have.status(200);
        return done();
      });
  });

  /**
   * /POST request test
   * Positive and Negative - Creation of Labels
   */
  describe("POST labels /create", () => {
    it("givenValidInputs_whenPostCreateLabelFunctCalled_thenReturnsSuccessMessage", (done) => {
      let labelData = labelInputs.createLabel;
      chai
        .request(server)
        .post("/label")
        .send(labelData)
        .set("Authorization", "Bearer " + token)
        .end((error, res) => {
          expect(error).to.be.null;
          res.should.have.status(201);
          res.body.should.be.a("object");
          res.body.should.have.property("success").eql(true);
          res.body.should.have.property("message").eql("Label created successfully!");
          res.body.should.have.property("message").should.be.a("object");
          done();
        });
    });
    it("givenEmptyRequestBody_whenPostCreateLabelFuncCalled_thenReturnsErrorMessage", (done) => {
      let labelData = labelInputs.createLabelWithEmptyReqBody;
      chai
        .request(server)
        .post("/label")
        .send(labelData)
        .set("Authorization", "Bearer " + token)
        .end((error, res) => {
          const errorMsg = "Invalid Params. Usage: { " + "'labelName': '<labelName>'," + "'noteId': '<noteId>'";
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql(errorMsg);
          done();
        });
    });
    it("givenInvalidInputs_whenPostCreateLabelFuncCalled_thenReturnsErrorMessage", (done) => {
      let labelData = labelInputs.createLabelWithNoId;
      chai
        .request(server)
        .post("/label")
        .send(labelData)
        .set("Authorization", "Bearer " + token)
        .end((error, res) => {
          expect(error).to.be.null;
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql('"noteId" is not allowed to be empty');
          done();
        });
    });
    it("givenValidInputs_whenPostCreateLabelFunctCalled_thenReturnsErrorMessage", (done) => {
      let labelData = labelInputs.createLabelWithNoLabel;
      chai
        .request(server)
        .post("/label")
        .send(labelData)
        .set("Authorization", "Bearer " + token)
        .end((error, res) => {
          expect(error).to.be.null;
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql('"labelName" is not allowed to be empty');
          done();
        });
    });
  });
  describe("Put labels/ label/:labelId", () => {
    it("givenValidInputs_whenRemoveLabelFunctCalled_thenReturnsSuccessMessage", (done) => {
      let labelData = labelInputs.removeLabel;
      chai
        .request(server)
        .put("/label/612fc816f058ef33d4cacdcb")
        .send(labelData)
        .set("Authorization", "Bearer " + token)
        .end((error, res) => {
          expect(error).to.be.null;
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success").eql(true);
          res.body.should.have.property("message").eql("Label upated successfully!");
          res.body.should.have.property("message").should.be.a("object");
          done();
        });
    });
    it("givenIncorrectBody_whenRemoveLabelFunctCalled_thenReturnsErrorMessage", (done) => {
      let labelData = labelInputs.removeLabelWithIncorrectBody;
      chai
        .request(server)
        .put("/label/611e74427ad38d3a6846f8ac")
        .send(labelData)
        .set("Authorization", "Bearer " + token)
        .end((error, res) => {
          expect(error).to.be.null;
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("success").eql(false);
          res.body.should.have.property("message").eql('"isActive" must be a boolean');
          res.body.should.have.property("message").should.be.a("object");
          done();
        });
    });
  });
  describe("GET labels /findAll", () => {
    it("givenValidInputs_whenFindAllLabelFunctCalled_thenReturnsSuccessMessage", (done) => {
      chai
        .request(server)
        .get("/label/611bd480dd4342055c4fc72a")
        .set("Authorization", "Bearer " + token)
        .end((error, res) => {
          expect(error).to.be.null;
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success").eql(true);
          expect(res.body.message).contain("Labels retrieved successfully");
          res.body.should.have.property("message").should.be.a("object");
          done();
        });
    });
    it("givenNoteIdWithNoLabel_whenFindAllLabelFunctCalled_thenReturnsErrorMessage", (done) => {
      chai
        .request(server)
        .get("/label/611fcfb31f387a435ceeb302")
        .set("Authorization", "Bearer " + token)
        .end((error, res) => {
          expect(error).to.be.null;
          res.should.have.status(404);
          res.body.should.be.a("object");
          res.body.should.have.property("success").eql(false);
          res.body.should.have.property("message").eql("No labels present for this note");
          res.body.should.have.property("message").should.be.a("object");
          done();
        });
    });
  });
});
