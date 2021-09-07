/*
 * Purpose: Provides the test cases for each functionality
 *
 * @description
 *
 * @author: Ananya K
 * @version: 1.0.0
 * @since: 09-08-2021
 */
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../server.js");
const userModel = require("../../app/models/userAuth.js");
const userInputs = require("../userAuth.json");
const expect = chai.expect;
//assertion style
chai.should();
chai.use(chaiHttp);

/**
 * /POST request test
 * Positive and Negative - Registration of User Testing
 */
describe("POST-SUCCESS /register", () => {
  it("givenValidArgsInReqBody_whenInvokedRegisterFunc_thenReturnUserRegisteredSuccessfully", (done) => {
    let userData = userInputs.createUser;
    chai
      .request(server)
      .post("/register")
      .send(userData)
      .end((error, res) => {
        expect(error).to.be.null;
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.property("success").eql(true);
        res.body.should.have.property("message").eql("User registered successfully!");
        done();
      });
  });

  after(() => {
    userModel.deleteUserByEmail("Rita_Rutherford6@gmail.com");
  });
});

describe("POST-FAILURE /register", () => {
  it("notGivenFirstNameInReqBody_whenInvokedRegisterFunc_thenReturnErrorMessage", (done) => {
    let userData = userInputs.invalidFirstname;
    chai
      .request(server)
      .post("/register")
      .send(userData)
      .end((error, res) => {
        expect(error).to.be.null;
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql('"firstName" is not allowed to be empty');
        done();
      });
  });

  it("notGivenLastNameInReqBody_whenInvokedRegisterFunc_thenReturnErrorMessage", (done) => {
    let userData = userInputs.invalidLastname;
    chai
      .request(server)
      .post("/register")
      .send(userData)
      .end((error, res) => {
        expect(error).to.be.null;
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql('"lastName" is not allowed to be empty');
        done();
      });
  });

  it("notGivenEmailInReqBody_whenInvokedRegisterFunc_thenReturnErrorMessage", (done) => {
    let userData = userInputs.invalidEmail;
    chai
      .request(server)
      .post("/register")
      .send(userData)
      .end((error, res) => {
        expect(error).to.be.null;
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql('"email" must be a valid email');
        done();
      });
  });

  it("givenNoPasswordInReqBody_whenInvokedLoginFunc_thenReturnErrorMessage", (done) => {
    let userData = userInputs.invalidPassword;
    chai
      .request(server)
      .post("/register")
      .send(userData)
      .end((error, res) => {
        expect(error).to.be.null;
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql('"password" is not allowed to be empty');
        done();
      });
  });
});

/**
 * /POST request test
 * Positive and Negative - Login of User Testing
 */
describe("POST /login", () => {
  it("givenEmailAndPasswordInReqBody_whenInvokedLoginFunc_thenReturnUserLoggedInSuccessfully", (done) => {
    let userData = userInputs.userLogin;
    chai
      .request(server)
      .post("/login")
      .send(userData)
      .end((error, res) => {
        expect(error).to.be.null;
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("success").eql(true);
        res.body.should.have.property("message").eql("User logged in!");
        res.body.should.have.property("data");
        done();
      });
  });

  it("givenNoEmailInReqBody_whenInvokedLoginFunc_thenReturnErrorMessage", (done) => {
    let userData = userInputs.invalidLoginEmail;
    chai
      .request(server)
      .post("/login")
      .send(userData)
      .end((error, res) => {
        expect(error).to.be.null;
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql('"email" must be a valid email');
        done();
      });
  });

  it("givenNoPasswordInReqBody_whenInvokedLoginFunc_thenReturnErrorMessage", (done) => {
    let userData = userInputs.invalidLoginPassword;
    chai
      .request(server)
      .post("/login")
      .send(userData)
      .end((error, res) => {
        expect(error).to.be.null;
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql('"password" is not allowed to be empty');
        done();
      });
  });
});

/**
 * /POST request test
 * Positive and Negative - Forgot Password of User Testing
 */

describe("POST /forgotPassword", () => {
  it("givenValidInput_whenInvokedForgotPassword_thenReturnLinkToMail", (done) => {
    let userData = userInputs.forgotPassword;
    chai
      .request(server)
      .post("/forgotPassword")
      .send(userData)
      .end((error, res) => {
        expect(error).to.be.null;
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("success").eql(true);
        res.body.should.have.property("message").eql("Password reset link sent to your mail!");
        done();
      });
  });

  it("givenValidEmailNotRegistered_whenInvokedForgotPassword_thenReturnErrorMessage", (done) => {
    let userData = userInputs.emailNotRegistered;
    chai
      .request(server)
      .post("/forgotPassword")
      .send(userData)
      .end((error, res) => {
        expect(error).to.be.null;
        res.should.have.status(404);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("User does not exist");
        done();
      });
  });

  it("givenInvalidInput_whenInvokedForgotPassword_thenReturnErrorMessage", (done) => {
    let userData = userInputs.invalidEmailForForgotPassword;
    chai
      .request(server)
      .post("/forgotPassword")
      .send(userData)
      .end((error, res) => {
        expect(error).to.be.null;
        res.should.have.status(400);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql('"email" must be a valid email');
        done();
      });
  });
});
