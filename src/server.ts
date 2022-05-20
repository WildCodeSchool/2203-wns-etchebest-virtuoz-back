import 'reflect-metadata';
import { ApolloServer, gql } from 'apollo-server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ---------------------------------- Apollo Server ---------- //

const typeDefs = gql`
  type User {
    id: ID
    email: String!
    name: String
    password: String
  }
  type Status {
    name: String
  }
  type Query {
    allUsers: [User!]!
    findUserById(id: ID): User
    allStatus: [Status!]!
  }
  type Mutation {
    createUser(name: String, email: String, password: String): User
    deleteUser(id: ID): User
    updateUser(id: ID, name: String, email: String, password: String): User
    createStatus(name: String): Status
  }
`;
const resolvers = {
  Query: {
    allUsers: () => prisma.user.findMany(),
<<<<<<< HEAD
    allStatus: () => prisma.status.findMany(),
=======
    findUserById: async (_: any, args: any) => {
      const { id } = args;
      const res = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
      });
      return res;
    },
>>>>>>> f99d4f84d7fad81d9fdd00c076d3bda35ed5b4d6
  },
  Mutation: {
    createUser: async (_: any, args: any) => {
      const { name, email, password } = args;
      const res = await prisma.user.create({
        data: { name, email, password },
      });
      return res;
    },

    deleteUser: async (_: any, args: any) => {
      const { id } = args;
      const res = await prisma.user.delete({
        where: {
          id: Number(id),
        },
      });
      return res;
    },

    updateUser: async (_: any, args: any) => {
      const { id, name, email, password } = args;
      const res = await prisma.user.update({
        where: {
          id: Number(id),
        },
        data: { name, email, password },
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
