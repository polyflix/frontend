import { AuthService } from "@core/services/auth/auth.service";
import { motion } from "framer-motion";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import fadeInDown from "../../../animations/fadeInDown";
import stagger from "../../../animations/stagger";
import { useAuth } from "../../../hooks/useAuth.hook";
import { useInjection } from "../../../modules/di";
import { IRegisterForm } from "../../../types/auth.type";
import Alert from "../../Alert/Alert.component";
import FilledButton from "../../Buttons/FilledButton/FilledButton.component";
import Spinner from "../../Spinner/Spinner.component";
import Paragraph from "../../Typography/Paragraph/Paragraph.component";
import Title from "../../Typography/Title/Title.component";
import Typography from "../../Typography/Typography.component";
import Input from "../Input/Input.component";

/**
 * The register form component
 */
const RegisterForm: React.FC = () => {
  const authService = useInjection<AuthService>(AuthService);
  const { authError, isLoading } = useAuth();
  const { register, handleSubmit, errors, watch } = useForm<IRegisterForm>();

  const handleRegister = (data: IRegisterForm) => authService.register(data);

  return (
    <motion.div
      variants={stagger(0.1)}
      className="px-5 w-full md:w-8/12 lg:w-5/12 mx-auto"
    >
      <Title variants={fadeInDown}>Sign up</Title>
      <Paragraph variants={fadeInDown} className="my-3">
        Fill the form below to create an account for Polyflix.
      </Paragraph>
      <form
        className="grid grid-cols-2 gap-4"
        onSubmit={handleSubmit(handleRegister)}
      >
        <Input
          error={errors.firstName}
          name="firstName"
          className="col-span-1"
          placeholder="Firstname"
          required
          variants={fadeInDown}
          ref={register({
            required: { value: true, message: "First name is required." },
          })}
        />
        <Input
          error={errors.lastName}
          name="lastName"
          required
          className="col-span-1"
          placeholder="Lastname"
          variants={fadeInDown}
          ref={register({
            required: { value: true, message: "Last name is required." },
          })}
        />
        <Input
          error={errors.email}
          required
          name="email"
          placeholder="Email"
          className="col-span-2"
          variants={fadeInDown}
          ref={register({
            required: { value: true, message: "An email is required." },
          })}
        />
        <Input
          error={errors.password}
          name="password"
          type="password"
          className="col-span-2"
          required
          variants={fadeInDown}
          placeholder="Password"
          hint="The password must be at least 8 characters"
          ref={register({
            minLength: {
              value: 8,
              message: "The password must be at least 8 characters long",
            },
            required: { value: true, message: "A password is required." },
          })}
        />
        <Input
          error={errors.passwordConfirm}
          name="passwordConfirm"
          type="password"
          required
          className="col-span-2"
          variants={fadeInDown}
          placeholder="Password confirm"
          ref={register({
            validate: (value) =>
              value === watch("password") || "The password does not match.",
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
          variants={fadeInDown}
          disabled={isLoading}
          as="input"
          className="col-span-2"
          inputValue="Sign up"
        />
      </form>
      <Paragraph variants={fadeInDown} className="mt-2">
        Already registered to Polyflix ?{" "}
        <Link to="/auth/login">
          <Typography as="span" bold>
            Sign in here
          </Typography>
        </Link>
        .
      </Paragraph>
    </motion.div>
  );
};

export default RegisterForm;
