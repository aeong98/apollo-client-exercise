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
        refetchQueries: [{query: GET_ALL_TODOS}],
        // true : mutation 이 완료되기 전에, refetchQueries 에 포함된 queries 을 업데이트 시켜줍니다. 
        // (false: queries are refetched asynchronously)
        awaitRefetchQueries: true,

        // 아래는 클라이언트 local cache 를 업데이트 시켜주는 부분
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