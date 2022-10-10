import React from 'react'
import { Todos } from '../../models/Todos'
import TodoAddInput from './TodoAddInput'
import TodoList from './TodoList'

interface Props{
    todos: Todos
    actions: {
      refetchTodos: ()=>void;
      addTodo: (text:string)=>void;
    }
}

export default function TodoSection({todos, actions}:Props) {
  const onSubmit = (todo:string)=>{
    actions.addTodo(todo);
    actions.refetchTodos();
  }
  return (
    <>
      <TodoAddInput onSubmit={onSubmit}></TodoAddInput>
      <TodoList todos={todos}/>
    </>
  )
}
