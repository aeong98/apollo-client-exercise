/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getAllTodos
// ====================================================

export interface getAllTodos_todos_edges_node {
  __typename: "Todo";
  id: number;
  text: string;
  completed: boolean;
}

export interface getAllTodos_todos_edges {
  __typename: "TodosEdge";
  node: getAllTodos_todos_edges_node;
}

export interface getAllTodos_todos {
  __typename: "TodosConnection";
  edges: (getAllTodos_todos_edges | null)[];
}

export interface getAllTodos {
  todos: getAllTodos_todos;
}
