const { faker } = require("@faker-js/faker");

const generateValidEmail = () => {
  let email;
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  do {
    email = faker.internet.email("", "", "gmail.com");
  } while (!regex.test(email));

  return email;
};

const generateValidUsername = () => {
  let username;
  const regex = /^[a-zA-Z0-9_]+$/;
  do {
    username = faker.internet.userName();
  } while (!regex.test(username));

  return username;
};

const dataUsers = [...Array(20)].map(() => ({
  userName: generateValidUsername(),
  displayName: faker.internet.displayName(),
  email: generateValidEmail(),
  password: 123456,
  verified: faker.datatype.boolean(),
}));

module.exports = { dataUsers };
