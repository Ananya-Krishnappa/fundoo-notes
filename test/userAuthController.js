const chai = require("chai");
const sinon = require("sinon");
const faker = require("faker");
const expect = chai.expect;
const userAuthController = require('../app/controllers/userAuth');
const userAuthService = require('../app/service/userAuth');
describe('User Authentication', function () {
  describe('User Registration', function () {

    let status, json, res;
    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      res = {
        json,
        status
      };
      status.returns(res);
    });

    it('givenAnEmptyJsonObjectInReqBody_whenInvokedRegisterFunc_thenReturnErrorMessage', function () {
      const req = {
        body: {}
      };
      userAuthController.register(req, res);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal("Invalid Params. Usage: { 'firstName': '<first_name>','lastName': '<last_name>','email': '<email>','phoneNumber': '<phone_number>','password': '<password>'}");
    });

    it('notGivenFirstNameInReqBody_whenInvokedRegisterFunc_thenReturnErrorMessage', function () {
      const req = {
        body: {
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          phoneNumber: faker.phone.phoneNumber(),
          password: faker.internet.password()
        }
      };
      userAuthController.register(req, res);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal("\"firstName\" is required");
    });

    it('notGivenEmailInReqBody_whenInvokedRegisterFunc_thenReturnErrorMessage', function () {
      const req = {
        body: {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          phoneNumber: faker.phone.phoneNumber(),
          password: faker.internet.password()
        }
      };
      userAuthController.register(req, res);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal("\"email\" is required");
    });

    it('givenValidArgsInReqBody_whenInvokedRegisterFunc_thenReturnUserRegisteredSuccessfully', function () {
      const req = {
        body: {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          phoneNumber: faker.phone.phoneNumber(),
          password: faker.internet.password(),
          email: faker.internet.email()
        }
      };
      console.log("req", req.body);
      const stubValue = {
        id: faker.datatype.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phoneNumber: faker.phone.phoneNumber(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.past()
      };
      const stub = sinon.stub(userAuthService, "register").returns(stubValue);
      userAuthController.register(req, res);
      //expect(stub.calledOnce).to.be.true;
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(201);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].data).to.equal(stubValue);
    });

  });
});