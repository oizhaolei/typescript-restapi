# Integrating Typscript with Graphql using Type-Graphl, a modern framework for building Graphql Node JS APIs

### To compile the application, run `npm run build-ts`

### To start the server, run `npm start`

## Dependencies

 - Typgoose, `@typegoose/typegoose`  A library for defining Mongoose models using TypeScript classes.
 - Type-Graphl, A library for creating GraphQL schema and resolvers with TypeScript, using `classes` and `decorators magic` :)!
 - Apollo-server-express, `apollo-server-express`, A library for quickly bootstrapping graphql servers with Apollo and Express
  

  ### For a note on other dependencies, please have a look at the `package.json` file. 


  Note: Run `npm install` to install all the projects dependencies...

## Example script

```
mutation createCategory {
  createCategory(data: {
    name: "woman",
    description: "for woman"
  }) {
    id
    name
    description
  }
}
```

```
query returnAllCategories {
  returnAllCategories {
    id
    name
    description
  }
}
```

```
mutation createProduct {
  createProduct(data: {
    name: "shirt",
    description: "red shirt",
    color: "red",
    stock: 22,
    price: 3599,
    category_id: "5fd722aaf05ee11d16ebca33",
  }) {
    name
    description
    color
    stock
    price
    category_id
  }
}
```

```
query  returnAllProduct {
  returnAllProduct {
    id
    name
    description
    color
    stock
    price
    category_id
  }
}
```

```
mutation createCart {
  createCart(data: {
    products: "5fd722aaf05ee11d16ebca33",
  }) {
    id
    products
  }
}
```

```
query returnAllCart {
  returnAllCart {
    id
    products
  }
}
```

```
mutation createUser {
  createUser(data: {
    username: "zhaolei",
    email: "oizhaolei@gmail.com"
    cart_id: "5fd725c3f05ee11d16ebca41"
  }) {
    id
    username
    email
    cart_id
  }
}
```

```
query returnAllUsers {
  returnAllUsers {
    id
    username
    email
    cart_id
  }
}
```

```
mutation createOrder {
  createOrder(data: {
    user_id: "5fd72666f05ee11d16ebca42",
    date: "2020/12/12",
    payde: false,
    products: "5fd72456f05ee11d16ebca3e"
  }) {
    id
    user_id
    date
    payde
    products {
      id
      name
    }
  }
}
```

```
query returnAllOrder {
  returnAllOrder {
    id
    user_id
    payde
    date
    products {
      id
      name
    }
  }
}
```
