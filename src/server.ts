import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const typeDefs = `
  type User {
    id: ID
    email: String!
    name: String
    password: String
  }

  type Ticket {
    id: ID
    title: String
    content:     String
    createdAt:   Float
    updatedAt:   Float
    published:   Boolean
    author:      User
    authorId:    Int
  }

  type Query {
    getAllUsers: [User!]!
    getAllTickets: [Ticket!]!
  }
  type Mutation {

    createUser(name: String, email: String, password: String): User

    createTicket(title: String, content: String): Ticket

    updateTicket(id: ID, title: String, content: String): Ticket
  }
`;
const resolvers = {
  Query: {
    getAllUsers: () => prisma.user.findMany(),
    getAllTickets: () => prisma.ticket.findMany(),
  },

  Mutation: {
    createUser: async (
      _: any,
      args: { name: any; email: any; password: any }
    ) => {
      const result = await prisma.user.create({
        data: { name: args.name, email: args.email, password: args.password },
      });
      return result;
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
