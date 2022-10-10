import { useQuery } from '@apollo/client'
import React from 'react'
import TodoList from '../todo/TodoList'

import { GET_ALL_TODOS } from '../../operations/queries/getAllTodos'
import { getAllTodos } from '../../operations/queries/__generated__/getAllTodos'
import { useAddTodo } from '../../operations/mutations/addTodo'
import TodoSection from '../todo/TodoSection'

export default function MainContainer() {
    const {loading: allTodosLoading, data : allTodosData, error : allTodosError, refetch: refechAllTodos} = useQuery<getAllTodos>(GET_ALL_TODOS);
    const {mutate: addTodo, data : addTodoData, error: addTodoError} = useAddTodo();

    if(allTodosLoading) return <div>Loading...</div>
    if(allTodosError) return <div>Error ocurred {JSON.stringify(allTodosError)}</div>
    if(!allTodosData) return <div>None</div>

    const todos = allTodosData.todos.edges.map((todo)=>todo? todo.node: null);

    return (
        <TodoSection 
            todos={todos}
            actions={{
                refetchTodos: refechAllTodos,
                addTodo: (text:string)=>addTodo({variables: {text}})
            }}
        />
    )
}
