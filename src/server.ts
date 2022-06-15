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
    id: ID
    name: String
  }
  type Project {
    id: ID
    title: String
    description: String
    createdAt: String
  }

  type Ticket {
    id: ID
    title: String
    content: String
    createdAt: Float
    updatedAt: Float
    published: Boolean
    author: User
    authorId: Int
  }

  type Query {
    getAllUsers: [User!]!

    findUserById(id: ID): User

    getAllStatus: [Status!]!
    findStatusById(id: ID): Status

    getAllProject: [Project!]!
    findProjectById(id: ID): Project

    getAllTickets: [Ticket!]!
  }

  type Mutation {
    createUser(name: String, email: String, password: String): User
    deleteUser(id: ID): User
    updateUser(id: ID, name: String, email: String, password: String): User

    createStatus(name: String): Status
    updateStatus(id: ID, name: String): Status
    deleteStatus(id: ID): Status

    createProject(
      title: String
      description: String
      createdAt: String
    ): Project
    updateProject(
      id: ID
      title: String
      description: String
      finishedAt: String
    ): Project
    deleteProject(id: ID): Project

    createTicket(title: String, content: String): Ticket
    updateTicket(id: ID, title: String, content: String): Ticket
  }
`;
const resolvers = {
  Query: {
    getAllUsers: () => prisma.user.findMany(),
    getAllTickets: () => prisma.ticket.findMany(),
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
    findStatusById: async (_: any, args: any) => {
      const res = await prisma.status.findUnique(args.id);
      return res;
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
    createStatus: async (_: any, args: { name: any }) => {
      const res = await prisma.status.create({
        data: { name: args.name },
      });
      return res;
    },
    deleteStatus: async (_: any, args: any) => {
      const { id } = args;
      const res = prisma.status.delete({
        where: {
          id: Number(id),
        },
      });
      return res;
    },
    updateStatus: async (_: any, args: any) => {
      const res = await prisma.status.update({
        where: {
          id: Number(args.id),
        },
        data: {
          name: args.name,
        },
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
    createTicket: async (_: any, args: { title: any; content: any }) => {
      const result = await prisma.ticket.create({
        data: { title: args.title, content: args.content },
      });
      return result;
    },

    updateTicket: async (_: any, args: any) => {
      const result = await prisma.ticket.update({
        where: { id: Number(args.id) },
        data: { title: args.title, content: args.content },
      });
      return result;
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
