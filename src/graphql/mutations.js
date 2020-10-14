/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createItem = /* GraphQL */ `
  mutation CreateItem(
    $input: CreateItemInput!
    $condition: ModelItemConditionInput
  ) {
    createItem(input: $input, condition: $condition) {
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
export const updateItem = /* GraphQL */ `
  mutation UpdateItem(
    $input: UpdateItemInput!
    $condition: ModelItemConditionInput
  ) {
    updateItem(input: $input, condition: $condition) {
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
export const deleteItem = /* GraphQL */ `
  mutation DeleteItem(
    $input: DeleteItemInput!
    $condition: ModelItemConditionInput
  ) {
    deleteItem(input: $input, condition: $condition) {
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
export const createItemGroup = /* GraphQL */ `
  mutation CreateItemGroup(
    $input: CreateItemGroupInput!
    $condition: ModelItemGroupConditionInput
  ) {
    createItemGroup(input: $input, condition: $condition) {
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
export const updateItemGroup = /* GraphQL */ `
  mutation UpdateItemGroup(
    $input: UpdateItemGroupInput!
    $condition: ModelItemGroupConditionInput
  ) {
    updateItemGroup(input: $input, condition: $condition) {
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
export const deleteItemGroup = /* GraphQL */ `
  mutation DeleteItemGroup(
    $input: DeleteItemGroupInput!
    $condition: ModelItemGroupConditionInput
  ) {
    deleteItemGroup(input: $input, condition: $condition) {
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
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createCart = /* GraphQL */ `
  mutation CreateCart(
    $input: CreateCartInput!
    $condition: ModelCartConditionInput
  ) {
    createCart(input: $input, condition: $condition) {
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
export const updateCart = /* GraphQL */ `
  mutation UpdateCart(
    $input: UpdateCartInput!
    $condition: ModelCartConditionInput
  ) {
    updateCart(input: $input, condition: $condition) {
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
export const deleteCart = /* GraphQL */ `
  mutation DeleteCart(
    $input: DeleteCartInput!
    $condition: ModelCartConditionInput
  ) {
    deleteCart(input: $input, condition: $condition) {
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
export const createCartLog = /* GraphQL */ `
  mutation CreateCartLog(
    $input: CreateCartLogInput!
    $condition: ModelCartLogConditionInput
  ) {
    createCartLog(input: $input, condition: $condition) {
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
export const updateCartLog = /* GraphQL */ `
  mutation UpdateCartLog(
    $input: UpdateCartLogInput!
    $condition: ModelCartLogConditionInput
  ) {
    updateCartLog(input: $input, condition: $condition) {
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
export const deleteCartLog = /* GraphQL */ `
  mutation DeleteCartLog(
    $input: DeleteCartLogInput!
    $condition: ModelCartLogConditionInput
  ) {
    deleteCartLog(input: $input, condition: $condition) {
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
