# Apollo Codegen Tutorial 따라하기

>[TypeScript GraphQL Code Generator – Generate GraphQL Types with Apollo Codegen Tutorial](https://www.apollographql.com/blog/tooling/apollo-codegen/typescript-graphql-code-generator-generate-graphql-types/)
에 있는 소스코드를 클론해서 tutorial을 따라가며 정리한 자료입니다.


## 💁 연습 내용 

1. GraphQL endpoint 를 사용해서 GraphQL schema 를 다운로드 받습니다.
2. 쿼리에 필요한 생성된 Typescript type 를 Apollo Client 프로젝트에 활용합니다.
3. useQuery 를 사용해 데이터를 패칭하고, loading, error, data 상태에 따른 처리를 해줍니다.
4. useMutation 을 사용해 서버데이터를 변경합니다. 
5. mutation 이후 변경된 서버데이터를 반영하기 위해 1)cache update, 2)refetch, 3)refetchQueries 를 사용해 봅니다.

## 1. apollo codegen 이란?

- graphQL 서버에서 만든 쿼리와 뮤테이션을 typescript 에서 활용하려면 사용할 여러가지 변수에 타입을 다시 지정해주어야 합니다.
- `apollo codegen`을 사용하면 코드, tsx, 리액트 컴포넌트로 가서 쿼리와 뮤테이션을 찾고 자동으로 interface(typescript) 을 만들 수 있습니다.

## 2. 의존성 설치

기본적인 리액트 프로젝트 설정이 끝났다는 가정하에, apollo, graphql 과 관련된 의존성을 설치해줍니다. 

```jsx
npm install --save-dev apollo @types/graphql
```

## 3. 설정파일 만들기

```jsx
// apollo 에게 graphQL 의 존재를 알려준다.
module.exports={
    client : {
        // ./src 폴더의 모든 파일에서 확장자가 .tsx 나 .ts로 끝나는 파일을 검사한다.
        includes : ["./src/**/*.{tsx,ts}"],
        // 위에서 선택된 파일에 있는 모든 gql 태그를 찾는다.
        tagName : "gql",
        // 백엔드 서비스 이름과, 엔드포인트를 알려준다.
        service:{
            name: "ac3-todos-backend",
            url: "http://localhost:4000"
        }
    }
}
```

## 4. graphql schema 다운받기

```jsx
npx apollo service:download --endpoint=http://localhost:4000/ graphql-schema.json
```

apollo CLI 의 `service:download` 위 명령어를 입력하면 graphql-schema.json 파일을 만들어준다. 다음으로 이 스키마파일을 기반으로 typescript 파일을 생성할 수 있게 됩니다.



## 5. 간단한 query 작성 typescript 파일 생성하기

```jsx
// src/operations/queries/getAllTodos.tsx
import { gql } from "@apollo/client";

export const GET_ALL_TODOS = gql`
  query GetAllTodos {
    todos {
      edges {
        node {
          id
          text
          completed
        }
      }
    }
  }
`
```

todo 리스트 전체를 가져오는 query 를 작성합니다. 이 때, 이 쿼리에 사용할 수 있는 typescript 파일을 생성하기 위해 apollo CLI 의 `codegen:generate` 를 사용합니다. 이떄 `localSchemaFile` 은 프론트엔드 폴더에 생성된 graphql-schema.json 을 사용하겠다는 의미입니다. `target` 플래그는 출력 유형을 나타내며, GraphQL 쿼리를 구분하기 위해 CLI 가 코드에서 gql 을 기준으로 구별하겠다는 의미로 `tagName` 플래그를 추가해줍니다. 

```jsx
npx apollo codegen:generate --localSchemaFile=graphql-schema.json --target=typescript --tagName=gql
```

위 명령어를 입력하면 다음의 순서로 typescript 파일이 만들어집니다.

1. 아폴로가 react 에 있는 gql 태그 (쿼리, 뮤테이션)를 찾아냅니다.
2. grapqhQL 서버(백엔드)에 가서 찾아낸 gql 태그에 맞는 typescript (—target 옵션) interface 를 만듭니다.
3. src/__generated__ 폴더 안에 gql 태그의 이름과 동일한 파일로 저장합니다. 

```jsx
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
```

GraphQL schema 를 다운받고, typescript 파일을 만드는 명령어들은 packages.json script 에 등록해두면, 편하게 사용할 수 있습니다.

```jsx
"scripts": {
    //...(생략)
    "download-schema": "apollo service:download --endpoint=http://localhost:4000/ graphql-schema.json",
    "generate": "npm run download-schema && apollo codegen:generate --localSchemaFile=graphql-schema.json --target=typescript --tagName=gql"
  },
```


## 7. useQuery 사용하기

서버에서 데이터를 가져올 때는 @apollo/react-hooks 에서 제공하는 hooks 인 useQuery를 사용합니다. useQuery 가 return 하는 tuple 에는 loading, error, data 등 데이터의 상태를 알 수 있는 값들을 반환합니다. useQuery 의 두번째 인자에 variables 를 사용해 쿼리에 변수를 전달해서, dynamic 한 요청을 가능하게 합니다.

```jsx
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
```

## 7. useMutation 사용하기

graphQL 서버로 데이터 쓰기나 업데이트 요청을 하려면 mutation 을 사용해야 합니다. apollo client 에서는 useMutation hooks 를 제공하는데, useQuery 와 달리 렌더링 시점이 아닌 원하는 액션이 발생했을 때 실행하도록 되어 있습니다. 

우선 [https://studio.apollographql.com/sandbox/explorer](https://studio.apollographql.com/sandbox/explorer) 에서 todolist 를 추가하는 mutation query를 찾아줍니다.

해당 documentation 스펙에 맞게 mutation 을 작성하고 테스트 variables 를 넣어서 응답이 오는것을 확인합니다.

![image](https://user-images.githubusercontent.com/51521314/194812234-8263ba78-97af-4a0c-8fa6-e3014d961927.png)

성공시엔 success: true 와 함께 todo 객체가 오고,  error 가 발생했을 경우에는 error 의 message 가 전달되는 것을 알 수 있습니다. 

해당 mutation이 잘 동작되는 것이 확인됐으니 프로젝트로 옮겨 codegen 을 실행시키고 관련 타입 파일을 만들어줍니다.

```tsx
// operations/mutations/addTodo.tsx
import {gql} from "@apollo/client";

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

```

mutation function 은 서버의 데이터를 변경하기 때문에, 클리이언트의 상태값 또한 업데이트 시켜주어야 합니다.그러기 위해서 mutation function 은 변경된 데이터와 함께 **반드시 id 값을 return 해주어야 합니다.** Apollo client 는 **id 를 기반으로 자동으로 업데이트 시켜줍니다.** 

하지만 위와 같이 단일 건이 아닌, 여러 건의 entity 를 수정, 생성, 삭제를 하게 되면 자동으로 업데이트 시키지 못하기 때문에 useMutation hooks의 update function 을 정의해주어야 합니다. 

## 8.  mutaion 이후에 cache 업데이트 하기

```tsx
// operations/mutations/addTodo.tsx
import {gql} from "@apollo/client";

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
        update(cache, {data}){
            // 새로 서버에 요청한 todo
            const newTodo = data?.addTodo.todo;
            // 기존에 cache memtory 에 존재하던 todos
            const prevTodos = cache.readQuery<getAllTodos>({
                query : GET_ALL_TODOS,
            });
            // local cache update 
            if(prevTodos && newTodo){
                cache.writeQuery({
                    query: GET_ALL_TODOS,
                    data:{
                        todos:{
                            edges:[
                                ...prevTodos?.todos.edges,
                                {__typename: 'TodosEdgs', node: newTodo},
                            ]
                        }
                    }
                })
            }
        }
    });
    
    return {mutate, data, error};
}
```

update function 의 인자로는 cache 객체와, mutation 된 데이터를 줍니다. cache 객체의 readQuery, writeQuery api 를 통해, 데이터를 업데이트 할 수 있도록 해줍니다.

위 `update` function 에서는 AddTodo mutation 이 발생하면 기존 cache 데이터 (prevTodos) 에 새로운 todo(newTodo) 를 더해주고, 해당 데이터를 사용하는 컴포넌트는 새로운 데이터로 업데이트됩니다. 

## 9. mutation 이후에 refetch 사용하기

mutation 을 수행한 이후, 변경된 서버데이터로 클라이언트의 상태값을 업데이터 시켜주는 방법에는 캐시를 업데이트해서 로컬 상태를 수정하는 방법이 있지만, query 를 다시 요청 즉 서버에서 쿼리를 다시 가져와, 클라이언트 측 graphQL 데이터를 업데이트하는 방법이 더 간단한 경우가 있습니다. 

이때 apollo client 에서는 두가지 대표적인 refetching 방법을 제공합니다.

1. refetch
2. refetchQueries

### refetch

`refetch` 는 `useQuery` 의 retrun 값 중 하나이며, 데이터를 다시 한번 fetch 하는 함수입니다. varaibles는 처음 전달한 varaibles 과 동일하게 적용됩니다. 이때, 동일한 variables 를 사용했을 경우 fetchPolicy 에 따라 cache 를 resolve 하는 것을 방지하기 위해 refetch 는 `network-only` 를 기본 fetchPolicy 로 사용합니다.

- **`refetch`** 를 사용한 서버상태 업데이트 예시

```tsx

// MainContainer.tsx 
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

export default function TodoSection({todos, actions}:Props) {
  const onSubmit = (todo:string)=>{
    // mutate 호출
    actions.addTodo(todo);
    // refetch 호출 (서버 상태 업데이트)
    actions.refetchTodos();
  }
  return (
    <>
      <TodoAddInput onSubmit={onSubmit}></TodoAddInput>
      <TodoList todos={todos}/>
    </>
  )
}
```

### refetchQueries

`useMutation` 은 mutation 이후 바로 실행할 query 를 refetchQueries 옵션으로 받고 있습니다. 덕분에, onCompleted 콜백함수에서 refetch 를 호출하지 않더라도 mutation 이후 자동으로 리소스를 재요청할 수 있습니다.

- **`refetchQueries`** 를 사용한 서버상태 업데이트 예시

```tsx
import {gql, useMutation} from "@apollo/client";
import { GET_ALL_TODOS } from "../queries/getAllTodos";
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
    
    return {mutate, data, error};
}
```

## 출처

- [https://www.apollographql.com/docs/react/api/react/hooks/#usequery](https://www.apollographql.com/docs/react/api/react/hooks/#usequery)
- [https://medium.com/humanscape-tech/apollo-client-react-알아보기-cb019131f769](https://medium.com/humanscape-tech/apollo-client-react-%EC%95%8C%EC%95%84%EB%B3%B4%EA%B8%B0-cb019131f769)
