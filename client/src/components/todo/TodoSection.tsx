import React from 'react'
import { Todos } from '../../models/Todos'
import TodoAddInput from './TodoAddInput'
import TodoList from './TodoList'

interface Props{
    todos: Todos
    actions: {
      addTodo: (text:string)=>void;
    }
}

export default function TodoSection({todos, actions}:Props) {
 const onSubmit = (text: string)=>{
  actions.addTodo(text);
 }

  return (
    <>
      <TodoAddInput onSubmit={onSubmit}></TodoAddInput>
      <TodoList todos={todos}/>
    </>
  )
}
