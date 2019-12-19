require('dotenv').config()
const pgPromise = require('pg-promise');

const pgp = pgPromise({}); // Empty object means no additional config required

const config = {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
};

const db = pgp(config);
exports.db = db;



const addProduct = (name, description) => {
    db.one(`INSERT INTO products(name, description) VALUES ('${name}', '${description}') RETURNING name,description`)
        .then(res => {
            console.log(res);
        });
    return ({
        name: name,
        description: description
    });
}

const getProducts = () => {
    return new Promise((resolve, reject) => {
        db.any('SELECT * FROM products')
            .then(res => {
                console.log(res);
                return resolve(
                    res
                )
            });
    })
};

const getProduct = (id) => {
    return new Promise((resolve, reject) => {
        db.one(`SELECT id, name, description FROM products WHERE id='${id}'`)
            .then(res => {
                console.log(res);
                return resolve({
                    name: res.name,
                    description: res.description
                })
            }).catch(error => console.error())
    })
}

const destroyProduct = (id) => {
    return new Promise((resolve, reject) => {
        db.one(`DELETE FROM products WHERE id=${id} RETURNING id, name,description`)
            .then(res => {
                console.log(res);
                return resolve({
                    id: res.id,
                    name: res.name,
                    description: res.description
                })
            })
    })
}


//, function(error, results)

const editProduct = (id, name, description) => {
    return new Promise((resolve, reject) => {
        db.one(`UPDATE products SET name='${name}', description='${description}' WHERE id=${id} RETURNING id, name,description`)
            .then(res => {
                console.log(res);
                return resolve({
                    name: res.name,
                    description: res.description
                })
            });
    })
}

module.exports = {
    getProducts,
    addProduct,
    getProduct,
    editProduct,
    destroyProduct
};






// let products = [
//     {
//         id: 1,
//         name: 'Coca cola',
//         description: 'Es un refresco con gas'
//     },
//     {
//         id: 2,
//         name: 'Tequila',
//         description: 'Es un refresco con gas'
//     },
//     {
//         id: 3,
//         name: 'Tonayan',
//         description: 'Aplica donde quiera'
//     }
// ];

// const addProduct = (name, description) => {
//     const id = products[products.length - 1].id +1;
//     const newProduct = { id, name, description};
//     products = [...products, newProduct];
//     return {...newProduct };
// }

// const getProducts = () => {
//     return products;
// };

// const editProduct = (name, description) => {
//     const id = products[products.length - 1].id +1;
//     const newProduct = { id, name, description};
//     products = [...products, newProduct];
//     return {...newProduct };
// }

// const destroyProduct = (name, description) => {
//     const id = products[products.length - 1].id +1;
//     const newProduct = { id, name, description};
//     products = [...products, newProduct];
//     return {...newProduct };
// }