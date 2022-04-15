import mysql from 'mysql2';
import { graphql, buildSchema } from 'graphql';

// ------------------- for check connection change host, user, password ------------------ //

const con = mysql.createConnection({
  host: '127.0.0.1',
  user: 'admin',
  password: 'Pa$$W0rd',
});

con.connect((err: any) => {
  if (err) throw err;
  console.log('Connected!');
});

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The rootValue provides a resolver function for each API endpoint
const rootValue = {
  hello: () => 'Hello world!',
};

// Run the GraphQL query '{ hello }' and print out the response
graphql({
  schema,
  source: '{ hello }',
  rootValue,
}).then((response) => {
  console.log(response);
});
