import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ---------------------------------- Apollo Server ---------- //

const typeDefs = `
  type User {
    id: ID
    email: String!
    name: String
    password: String
  }

  type Project {
    id: ID
    title: String
    description: String
    createdAt: String
  }

  type Query {
    getAllUsers: [User!]!
    getOneUser(id: ID): User
  
    getAllProject: [Project!]!
    getOneProject(id: ID): Project
  }

  type Mutation {
    createUser(name: String, email: String, password: String): User
    updateUser(id: ID, name: String, email: String, password: String): User
    deleteUser(id: ID): User

    createProject(title: String, description: String, createdAt: String): Project
    updateProject(id: ID, title: String, description: String, finishedAt: String): Project
    deleteProject(id: ID): Project
  }
`;
const resolvers = {
  Query: {
    getAllUsers: () => prisma.user.findMany(),
    getOneUser: async (_: any, args: any) => {
      const result = await prisma.user.findUnique(args.id);
      return result;
    },
    getAllProject: () => prisma.project.findMany(),
    getOneProject: async (_: any, args: any) => {
      const result = await prisma.project.findUnique(args.id);
      return result;
    },
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
    updateUser: async (_: any, args: any) => {
      const res = await prisma.user.update({
        where: {
          id: Number(args.id),
        },
        data: {
          name: args.name,
          email: args.email,
          password: args.password,
        },
      });
      return res;
    },
    deleteUser: async (_: any, args: any) => {
      const result = await prisma.user.delete({
        where: { id: Number(args.id) },
      });
      return result;
    },

    createProject: async (
      _: any,
      args: {
        title: any;
        description: any;
        createdAt: any;
      }
    ) => {
      const res = await prisma.project.create({
        data: {
          title: args.title,
          description: args.description,
          createdAt: args.createdAt,
        },
      });
      return res;
    },
    updateProject: async (_: any, args: any) => {
      const res = await prisma.project.update({
        where: {
          id: Number(args.id),
        },
        data: {
          title: args.title,
          description: args.description,
          finishedAt: args.finishedAt,
        },
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
