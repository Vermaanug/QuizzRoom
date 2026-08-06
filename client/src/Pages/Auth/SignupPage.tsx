import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import AuthHeader from "./AuthHeader";
import TextInput from "#src/component/Form/TextInput";
import Button from "#src/component/Button/Button";
import FormAlert from "#src/component/Form/FormAlert";
import { handleGlobalPostRequest } from "#src/services/apiRequest";
import { getApiError } from "#src/utils/apiError";
import { signupSchema, type SignupFormValues } from "./auth.schema";

const SignupPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { firstName: "", lastName: "", username: "", email: "", password: "", acceptTerms: false },
  });
  type SignupPayload = Omit<SignupFormValues, "acceptTerms">;
  const signupMutation = useMutation({
    mutationFn: (data: SignupPayload) =>
      handleGlobalPostRequest<{ status: boolean; message: string }, SignupPayload>({ url: "/api/auth/signup", data }),
  });

  const onSubmit = async (formValues: SignupFormValues) => {
    const { firstName, lastName, username, email, password } = formValues;
    clearErrors("root.server");
    try {
      await signupMutation.mutateAsync({ firstName, lastName, username, email, password });
      navigate("/auth/login", { replace: true, state: { message: "Account created successfully. You can now sign in." } });
    } catch (error) {
      const apiError = getApiError(error, "Unable to create your account. Please try again.");
      const fields = ["firstName", "lastName", "username", "email", "password"] as const;
      fields.forEach((field) => {
        const message = apiError.fieldErrors?.[field];
        if (message) setError(field, { message });
      });
      setError("root.server", { message: apiError.message });
    }
  };

  return <>
    <AuthHeader eyebrow="Join Quiz Room" title="Create account" description="Start hosting quizzes for free." />
    <form className="space-y-4" noValidate onSubmit={handleSubmit(onSubmit)}>
      {errors.root?.server?.message && <FormAlert message={errors.root.server.message} />}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextInput id="first-name" label="First name" autoComplete="given-name" placeholder="Alex" registration={register("firstName")} error={errors.firstName?.message} />
        <TextInput id="last-name" label="Last name" autoComplete="family-name" placeholder="Morgan" registration={register("lastName")} error={errors.lastName?.message} />
      </div>
      <TextInput id="signup-username" label="Username" autoComplete="username" placeholder="alexmorgan" registration={register("username")} error={errors.username?.message} />
      <TextInput id="signup-email" label="Email address" type="email" autoComplete="email" placeholder="you@example.com" registration={register("email")} error={errors.email?.message} />
      <TextInput id="signup-password" label="Password" type="password" autoComplete="new-password" placeholder="8+ characters with uppercase, number & symbol" registration={register("password")} error={errors.password?.message} />
      <label className="flex cursor-pointer items-start gap-2 text-xs leading-5 text-muted">
        <input className="mt-0.5 h-4 w-4 rounded border-line text-primary-600 focus:ring-primary-500" type="checkbox" {...register("acceptTerms")} />
        <span>I agree to the Terms of Service and Privacy Policy.</span>
      </label>
      {errors.acceptTerms && <p className="text-xs font-medium text-danger" role="alert">{errors.acceptTerms.message}</p>}
      <Button loading={signupMutation.isPending} type="submit">Create account</Button>
    </form>
    <p className="mt-7 text-center text-base text-muted">
      Already have one? <Link className="font-semibold text-primary-500 hover:text-primary-600" to="/auth/login">Sign in</Link>
    </p>
  </>;
};

export default SignupPage;
