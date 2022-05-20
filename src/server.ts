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
  type Project {
    id: ID
    title: String
    description: String
    createdAt: String
  }
  type Query {
    getAllUsers: [User!]!
    findUserById(id: ID): User

    getAllStatus: [Status!]!

    getAllProject: [Project!]!
    findProjectById(id: ID): Project
  }

  type Mutation {
    createUser(name: String, email: String, password: String): User
    deleteUser(id: ID): User
    updateUser(id: ID, name: String, email: String, password: String): User

    createStatus(name: String): Status
    
    createProject(title: String, description: String, createdAt: String): Project
    updateProject(id: ID, title: String, description: String, finishedAt: String): Project
    deleteProject(id: ID): Project
  }
`;
const resolvers = {
  Query: {
    getAllUsers: () => prisma.user.findMany(),
    getAllStatus: () => prisma.status.findMany(),
    findUserById: async (_: any, args: any) => {
      const { id } = args;
      const res = await prisma.user.findUnique({
        where: {
          id: Number(id),
        },
      });
      return res;
    },
    getAllProject: () => prisma.project.findMany(),
    findProjectById: async (_: any, args: any) => {
      const result = await prisma.project.findUnique(args.id);
      return result;
    },
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
    deleteProject: async (_: any, args: any) => {
      const res = await prisma.project.delete({
        where: { id: Number(args.id) },
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
