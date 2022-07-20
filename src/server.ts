import 'reflect-metadata';
import { ApolloError, ApolloServer, gql } from 'apollo-server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const jwtKey = 'my_secret_key_that_must_be_very_long';

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

    getAllProject: [Project!]!
    findProjectById(id: ID): Project

    getAllTickets: [Ticket!]!

    login(email: String, password: String): String
  }

  type Mutation {
    createUser(name: String, email: String, password: String): User
    deleteUser(id: ID): User
    updateUser(id: ID, name: String, email: String, password: String): User

    createStatus(name: String): Status

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
    getAllUsers: (parents: any, args: any, context: any, info: any) => {
      if (context.authenticatedUserEmail) {
        return prisma.user.findMany();
      }
      throw new ApolloError('Invalid auth');
    },
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

    login: async (parent: any, args: any, context: any, info: any) => {
      const user = await prisma.user.findUnique({
        where: {
          email: args.email,
        },
      });
      if (user && bcrypt.compareSync(args.password, user.password)) {
        const token = jwt.sign(
          {
            user: user.email,
          },
          jwtKey
        );
        return token;
      }
      throw new ApolloError('Invalid credentials');
    },
  },

  Mutation: {
    createUser: async (_: any, args: any) => {
      const { name, email, password } = args;
      const res = await prisma.user.create({
        data: { name, email, password: bcrypt.hashSync(password, 10) },
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
    // createTicket: async (
    //   _: any,
    //   args: { title: any; content: any; status: any }
    // ) => {
    //   const result = await prisma.ticket.create({
    //     data: { title: args.title, content: args.content, status: args.status },
    //   });
    //   return result;
    // },

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
const server = new ApolloServer({
  typeDefs,
  resolvers,

  context: ({ req }) => {
    const token = req.headers.authorization;
    if (token) {
      let payload;
      try {
        payload = jwt.verify(token, jwtKey) as { user: string };
        return { authenticatedUserEmail: payload.user };
      } catch (err) {
        return { authenticatedUserEmail: null };
      }
    }
    return { authenticatedUserEmail: null };
  },
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
