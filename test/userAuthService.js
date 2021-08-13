const chai = require("chai");
const sinon = require("sinon");
const faker = require("faker");
const expect = chai.expect;
const userAuthService = require("../app/service/userAuth");
const userAuthRepo = require("../app/models/userAuth");
const tokenService = require("../app/service/token.js");
const utilService = require("../app/utils/authentication.js");
const messages = require("../app/utils/messages.js");
const testData = require("./utils/testData");
describe("User Authentication Service", function () {
  beforeEach(() => {
    sinon.restore();
  });
  describe("User Register Service", function () {
    it("givenUserDetails_whenInvokedRegisterFunc_thenReturnUserRegisteredSuccessfully", function () {
      const { id, createdAt, updatedAt, ...userDetails } = {
        ...testData.userData,
      };
      const registerStub = sinon.stub(userAuthRepo, "register");
      registerStub.yields(null, testData.userData);
      userAuthService.register(userDetails, (err, doc) => {
        registerStub.restore();
        expect(registerStub.calledOnce).to.be.true;
        expect(doc.id).to.equal(testData.userData.id);
        expect(doc.firstName).to.equal(testData.userData.firstName);
        expect(doc.email).to.equal(testData.userData.email);
        expect(doc.createdAt).to.equal(testData.userData.createdAt);
        expect(doc.updatedAt).to.equal(testData.userData.updatedAt);
      });
    });
  });
  describe("User Login Service", function () {
    it("givenValidInputs_whenInvokedLoginFunc_thenReturnLoginSuccessful", function () {
      const userDetails = {
        password: faker.internet.password(),
        email: faker.internet.email(),
      };
      const token = faker.random.alphaNumeric();
      const findEmailStub = sinon.stub(userAuthRepo, "findUserByEmail");
      findEmailStub.yields(null, testData.userData);
      const comparePasswordStub = sinon.stub(utilService, "comparePassword");
      comparePasswordStub.returns(true);
      const generateTokenStub = sinon.stub(utilService, "generateToken");
      generateTokenStub.returns(token);
      userAuthService.login(userDetails, (err, doc) => {
        findEmailStub.restore();
        expect(findEmailStub.calledOnce).to.be.true;
        comparePasswordStub.restore();
        expect(comparePasswordStub.calledOnce).to.be.true;
        generateTokenStub.restore();
        expect(generateTokenStub.calledOnce).to.be.true;
        expect(doc).to.equal(token);
      });
    });

    it("givenValidInputsAndInvokedLoginFunc_whenDbIsDown_thenThrowDatabaseConnectionError", function () {
      const userDetails = {
        password: faker.internet.password(),
        email: faker.internet.email(),
      };
      const error = "Error connecting to database";
      const findEmailStub = sinon.stub(userAuthRepo, "findUserByEmail");
      findEmailStub.yields(error, null);
      userAuthService.login(userDetails, (err, doc) => {
        findEmailStub.restore();
        expect(findEmailStub.calledOnce).to.be.true;
        expect(err).to.equal(error);
      });
    });
  });
  describe("Forgot Password Service", function () {
    it("givenEmail_whenInvokedForgotPassword_thenReturnForgotPasswordSuccessful", function () {
      const userDetails = {
        email: faker.internet.email(),
      };
      const generateTokenStubValue = {
        resetToken: faker.random.alphaNumeric(),
        id: faker.datatype.uuid(),
        link: faker.internet.url(),
      };
      const findUserStub = sinon.stub(userAuthRepo, "findUserByEmail");
      findUserStub.yields(null, testData.userData);
      const findTokenStub = sinon.stub(tokenService, "findTokenByUserId");
      const generateTokenStub = sinon.stub(tokenService, "generateAndSaveToken");
      generateTokenStub.yields(null, generateTokenStubValue);
      userAuthService.forgotPassword(userDetails, (err, doc) => {
        findUserStub.restore();
        expect(findUserStub.calledOnce).to.be.true;
        findTokenStub.restore();
        expect(findTokenStub.calledOnce).to.be.true;
        generateTokenStub.restore();
        expect(generateTokenStub.calledOnce).to.be.true;
        expect(doc.id).to.equal(generateTokenStubValue.id);
        expect(doc.resetToken).to.equal(generateTokenStubValue.resetToken);
        expect(doc.link).to.equal(generateTokenStubValue.link);
      });
    });

    it("givenEmailAndInvokedForgotPassword_whenDbIsDown_thenThrowDatabaseConnectionError", function () {
      const userDetails = {
        email: faker.internet.email(),
      };
      const error = "Error connecting to database";
      const findUserStub = sinon.stub(userAuthRepo, "findUserByEmail");
      findUserStub.yields(error, null);
      userAuthService.forgotPassword(userDetails, (err, doc) => {
        findUserStub.restore();
        expect(findUserStub.calledOnce).to.be.true;
        expect(err).to.equal(error);
      });
    });

    it("givenInvalidEmail_whenInvokedForgotPassword_thenThrowUserNotFound", function () {
      const userDetails = {
        email: faker.internet.email(),
      };
      const findUserStub = sinon.stub(userAuthRepo, "findUserByEmail");
      findUserStub.yields(null, null);
      userAuthService.forgotPassword(userDetails, (err, doc) => {
        findUserStub.restore();
        expect(findUserStub.calledOnce).to.be.true;
        expect(err).to.equal(messages.USER_NOT_FOUND);
      });
    });
  });

  describe("Reset Password Service", function () {
    it("givenNewPassword_whenInvokedResetPassword_thenReturnPasswordResetSuccessful", function () {
      const userDetails = {
        newPassword: faker.internet.password(),
        token: faker.random.alphaNumeric(),
        userId: faker.datatype.uuid(),
      };
      const updatePasswordStubValue = {
        n: 1,
        nModified: 1,
        ok: 1,
      };
      sinon.stub(tokenService, "findTokenByUserIdAndCheckIfValid");
      const updatePasswordStub = sinon.stub(userAuthRepo, "updateNewPassword");
      updatePasswordStub.yields(null, updatePasswordStubValue);
      const findUserStub = sinon.stub(userAuthRepo, "findUserById");
      findUserStub.yields(null, testData.userData);
      const deleteTokenStub = sinon.stub(tokenService, "deleteTokenPostPasswordReset");
      const deleteTokenStubValue = "Password reset successful!";
      deleteTokenStub.yields(null, deleteTokenStubValue);
      userAuthService.resetPassword(userDetails, (err, doc) => {
        updatePasswordStub.restore();
        expect(updatePasswordStub.calledOnce).to.be.true;
        findUserStub.restore();
        expect(findUserStub.calledOnce).to.be.true;
        deleteTokenStub.restore();
        expect(deleteTokenStub.calledOnce).to.be.true;
        expect(doc).to.equal(deleteTokenStubValue);
      });
    });

    it("givenNewPasswordAndInvokedResetPassword_whenDbIsDown_thenThrowDatabaseConnectionError", function () {
      const userDetails = {
        newPassword: faker.internet.password(),
        token: faker.random.alphaNumeric(),
        userId: faker.datatype.uuid(),
      };
      const error = "Error connecting to database";
      sinon.stub(tokenService, "findTokenByUserIdAndCheckIfValid");
      const updatePasswordStub = sinon.stub(userAuthRepo, "updateNewPassword");
      updatePasswordStub.yields(error, null);
      userAuthService.resetPassword(userDetails, (err, doc) => {
        updatePasswordStub.restore();
        expect(updatePasswordStub.calledOnce).to.be.true;
        expect(err).to.equal(error);
      });
    });

    it("givenNewPasswordAndInvokedResetPassword_whenDbIsDownWhileFindUserById_thenThrowDatabaseConnectionError", function () {
      const userDetails = {
        newPassword: faker.internet.password(),
        token: faker.random.alphaNumeric(),
        userId: faker.datatype.uuid(),
      };
      const updatePasswordStubValue = {
        n: 1,
        nModified: 1,
        ok: 1,
      };
      sinon.stub(tokenService, "findTokenByUserIdAndCheckIfValid");
      const updatePasswordStub = sinon.stub(userAuthRepo, "updateNewPassword");
      updatePasswordStub.yields(null, updatePasswordStubValue);
      const error = "Error connecting to database";
      const findUserStub = sinon.stub(userAuthRepo, "findUserById");
      findUserStub.yields(error, null);
      userAuthService.resetPassword(userDetails, (err, doc) => {
        updatePasswordStub.restore();
        expect(updatePasswordStub.calledOnce).to.be.true;
        findUserStub.restore();
        expect(findUserStub.calledOnce).to.be.true;
        expect(err).to.equal(error);
      });
    });

    it("givenNewPasswordAndInvokedResetPassword_whenUserDoesNotExists_thenThrowError", function () {
      const userDetails = {
        newPassword: faker.internet.password(),
        token: faker.random.alphaNumeric(),
        userId: faker.datatype.uuid(),
      };
      const updatePasswordStubValue = {
        n: 1,
        nModified: 1,
        ok: 1,
      };
      sinon.stub(tokenService, "findTokenByUserIdAndCheckIfValid");
      const updatePasswordStub = sinon.stub(userAuthRepo, "updateNewPassword");
      updatePasswordStub.yields(null, updatePasswordStubValue);
      const findUserStub = sinon.stub(userAuthRepo, "findUserById");
      findUserStub.yields(null, null);
      userAuthService.resetPassword(userDetails, (err, doc) => {
        updatePasswordStub.restore();
        expect(updatePasswordStub.calledOnce).to.be.true;
        findUserStub.restore();
        expect(findUserStub.calledOnce).to.be.true;
        expect(err).to.equal(messages.USER_NOT_FOUND);
      });
    });
  });
});
