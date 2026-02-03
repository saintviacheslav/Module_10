import React, { FormEvent, useState } from "react";
import style from "./signup.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { users } from "../../mock/users";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e:FormEvent){
    e.preventDefault();
    users.push({
    id: 3,
    email: email,
    password: password,
    name: "",
    surname: "",
    username: "@default",
    avatar: "women.png",
  })
  }

  return (
    <div className={style.container}>
      <main className={style.content_container}>
        <form onSubmit={handleSubmit} className={style.content}>
          <div className={style.preview}>
            <h1 className={style.title}>Create an account</h1>
            <p className={style.signin_description}>
              Enter your email and password to sign up for this app
            </p>
          </div>
          <div className={style.input_area}>
            <div className={style.input_block}>
              <div className={style.hint}>
                <img
                  className={style.hint_img}
                  src="envelope.png"
                  alt="mail"
                ></img>
                <p>Email</p>
              </div>
              <Input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="text"
                placeholder="Enter email..."
              />
            </div>
            <div className={style.input_block}>
              <div className={style.hint}>
                <img className={style.hint_img} src="eye.png" alt="eye"></img>
                <p>Password</p>
              </div>
              <Input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Enter password..."
              />
            </div>

            <Button name="Sign Up"></Button>
              <p className={style.privacyText}>
                By clicking continue, you agree to our <span className={style.privacyGray}>Terms of Service</span> and 
                 <span className={style.privacyGray}> Privacy Policy</span>
              </p>
            <p className={style.navigation}>
              Already have an account?{" "}
              <span className={style.switch_auth_pages}>Sign Up</span>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
