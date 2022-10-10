# Apollo Codegen Tutorial 따라하기

>[TypeScript GraphQL Code Generator – Generate GraphQL Types with Apollo Codegen Tutorial](https://github.com/apollographql/ac3-state-management-examples/blob/master/apollo-remote-state-advanced-cache-apis/client/apollo.config.js)
에 있는 소스코드를 클론해서 tutorial을 따라가며 정리한 자료입니다.


1. GraphQL endpoint 를 사용해서 GraphQL schema 를 다운로드 받습니다.
2. 쿼리에 필요한 생성된 Typescript type 를 Apollo Client 프로젝트에 활용합니다.

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

### 5. 간단한 query 작성 typescript 파일 생성하기

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


### 6. 타입 사용하기

우선 생성된 __generated_ type 을 가지고 프로젝트에 사용할 수 있는 Todo 와 관련된 타입을 작성해줍니다.

```jsx
import { getAllTodos_todos_edges_node } from "../operations/queries/__generated__/getAllTodos";

export type Todo = getAllTodos_todos_edges_node;

export type Todos = Todo[];
```

그리고 해당 Todos 데이터를 패칭해올 컴포넌트를 만들고,
