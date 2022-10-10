import React from 'react'
import { Todos } from '../../models/Todos'

interface Props{
  todos: Todos
}

export default function TodoList({todos}:Props) {

  return (
    <>
    {todos.map(todo=> todo!==null && 
      <div key={`todo-${todo.id}`}>{todo.text}</div>
    )}
    </>
  )
}
