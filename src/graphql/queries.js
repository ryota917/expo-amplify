/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getItem = /* GraphQL */ `
  query GetItem($id: ID!) {
    getItem(id: $id) {
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
        }
        nextToken
      }
    }
  }
`;
export const listItems = /* GraphQL */ `
  query ListItems(
    $filter: ModelItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      }
      nextToken
    }
  }
`;
export const getItemGroup = /* GraphQL */ `
  query GetItemGroup($id: ID!) {
    getItemGroup(id: $id) {
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
      }
      cartLog {
        id
        userId
        user {
          id
          name
          email
          cartId
          cartLogId
        }
        items {
          nextToken
        }
      }
    }
  }
`;
export const listItemGroups = /* GraphQL */ `
  query ListItemGroups(
    $filter: ModelItemGroupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listItemGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        }
        cartLog {
          id
          userId
        }
      }
      nextToken
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
        }
      }
      cartLogs {
        items {
          id
          userId
        }
        nextToken
      }
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        email
        cartId
        cartLogId
        cart {
          id
          userId
        }
        cartLogs {
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const getCart = /* GraphQL */ `
  query GetCart($id: ID!) {
    getCart(id: $id) {
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
        }
        cartLogs {
          nextToken
        }
      }
    }
  }
`;
export const listCarts = /* GraphQL */ `
  query ListCarts(
    $filter: ModelCartFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCarts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        user {
          id
          name
          email
          cartId
          cartLogId
        }
      }
      nextToken
    }
  }
`;
export const getCartLog = /* GraphQL */ `
  query GetCartLog($id: ID!) {
    getCartLog(id: $id) {
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
        }
        cartLogs {
          nextToken
        }
      }
      items {
        items {
          id
          itemId
          cartLogId
        }
        nextToken
      }
    }
  }
`;
export const listCartLogs = /* GraphQL */ `
  query ListCartLogs(
    $filter: ModelCartLogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCartLogs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        user {
          id
          name
          email
          cartId
          cartLogId
        }
        items {
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const searchItems = /* GraphQL */ `
  query SearchItems(
    $filter: SearchableItemFilterInput
    $sort: SearchableItemSortInput
    $limit: Int
    $nextToken: String
  ) {
    searchItems(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      }
      nextToken
      total
    }
  }
`;
