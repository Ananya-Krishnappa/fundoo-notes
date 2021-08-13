const faker = require("faker");
class TestData {
  userData = {
    id: faker.datatype.uuid(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phoneNumber: faker.phone.phoneNumber(),
    password: faker.internet.password(),
    email: faker.internet.email(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
}
module.exports = new TestData();
