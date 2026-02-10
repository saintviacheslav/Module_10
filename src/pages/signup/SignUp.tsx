import { FormEvent } from "react";
import style from "./signup.module.css";
import Button from "../../components/ButtonClass/ButtonClass";
import Input from "../../components/Input/Input";
import { users } from "../../mock/users";
import { useForm } from "../../utils/useForm";
import { validateEmail, validatePassword } from "../../utils/validators";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { Icon } from "../../components/Icon/Icon";
import { useToast } from "../../context/ToastProvider";

export default function SignUp() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { values, errors, setFieldValue, setFieldError } = useForm({
    email: "",
    password: "",
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const emailError = validateEmail(values.email);
    const passwordError = validatePassword(values.password);

    if (emailError || passwordError) {
      setFieldError("email", emailError);
      setFieldError("password", passwordError);
      addToast("Please fix the errors above", { type: "error" });
      return;
    }

    const emailExists = users.some((user) => user.email === values.email);

    if (emailExists) {
      setFieldError("email", "Email already exists");
      addToast("Please fix the errors above", { type: "error" });
      return;
    }

    users.push({
      id: Date.now(),
      email: values.email,
      password: values.password,
      name: "",
      surname: "",
      username: "@default",
      avatar: "women.png",
    });
    login(values.email, values.password);
    addToast("Successfull registration", { type: "success" });
    navigate("/");
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
                <Icon name="envelope" />
                <p>Email</p>
              </div>

              <Input
                value={values.email}
                onChange={(e) => setFieldValue("email", e.target.value)}
                status={errors.email ? "error" : "default"}
                errorText={errors.email}
                placeholder="Enter email..."
              />
            </div>

            <div className={style.input_block}>
              <div className={style.hint}>
                <Icon name="eye" />
                <p>Password</p>
              </div>

              <Input
                type="password"
                value={values.password}
                onChange={(e) => setFieldValue("password", e.target.value)}
                status={errors.password ? "error" : "default"}
                errorText={errors.password}
                placeholder="Enter password..."
              />
            </div>

            <Button name="Sign Up" />

            <p className={style.privacyText}>
              By clicking continue, you agree to our{" "}
              <span className={style.privacyGray}>Terms of Service</span> and{" "}
              <span className={style.privacyGray}>Privacy Policy</span>
            </p>

            <p className={style.navigation}>
              Already have an account?{" "}
              <span style={{cursor: "pointer"}} onClick={() => navigate("/signin")} className={style.switch_auth_pages}>Sign In</span>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}