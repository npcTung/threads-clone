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

const context = () => {
  let words = "";

  while (words.length < 500) {
    const newWords = faker.word.words();
    if (words.length + newWords.length + 1 > 500) break;

    words += (words ? " " : "") + newWords;

    return words;
  }
};

export const chatList = [...Array(20)].map((_, idx) => ({
  id: idx,
  url: faker.image.avatar(),
  name: faker.internet.userName(),
  msg: context(),
  time: Date(faker.date.recent()),
  unread: Math.floor(Math.random() * 100) + 1,
  online: faker.datatype.boolean(),
}));

const read_receipt_arr = ["sent", "read", "delivered"];

export const Chat_History = [
  {
    type: "msg",
    subType: "mes",
    message: faker.word.words(Math.floor(Math.random() * 200) + 1),
    incoming: faker.datatype.boolean(),
    read_receipt:
      read_receipt_arr[Math.floor(Math.random() * read_receipt_arr.length)],
  },
  {
    type: "msg",
    subType: "mes",
    message: faker.word.words(Math.floor(Math.random() * 200) + 1),
    incoming: faker.datatype.boolean(),
    read_receipt:
      read_receipt_arr[Math.floor(Math.random() * read_receipt_arr.length)],
  },
  {
    type: "separator",
    time: Date(faker.date.recent()),
  },
  {
    type: "msg",
    subType: "mes",
    message: faker.word.words(Math.floor(Math.random() * 200) + 1),
    incoming: faker.datatype.boolean(),
    read_receipt:
      read_receipt_arr[Math.floor(Math.random() * read_receipt_arr.length)],
  },
  {
    type: "msg",
    subType: "mes",
    message: "Ya sure, sending you a pic",
    incoming: faker.datatype.boolean(),
    read_receipt:
      read_receipt_arr[Math.floor(Math.random() * read_receipt_arr.length)],
  },
  {
    type: "msg",
    subType: "doc",
    message: faker.word.words(Math.floor(Math.random() * 200) + 1),
    incoming: faker.datatype.boolean(),
    read_receipt:
      read_receipt_arr[Math.floor(Math.random() * read_receipt_arr.length)],
  },
  {
    type: "msg",
    subType: "img",
    message: faker.word.words(Math.floor(Math.random() * 200) + 1),
    incoming: faker.datatype.boolean(),
    read_receipt:
      read_receipt_arr[Math.floor(Math.random() * read_receipt_arr.length)],
    images: [...Array(Math.floor(Math.random() * 20) + 1)].map(() =>
      faker.image.urlPicsumPhotos()
    ),
  },
  {
    type: "msg",
    subType: "voice",
    message: faker.word.words(Math.floor(Math.random() * 200) + 1),
    incoming: faker.datatype.boolean(),
    read_receipt:
      read_receipt_arr[Math.floor(Math.random() * read_receipt_arr.length)],
  },
  {
    type: "separator",
    time: Date(faker.date.recent()),
  },
  {
    type: "msg",
    subType: "mes",
    message: faker.word.words(Math.floor(Math.random() * 200) + 1),
    incoming: faker.datatype.boolean(),
    read_receipt:
      read_receipt_arr[Math.floor(Math.random() * read_receipt_arr.length)],
  },
  {
    type: "msg",
    subType: "doc",
    message: "https://youtu.be/kyVBtz9-b1U?si=NQSset5wAvdfsOr5",
    incoming: faker.datatype.boolean(),
    read_receipt:
      read_receipt_arr[Math.floor(Math.random() * read_receipt_arr.length)],
  },
  {
    type: "msg",
    subType: "mes",
    message: `${faker.word.words(
      Math.floor(Math.random() * 50) + 1
    )} https://www.facebook.com/reel/1338719127479152`,
    incoming: faker.datatype.boolean(),
    read_receipt:
      read_receipt_arr[Math.floor(Math.random() * read_receipt_arr.length)],
  },
  {
    type: "msg",
    subType: "mes",
    message: faker.word.words(Math.floor(Math.random() * 200) + 1),
    incoming: faker.datatype.boolean(),
    read_receipt:
      read_receipt_arr[Math.floor(Math.random() * read_receipt_arr.length)],
  },
  {
    type: "msg",
    subType: "voice",
    message: faker.word.words(Math.floor(Math.random() * 200) + 1),
    incoming: faker.datatype.boolean(),
    read_receipt:
      read_receipt_arr[Math.floor(Math.random() * read_receipt_arr.length)],
  },
  {
    type: "msg",
    subType: "mes",
    message: faker.word.words(Math.floor(Math.random() * 200) + 1),
    incoming: faker.datatype.boolean(),
    read_receipt:
      read_receipt_arr[Math.floor(Math.random() * read_receipt_arr.length)],
  },
  {
    type: "msg",
    subType: "img",
    message: faker.word.words(Math.floor(Math.random() * 200) + 1),
    incoming: faker.datatype.boolean(),
    read_receipt:
      read_receipt_arr[Math.floor(Math.random() * read_receipt_arr.length)],
    images: [...Array(Math.floor(Math.random() * 20) + 1)].map(() =>
      faker.image.urlPicsumPhotos()
    ),
  },
  {
    type: "separator",
    time: Date(faker.date.recent()),
  },
  {
    type: "msg",
    subType: "mes",
    message: faker.word.words(Math.floor(Math.random() * 200) + 1),
    incoming: faker.datatype.boolean(),
    read_receipt:
      read_receipt_arr[Math.floor(Math.random() * read_receipt_arr.length)],
  },
  {
    type: "msg",
    subType: "mes",
    message: faker.word.words(Math.floor(Math.random() * 200) + 1),
    incoming: faker.datatype.boolean(),
    read_receipt:
      read_receipt_arr[Math.floor(Math.random() * read_receipt_arr.length)],
  },
];

export * from "./country";
