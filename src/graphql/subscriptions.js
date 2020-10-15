/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateItem = /* GraphQL */ `
  subscription OnCreateItem {
    onCreateItem {
      id
      name
      description
      color
      size
      status
      season
      image_url
      carts {
        items {
          id
          itemId
          cartId
          createdAt
          updatedAt
        }
        nextToken
      }
      cartLogs {
        items {
          id
          itemId
          cartLogId
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateItem = /* GraphQL */ `
  subscription OnUpdateItem {
    onUpdateItem {
      id
      name
      description
      color
      size
      status
      season
      image_url
      carts {
        items {
          id
          itemId
          cartId
          createdAt
          updatedAt
        }
        nextToken
      }
      cartLogs {
        items {
          id
          itemId
          cartLogId
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteItem = /* GraphQL */ `
  subscription OnDeleteItem {
    onDeleteItem {
      id
      name
      description
      color
      size
      status
      season
      image_url
      carts {
        items {
          id
          itemId
          cartId
          createdAt
          updatedAt
        }
        nextToken
      }
      cartLogs {
        items {
          id
          itemId
          cartLogId
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
      id
      name
      email
      cartId
      cart {
        id
        userId
        user {
          id
          name
          email
          cartId
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        items {
          nextToken
        }
      }
      cartLogs {
        items {
          id
          userId
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
      id
      name
      email
      cartId
      cart {
        id
        userId
        user {
          id
          name
          email
          cartId
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        items {
          nextToken
        }
      }
      cartLogs {
        items {
          id
          userId
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
      id
      name
      email
      cartId
      cart {
        id
        userId
        user {
          id
          name
          email
          cartId
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        items {
          nextToken
        }
      }
      cartLogs {
        items {
          id
          userId
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateCart = /* GraphQL */ `
  subscription OnCreateCart {
    onCreateCart {
      id
      userId
      user {
        id
        name
        email
        cartId
        cart {
          id
          userId
          createdAt
          updatedAt
        }
        cartLogs {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      items {
        items {
          id
          itemId
          cartId
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const onUpdateCart = /* GraphQL */ `
  subscription OnUpdateCart {
    onUpdateCart {
      id
      userId
      user {
        id
        name
        email
        cartId
        cart {
          id
          userId
          createdAt
          updatedAt
        }
        cartLogs {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      items {
        items {
          id
          itemId
          cartId
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const onDeleteCart = /* GraphQL */ `
  subscription OnDeleteCart {
    onDeleteCart {
      id
      userId
      user {
        id
        name
        email
        cartId
        cart {
          id
          userId
          createdAt
          updatedAt
        }
        cartLogs {
          nextToken
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      items {
        items {
          id
          itemId
          cartId
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const onCreateCartLog = /* GraphQL */ `
  subscription OnCreateCartLog {
    onCreateCartLog {
      id
      userId
      createdAt
      user {
        id
        name
        email
        cartId
        cart {
          id
          userId
          createdAt
          updatedAt
        }
        cartLogs {
          nextToken
        }
        createdAt
        updatedAt
      }
      items {
        items {
          id
          itemId
          cartLogId
          createdAt
          updatedAt
        }
        nextToken
      }
      updatedAt
    }
  }
`;
export const onUpdateCartLog = /* GraphQL */ `
  subscription OnUpdateCartLog {
    onUpdateCartLog {
      id
      userId
      createdAt
      user {
        id
        name
        email
        cartId
        cart {
          id
          userId
          createdAt
          updatedAt
        }
        cartLogs {
          nextToken
        }
        createdAt
        updatedAt
      }
      items {
        items {
          id
          itemId
          cartLogId
          createdAt
          updatedAt
        }
        nextToken
      }
      updatedAt
    }
  }
`;
export const onDeleteCartLog = /* GraphQL */ `
  subscription OnDeleteCartLog {
    onDeleteCartLog {
      id
      userId
      createdAt
      user {
        id
        name
        email
        cartId
        cart {
          id
          userId
          createdAt
          updatedAt
        }
        cartLogs {
          nextToken
        }
        createdAt
        updatedAt
      }
      items {
        items {
          id
          itemId
          cartLogId
          createdAt
          updatedAt
        }
        nextToken
      }
      updatedAt
    }
  }
`;
export const onCreateItemCart = /* GraphQL */ `
  subscription OnCreateItemCart {
    onCreateItemCart {
      id
      itemId
      cartId
      item {
        id
        name
        description
        color
        size
        status
        season
        image_url
        carts {
          nextToken
        }
        cartLogs {
          nextToken
        }
        createdAt
        updatedAt
      }
      cart {
        id
        userId
        user {
          id
          name
          email
          cartId
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        items {
          nextToken
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateItemCart = /* GraphQL */ `
  subscription OnUpdateItemCart {
    onUpdateItemCart {
      id
      itemId
      cartId
      item {
        id
        name
        description
        color
        size
        status
        season
        image_url
        carts {
          nextToken
        }
        cartLogs {
          nextToken
        }
        createdAt
        updatedAt
      }
      cart {
        id
        userId
        user {
          id
          name
          email
          cartId
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        items {
          nextToken
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteItemCart = /* GraphQL */ `
  subscription OnDeleteItemCart {
    onDeleteItemCart {
      id
      itemId
      cartId
      item {
        id
        name
        description
        color
        size
        status
        season
        image_url
        carts {
          nextToken
        }
        cartLogs {
          nextToken
        }
        createdAt
        updatedAt
      }
      cart {
        id
        userId
        user {
          id
          name
          email
          cartId
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        items {
          nextToken
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateItemCartLog = /* GraphQL */ `
  subscription OnCreateItemCartLog {
    onCreateItemCartLog {
      id
      itemId
      cartLogId
      item {
        id
        name
        description
        color
        size
        status
        season
        image_url
        carts {
          nextToken
        }
        cartLogs {
          nextToken
        }
        createdAt
        updatedAt
      }
      cartLog {
        id
        userId
        createdAt
        user {
          id
          name
          email
          cartId
          createdAt
          updatedAt
        }
        items {
          nextToken
        }
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateItemCartLog = /* GraphQL */ `
  subscription OnUpdateItemCartLog {
    onUpdateItemCartLog {
      id
      itemId
      cartLogId
      item {
        id
        name
        description
        color
        size
        status
        season
        image_url
        carts {
          nextToken
        }
        cartLogs {
          nextToken
        }
        createdAt
        updatedAt
      }
      cartLog {
        id
        userId
        createdAt
        user {
          id
          name
          email
          cartId
          createdAt
          updatedAt
        }
        items {
          nextToken
        }
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteItemCartLog = /* GraphQL */ `
  subscription OnDeleteItemCartLog {
    onDeleteItemCartLog {
      id
      itemId
      cartLogId
      item {
        id
        name
        description
        color
        size
        status
        season
        image_url
        carts {
          nextToken
        }
        cartLogs {
          nextToken
        }
        createdAt
        updatedAt
      }
      cartLog {
        id
        userId
        createdAt
        user {
          id
          name
          email
          cartId
          createdAt
          updatedAt
        }
        items {
          nextToken
        }
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
