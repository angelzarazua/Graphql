var express = require('express');
var app = express();

var graphqlHTTP = require('express-graphql');
var {buildSchema} = require('graphql');
var cors = require('cors');
var { getProducts, addProduct, getProduct, editProduct, destroyProduct } = require('./data/products');


//Add cors
app.use(cors())

var schema = buildSchema(`
    type Product {
        description: String,
        name: String,
        id: Int
    },
    type Query {
        hello: String,
        products: [Product],
        product(id: Int!): Product,
    },
    type Mutation {
        createProduct(name: String!, description: String!): Product,
        editProduct(id: Int!, name: String!, description: String!): Product,
        destroyProduct(id: Int!): Product
    }
    `);

// The root provides a resolver function  for each API endpoint
var root = {
    hello: () => {
        return 'Hello World';
    },
    products: ()  => {
        return getProducts();
    },
    product: ({id}) => {
        //const products = getProducts();
        //return products.find(p => p.id === id);
        return getProduct(id);
    },
    createProduct: args => {
        const {name, description} = args;
        return addProduct(name, description);
    },
    editProduct: args => {
        const {id, name, description} = args;
        return editProduct(id, name, description);
    },
    destroyProduct: ({id}) => {
        return destroyProduct(id);
    }
}

//Create Server Graphql
app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true
    })
);

app.listen(3000);
console.log('Running in: ' + 'http://localhost:3000/graphql');
