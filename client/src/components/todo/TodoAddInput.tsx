import React, {useState} from 'react'

interface Props{
    onSubmit : (text:string)=> void;
}

export default function TodoAddInput({onSubmit}:Props) {
    const [todo, setTodo]=useState("");

    const onChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        e.preventDefault();
        const {value} =e.target;
        setTodo(value);
    }

    const onSubmitTodo = (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        onSubmit(todo);
    }

  return (
   <form onSubmit={onSubmitTodo}>  
       <label> 새로운 TODO 를 추가하세요</label>
       <input
            id="todo"
            name="todo"
            value={todo}
            onChange={onChange}
            placeholder="새로운 todo를 입력하세요"
       />
       <button type="submit">추가</button>
   </form>
  )
}
