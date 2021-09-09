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
        token = res.body.data.token;
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
    it("givenEmptyRequestBody_whenPostCreateLabelFuncCalled_thenReturnsErrorMessage", (done) => {
      let labelData = labelInputs.createLabelWithEmptyReqBody;
      chai
        .request(server)
        .post("/label")
        .send(labelData)
        .set("Authorization", "Bearer " + token)
        .end((error, res) => {
          const errorMsg = "Invalid Params. Usage: { " + "'labelName': '<labelName>'";
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql(errorMsg);
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
  describe("GET labels /findAll", () => {
    it("givenValidInputs_whenFindAllLabelFunctCalled_thenReturnsSuccessMessage", (done) => {
      chai
        .request(server)
        .get("/label")
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
  });
});
