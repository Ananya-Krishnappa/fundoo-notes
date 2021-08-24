const chai = require("chai");
const sinon = require("sinon");
const faker = require("faker");
const expect = chai.expect;
const noteController = require("../../app/controllers/note");
describe("Note APIs", function () {
  describe("create", function () {
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

    it("givenAnEmptyJsonObjectInReqBody_whenInvokedCreateFunc_thenReturnErrorMessage", function () {
      const req = {
        body: {},
      };
      noteController.create(req, res);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal(
        "Invalid Params. Usage: { 'title': '<title>','description': '<description>', 'userId': '<userId>'"
      );
    });
    it("notGivenTitleInReqBody_whenInvokedCreateFunc_thenReturnErrorMessage", function () {
      const req = {
        body: {
          description: faker.lorem.sentence(),
          userId: faker.datatype.uuid(),
        },
      };
      noteController.create(req, res);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('"title" is required');
    });
    it("notGivenUserIdInReqBody_whenInvokedCreateFunc_thenReturnErrorMessage", function () {
      const req = {
        body: {
          title: faker.lorem.words(),
          description: faker.lorem.sentence(),
        },
      };
      noteController.create(req, res);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('"userId" is required');
    });
    it("notGivenDescriptionInReqBody_whenInvokedCreateFunc_thenReturnErrorMessage", function () {
      const req = {
        body: {
          title: faker.lorem.words(),
          userId: faker.datatype.uuid(),
        },
      };
      noteController.create(req, res);
      expect(status.calledOnce).to.be.true;
      expect(status.args[0][0]).to.equal(400);
      expect(json.calledOnce).to.be.true;
      expect(json.args[0][0].message).to.equal('"description" is required');
    });
  });
});
