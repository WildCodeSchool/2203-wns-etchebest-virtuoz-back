import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ----------------------------------- Querying the database ---------------//

async function main() {
  // ... you will write your Prisma Client queries here

  // -------------------  create ---------------------- //
  //   await prisma.user.create({
  //     data: {
  //       name: 'Alice',
  //       email: 'alice@prisma.io',
  //       posts: {
  //         create: { title: 'Hello World' },
  //       },
  //       profile: {
  //         create: { bio: 'I like turtles' },
  //       },
  //     },
  //   })

  //   const allUsers = await prisma.user.findMany({
  //     include: {
  //       posts: true,
  //       profile: true,
  //     },
  //   })
  //   console.dir(allUsers, { depth: null })
  // }

  // -------------------- update --------------------------- //
  //   const post = await prisma.post.update({
  //     where: { id: 1 },
  //     data: { published: true },
  //   });
  //   console.log(post);
  // }

  //   const deletedUser = await prisma.user.delete({
  //     where: { id: 1 },
  //   });
  //   console.log(deletedUser);
  // }

  // ------------------- findMany -------------------------- //
  const allUsers = await prisma.user.findMany();
  console.log(allUsers);
}

// ----------- call to main and DB Disconnection ------------ //
main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
