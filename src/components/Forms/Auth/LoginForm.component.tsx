import { AuthService } from "@core/services/auth/auth.service";
import { motion } from "framer-motion";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import fadeInDown from "../../../animations/fadeInDown";
import stagger from "../../../animations/stagger";
import { useAuth } from "../../../hooks/useAuth.hook";
import { useInjection } from "../../../modules/di";
import { ILoginForm } from "../../../types/auth.type";
import Alert from "../../Alert/Alert.component";
import FilledButton from "../../Buttons/FilledButton/FilledButton.component";
import Spinner from "../../Spinner/Spinner.component";
import Paragraph from "../../Typography/Paragraph/Paragraph.component";
import Title from "../../Typography/Title/Title.component";
import Typography from "../../Typography/Typography.component";
import Input from "../Input/Input.component";

/**
 * The login form component
 */
const LoginForm: React.FC = () => {
  const authService = useInjection<AuthService>(AuthService);
  const { authError, isLoading } = useAuth();
  const { register, handleSubmit, errors } = useForm<ILoginForm>();

  const handleLogin = (data: ILoginForm) => {
    authService.login(data);
  };

  return (
    <motion.div
      variants={stagger(0.1)}
      className="p-5 w-full md:w-8/12 lg:w-5/12 mx-auto"
    >
      <Title variants={fadeInDown}>Sign in</Title>
      <Paragraph variants={fadeInDown} className="my-3">
        Enter your credentials to log in into your account.
      </Paragraph>
      <form
        className="grid grid-cols-2 gap-4"
        onSubmit={handleSubmit(handleLogin)}
      >
        <Input
          name="email"
          error={errors.email}
          className="col-span-2"
          placeholder="Email"
          required
          variants={fadeInDown}
          ref={register({
            required: { value: true, message: "An email is required." },
          })}
        />
        <Input
          error={errors.password}
          name="password"
          type="password"
          required
          className="col-span-2"
          variants={fadeInDown}
          placeholder="Password"
          ref={register({
            required: { value: true, message: "A password is required." },
          })}
        />
        {isLoading && (
          <div className="flex items-center">
            <Spinner className="fill-current text-nx-dark"></Spinner>
            <Typography as="span" className="text-sm ml-2">
              Please wait..
            </Typography>
          </div>
        )}
        {authError && <Alert type="error">{authError}</Alert>}
        <FilledButton
          className="col-span-2"
          as="input"
          inputValue="Sign in"
          variants={fadeInDown}
        />
      </form>
      <Paragraph variants={fadeInDown} className="mt-2">
        New to Polyflix ?{" "}
        <Link to="/auth/register">
          <Typography as="span" bold>
            Sign up now
          </Typography>
        </Link>
        .
      </Paragraph>
    </motion.div>
  );
};

export default LoginForm;
