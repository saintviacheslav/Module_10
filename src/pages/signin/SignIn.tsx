import React, { FormEvent, useState } from "react";
import style from "./signin.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Button from "../../components/Button/Button";
import ButtonClass from "../../components/ButtonClass/ButtonClass";
import Input from "../../components/Input/Input";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const success = login(email, password);

    if (success) {
      navigate("/");
    } else {
      alert("repeat");
    }
  }

  return (
    <div className={style.container}>
      <main className={style.content_container}>
        <form className={style.content} onSubmit={handleSubmit}>
          <div className={style.preview}>
            <h1 className={style.title}>Sign in into an account</h1>
            <p className={style.signin_description}>
              Enter your email and password to sign in into this app
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

            {/* <Button name="Sign In"></Button> */}
            <ButtonClass name="Sign In"></ButtonClass>
            <p className={style.navigation}>
              Forgot to create an account?{" "}
              <span className={style.switch_auth_pages}>Sign Up</span>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
