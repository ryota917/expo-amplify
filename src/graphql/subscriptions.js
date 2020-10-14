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
export const onCreateItemGroup = /* GraphQL */ `
  subscription OnCreateItemGroup {
    onCreateItemGroup {
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
          cartLogId
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
export const onUpdateItemGroup = /* GraphQL */ `
  subscription OnUpdateItemGroup {
    onUpdateItemGroup {
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
          cartLogId
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
export const onDeleteItemGroup = /* GraphQL */ `
  subscription OnDeleteItemGroup {
    onDeleteItemGroup {
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
          cartLogId
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
      id
      name
      email
      cartId
      cartLogId
      cart {
        id
        userId
        user {
          id
          name
          email
          cartId
          cartLogId
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
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
      cartLogId
      cart {
        id
        userId
        user {
          id
          name
          email
          cartId
          cartLogId
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
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
      cartLogId
      cart {
        id
        userId
        user {
          id
          name
          email
          cartId
          cartLogId
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
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
        cartLogId
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
        cartLogId
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
        cartLogId
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
        cartLogId
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
        cartLogId
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
        cartLogId
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
