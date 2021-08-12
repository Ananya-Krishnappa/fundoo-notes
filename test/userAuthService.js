const chai = require("chai");
const sinon = require("sinon");
const faker = require("faker");
const expect = chai.expect;
const userAuthService = require("../app/service/userAuth");
const userAuthRepo = require("../app/models/userAuth");
const tokenService = require("../app/service/token.js");
describe("User Authentication Service", function () {
  describe("User Register Service", function () {
    it("givenUserDetails_whenInvokedRegisterFunc_thenReturnUserRegisteredSuccessfully", function () {
      const stubValue = {
        id: faker.datatype.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phoneNumber: faker.phone.phoneNumber(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      };
      const { id, createdAt, updatedAt, ...userDetails } = {
        ...stubValue,
      };
      const registerStub = sinon.stub(userAuthRepo, "register");
      registerStub.yields(null, stubValue);
      userAuthService.register(userDetails, (err, doc) => {
        registerStub.restore();
        expect(registerStub.calledOnce).to.be.true;
        expect(doc.id).to.equal(stubValue.id);
        expect(doc.firstName).to.equal(stubValue.firstName);
        expect(doc.email).to.equal(stubValue.email);
        expect(doc.createdAt).to.equal(stubValue.createdAt);
        expect(doc.updatedAt).to.equal(stubValue.updatedAt);
      });
    });

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
      const stubValue = {
        id: faker.datatype.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phoneNumber: faker.phone.phoneNumber(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past(),
      };
      sinon.stub(tokenService, "findTokenByUserIdAndCheckIfValid");
      const updatePasswordStub = sinon.stub(userAuthRepo, "updateNewPassword");
      updatePasswordStub.yields(null, updatePasswordStubValue);
      const findUserStub = sinon.stub(userAuthRepo, "findUserById");
      findUserStub.yields(null, stubValue);
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
  });
});
