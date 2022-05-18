import 'reflect-metadata';
import mysql from 'mysql2';
import { ApolloServer } from 'apollo-server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// async function main() {
//   // ... you will write your Prisma Client queries here
//   const post = await prisma.post.update({
//     where: { id: 1 },
//     data: { published: false },
//   });
//   console.log(post);
// }

// main()
//   .catch((e) => {
//     throw e;
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
// ------------------- for check connection change host, user, password ------------------ //

const con = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
});

con.connect((err: any) => {
  if (err) throw err;
  console.log('Connected!');
});

const typeDefs = `
  type User {
    email: String!
    name: String
  }
  type Query {
    allUsers: [User!]!
  }
`;
const resolvers = {
  Query: {
    allUsers: () => prisma.user.findMany(),
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
