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