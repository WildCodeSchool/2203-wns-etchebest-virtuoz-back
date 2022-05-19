import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ---------------------------------- Apollo Server ---------- //

const typeDefs = `
  type User {
    email: String!
    name: String
    password: String
  }
  type Status {
    name: String
  }
  type Query {
    allUsers: [User!]!
    allStatus: [Status!]!
  }
  type Mutation {
    createUser(name: String, email: String,password: String): User
    createStatus(name: String): Status
  }
`;
const resolvers = {
  Query: {
    allUsers: () => prisma.user.findMany(),
    allStatus: () => prisma.status.findMany(),
  },
  Mutation: {
    createUser: async (
      _: any,
      args: { name: any; email: any; password: any }
    ) => {
      const res = await prisma.user.create({
        data: { name: args.name, email: args.email, password: args.password },
      });
      return res;
    },
    createStatus: async (
      _: any,
      args: { name: any }
    ) => {
      const res = await prisma.status.create({
        data: { name: args.name },
      });
      return res;
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
