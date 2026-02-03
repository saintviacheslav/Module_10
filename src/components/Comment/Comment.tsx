import React, { useState } from "react";
import style from "./comment.module.css";
import Button from "../Button/Button";
import { ReactComponent as PencilImg } from "../../assets/images/pencil.svg";

export default function Comment(){
  const [value, setValue] = useState("")
  return <>
    <div className={style.adding_comment}>
      <div className={style.hint}>
        <PencilImg style={{color:"var(--text-primary)"}}></PencilImg>
        {/* <img src="pencil.png" alt="pencil for writing"></img> */}
        <p>Add a comment</p>
      </div>
      <textarea className={style.textarea}
        placeholder="Write description here..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={3}></textarea>
      <Button name="Add a comment"></Button>
    </div>
  </>
}