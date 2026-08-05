import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthHeader from "./AuthHeader";
import TextInput from "#src/component/Form/TextInput";
import Button from "#src/component/Button/Button";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "./auth.schema";

const ForgotPasswordPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async () => {
    setSubmitted(true);
  };

  return (
    <>
      <AuthHeader eyebrow="Account recovery" title="Forgot your password?" description="Enter your account email and we’ll send you instructions to reset it." />
      {submitted ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-xl text-success">✓</div>
          <p className="font-bold text-ink">Check your inbox</p>
          <p className="mt-1 text-sm leading-6 text-muted">If an account exists for that email, reset instructions are on their way.</p>
        </div>
      ) : (
        <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
          <TextInput id="recovery-email" label="Email address" type="email" autoComplete="email" placeholder="you@example.com" registration={register("email")} error={errors.email?.message} />
          <Button loading={isSubmitting} type="submit">Send reset instructions</Button>
        </form>
      )}
      <p className="mt-7 text-center text-sm text-muted">
        <Link className="font-bold text-primary-600 hover:text-primary-700" to="/auth/login">← Back to sign in</Link>
      </p>
    </>
  );
};

export default ForgotPasswordPage;
