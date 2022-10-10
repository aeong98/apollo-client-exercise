import {gql, useMutation} from "@apollo/client";
import { GET_ALL_TODOS } from "../queries/getAllTodos";
import { getAllTodos } from "../queries/__generated__/getAllTodos";
import { AddTodo, AddTodoVariables } from "./__generated__/AddTodo";

export const ADD_TODO = gql`
    mutation AddTodo($text: String!) {
        addTodo(text : $text){
            success
            todo{
                id
                text
                completed
            }
            error{
                message
            }
        }
    }
`;


export function useAddTodo(){
    const [mutate, {data, error}] = useMutation<AddTodo, AddTodoVariables>(ADD_TODO,{
        // update(cache, {data}){
        //     // 새로 서버에 요청한 todo
        //     const newTodo = data?.addTodo.todo;
        //     // 기존에 cache memtory 에 존재하던 todos
        //     const prevTodos = cache.readQuery<getAllTodos>({
        //         query : GET_ALL_TODOS,
        //     })
        //     // local cache update 
        //     if(prevTodos && newTodo){
        //         cache.writeQuery({
        //             query: GET_ALL_TODOS,
        //             data:{
        //                 todos:{
        //                     edges:[
        //                         ...prevTodos?.todos.edges,
        //                         {__typename: 'TodosEdgs', node: newTodo},
        //                     ]
        //                 }
        //             }
        //         })
        //     }
        // }
    });
    
    return {mutate, data, error};
}