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
  noteData = {
    title: faker.lorem.word(),
    description: faker.lorem.word(),
    userId: faker.datatype.uuid(),
    isPinned: faker.datatype.boolean(),
  };
}
module.exports = new TestData();
