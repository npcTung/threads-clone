import { faker } from "@faker-js/faker";

export const dataPosts = [...Array(20)].map(() => ({
  id: faker.number.int(),
  user: {
    avatarUrl: faker.image.avatar(),
    userName: faker.internet.userName(),
    displayName: faker.internet.displayName(),
    following: faker.number.int({ min: 10, max: 99999999 }),
    follower: faker.number.int({ min: 10, max: 99999999 }),
    gender: faker.person.sex(),
    bio: faker.person.bio(),
    posts: faker.number.int({ min: 10, max: 9999999 }),
  },
  context: faker.word.words(),
  imageUrl: [...Array(Math.floor(Math.random() * (10 - 1 + 1) + 1))].map(
    () => ({
      type: "IMAGE",
      url: faker.image.urlPicsumPhotos(),
    })
  ),
  likes: faker.number.int({ min: 10, max: 99999999 }),
  comments: faker.number.int({ min: 10, max: 99999999 }),
  createdAt: faker.date.recent(),
}));

export const dataPost = {
  id: faker.number.int(),
  user: {
    avatarUrl: faker.image.avatar(),
    userName: faker.internet.userName(),
    displayName: faker.internet.displayName(),
    following: faker.number.int({ min: 10, max: 99999999 }),
    follower: faker.number.int({ min: 10, max: 99999999 }),
    gender: faker.person.sex(),
    bio: faker.person.bio(),
    posts: faker.number.int({ min: 10, max: 9999999 }),
  },
  context: faker.word.words(),
  imageUrl: [...Array(Math.floor(Math.random() * (10 - 1 + 1) + 1))].map(
    () => ({
      type: "IMAGE",
      url: faker.image.urlPicsumPhotos(),
    })
  ),
  likes: faker.number.int({ min: 10, max: 99999999 }),
  comments: faker.number.int({ min: 10, max: 99999999 }),
  createdAt: faker.date.recent(),
};

export const users = [...Array(20)].map(() => ({
  id: faker.number.int(),
  avatarUrl: faker.image.avatar(),
  userName: faker.internet.userName(),
  displayName: faker.internet.displayName(),
  following: faker.number.int({ min: 10, max: 99999999 }),
  follower: faker.number.int({ min: 10, max: 99999999 }),
  gender: faker.person.sex(),
  bio: faker.person.bio(),
  posts: faker.number.int({ min: 10, max: 9999999 }),
  link: faker.internet.url(),
  createdAt: faker.date.past(),
}));

export const user = {
  avatarUrl: faker.image.avatar(),
  userName: faker.internet.userName(),
  displayName: faker.internet.displayName(),
  following: faker.number.int({ min: 10, max: 99999999 }),
  follower: faker.number.int({ min: 10, max: 99999999 }),
  gender: faker.person.sex(),
  bio: faker.person.bio(),
  posts: faker.number.int({ min: 10, max: 9999999 }),
  link: faker.internet.url(),
  createdAt: faker.date.past(),
};

export const dataComments = [...Array(20)].map(() => ({
  id: faker.number.int(),
  user: {
    avatarUrl: faker.image.avatar(),
    userName: faker.internet.userName(),
    displayName: faker.internet.userName(),
    following: faker.number.int({ min: 10, max: 99999999 }),
    follower: faker.number.int({ min: 10, max: 99999999 }),
    gender: faker.person.sex(),
    bio: faker.person.bio(),
    posts: faker.number.int({ min: 10, max: 9999999 }),
  },
  comment: faker.lorem.sentence(),
  likes: faker.number.int({ min: 10, max: 99999999 }),
  createdAt: faker.date.recent(),
}));

export * from "./country";
