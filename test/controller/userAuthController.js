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
const sinon = require("sinon");
const faker = require("faker");
const expect = chai.expect;
const userAuthController = require("../../app/controllers/userAuth");
const userAuthService = require("../../app/service/userAuth");
const testData = require("../utils/testData");
describe("User Authentication", function () {
  describe("User Registration", function () {
    let status, json, res;
    beforeEach(() => {
      sinon.restore();
      status = sinon.stub();
      json = sinon.spy();
      res = {
        json,
        status,
      };
      status.returns(res);
    });

    it("givenAnEmptyJsonObjectInReqBody_whenInvokedRegisterFunc_thenReturnErrorMessage", function () {
      const req = {
        body: {},
      };
      userAuthController.register(req, res);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal(
        "Invalid Params. Usage: { 'firstName': '<first_name>','lastName': '<last_name>','email': '<email>','password': '<password>'}"
      );
    });

    it("notGivenFirstNameInReqBody_whenInvokedRegisterFunc_thenReturnErrorMessage", function () {
      const req = {
        body: {
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
        },
      };
      userAuthController.register(req, res);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('"firstName" is required');
    });

    it("notGivenEmailInReqBody_whenInvokedRegisterFunc_thenReturnErrorMessage", function () {
      const req = {
        body: {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          password: faker.internet.password(),
        },
      };
      userAuthController.register(req, res);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('"email" is required');
    });

    it("givenValidArgsInReqBody_whenInvokedRegisterFunc_thenReturnUserRegisteredSuccessfully", function () {
      const req = {
        body: {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          password: faker.internet.password(),
          email: faker.internet.email(),
        },
      };
      const registerStub = sinon.stub(userAuthService, "register");
      registerStub.yields(null, testData.userData);
      userAuthController.register(req, res);
      registerStub.restore();
      expect(registerStub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(201);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].data).to.equal(testData.userData);
    });

    it("givenAnEmptyJsonObjectInReqBody_whenInvokedLoginFunc_thenReturnErrorMessage", function () {
      const req = {
        body: {},
      };
      userAuthController.login(req, res);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('"email" is required');
    });

    it("givenNoEmailInReqBody_whenInvokedLoginFunc_thenReturnErrorMessage", function () {
      const req = {
        body: {
          password: faker.internet.password(),
        },
      };
      userAuthController.login(req, res);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('"email" is required');
    });

    it("givenNoPasswordInReqBody_whenInvokedLoginFunc_thenReturnErrorMessage", function () {
      const req = {
        body: {
          email: faker.internet.email(),
        },
      };
      userAuthController.login(req, res);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('"password" is required');
    });

    it("givenEmailAndPasswordInReqBody_whenInvokedLoginFunc_thenReturnUserLoggedInSuccessfully", function () {
      const req = {
        body: {
          password: faker.internet.password(),
          email: faker.internet.email(),
        },
      };
      let userData = {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoid2Fyb2sxMkBnbWFpbC5jb20iLCJleHBpcmVzSW4iOiIxaCIsImlhdCI6MTYyNzkzMDg0OX0.3FK4Cc3ncleCcqAaR-sthQzJtAZ1XeFcrfkaPXldQVk",
      };
      let loginStub = sinon.stub(userAuthService, "login");
      loginStub.yields(null, userData);
      userAuthController.login(req, res);
      expect(loginStub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(200);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].data.token).to.equal(userData.token);
    });
  });
});
