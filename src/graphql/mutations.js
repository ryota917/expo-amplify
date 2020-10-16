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
      itemCarts {
        items {
          id
          itemId
          cartId
          createdAt
          updatedAt
        }
        nextToken
      }
      itemCartLogs {
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
      itemCarts {
        items {
          id
          itemId
          cartId
          createdAt
          updatedAt
        }
        nextToken
      }
      itemCartLogs {
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
      itemCarts {
        items {
          id
          itemId
          cartId
          createdAt
          updatedAt
        }
        nextToken
      }
      itemCartLogs {
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
        itemCarts {
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
        itemCarts {
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
        itemCarts {
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
      itemCarts {
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
      itemCarts {
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
      itemCarts {
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
      itemCartLogs {
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
      itemCartLogs {
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
      itemCartLogs {
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
export const createItemCart = /* GraphQL */ `
  mutation CreateItemCart(
    $input: CreateItemCartInput!
    $condition: ModelItemCartConditionInput
  ) {
    createItemCart(input: $input, condition: $condition) {
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
        itemCarts {
          nextToken
        }
        itemCartLogs {
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
        itemCarts {
          nextToken
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateItemCart = /* GraphQL */ `
  mutation UpdateItemCart(
    $input: UpdateItemCartInput!
    $condition: ModelItemCartConditionInput
  ) {
    updateItemCart(input: $input, condition: $condition) {
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
        itemCarts {
          nextToken
        }
        itemCartLogs {
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
        itemCarts {
          nextToken
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteItemCart = /* GraphQL */ `
  mutation DeleteItemCart(
    $input: DeleteItemCartInput!
    $condition: ModelItemCartConditionInput
  ) {
    deleteItemCart(input: $input, condition: $condition) {
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
        itemCarts {
          nextToken
        }
        itemCartLogs {
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
        itemCarts {
          nextToken
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const createItemCartLog = /* GraphQL */ `
  mutation CreateItemCartLog(
    $input: CreateItemCartLogInput!
    $condition: ModelItemCartLogConditionInput
  ) {
    createItemCartLog(input: $input, condition: $condition) {
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
        itemCarts {
          nextToken
        }
        itemCartLogs {
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
        itemCartLogs {
          nextToken
        }
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateItemCartLog = /* GraphQL */ `
  mutation UpdateItemCartLog(
    $input: UpdateItemCartLogInput!
    $condition: ModelItemCartLogConditionInput
  ) {
    updateItemCartLog(input: $input, condition: $condition) {
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
        itemCarts {
          nextToken
        }
        itemCartLogs {
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
        itemCartLogs {
          nextToken
        }
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteItemCartLog = /* GraphQL */ `
  mutation DeleteItemCartLog(
    $input: DeleteItemCartLogInput!
    $condition: ModelItemCartLogConditionInput
  ) {
    deleteItemCartLog(input: $input, condition: $condition) {
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
        itemCarts {
          nextToken
        }
        itemCartLogs {
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
        itemCartLogs {
          nextToken
        }
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
