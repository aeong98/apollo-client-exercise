import { useQuery } from '@apollo/client'
import React from 'react'
import TodoList from '../todo/TodoList'

import { GET_ALL_TODOS } from '../../operations/queries/getAllTodos'
import { getAllTodos } from '../../operations/queries/__generated__/getAllTodos'

export default function MainContainer() {
    const {loading, data, error} = useQuery<getAllTodos>(GET_ALL_TODOS);
    console.log(data);

    if(loading) return <div>Loading...</div>
    if(error) return <div>Error ocurred {JSON.stringify(error)}</div>
    if(!data) return <div>None</div>

    const todos = data.todos.edges.map((todo)=>todo?.node);

    return (
        <div>MainContainer</div>
    )
}
