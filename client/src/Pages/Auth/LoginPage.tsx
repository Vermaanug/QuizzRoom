import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AuthHeader from "./AuthHeader";
import TextInput from "#src/component/Form/TextInput";
import Button from "#src/component/Button/Button";
import FormAlert from "#src/component/Form/FormAlert";
import { handleGlobalPostRequest } from "#src/services/apiRequest";
import { getApiError } from "#src/utils/apiError";
import { loginSchema, type LoginFormValues } from "./auth.schema";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const signupMessage = (location.state as { message?: string } | null)?.message;
  const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "", remember: false },
  });
  
  const loginMutation = useMutation({
    mutationFn: (data: Pick<LoginFormValues, "username" | "password">) =>
      handleGlobalPostRequest<{ success: boolean; message: string }, typeof data>({ url: "/api/auth/login", data }),
  });

  const onSubmit = async ({ username, password }: LoginFormValues) => {
    clearErrors("root.server");
    try {
      const response = await loginMutation.mutateAsync({ username, password });
      toast.success(response.message || "Login successful");
      navigate("/home", { replace: true });
    } catch (error) {
      setError("root.server", { message: getApiError(error, "Unable to sign in. Please try again.").message });
    }
  };

  return (
    <>
      <AuthHeader eyebrow="Welcome back" title="Sign in to your account" description="Continue your quiz journey and see how high you can climb." />
      <form className="space-y-5" noValidate onSubmit={handleSubmit(onSubmit)}>
        {signupMessage && <FormAlert message={signupMessage} variant="success" />}
        {errors.root?.server?.message && <FormAlert message={errors.root.server.message} />}
        <TextInput id="login-identifier" label="Username or email" autoComplete="username" placeholder="you@example.com" registration={register("username")} error={errors.username?.message} />
        <div>
          <div className="flex items-center justify-between">
            <label className="auth-label" htmlFor="login-password">Password</label>
            <Link className="mb-2 text-xs font-bold text-primary-600 hover:text-primary-700" to="/auth/forgot-password">Forgot password?</Link>
          </div>
          <TextInput id="login-password" label="" type="password" autoComplete="current-password" placeholder="Enter your password" registration={register("password")} error={errors.password?.message} />
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
          <input className="h-4 w-4 rounded border-line text-primary-600 focus:ring-primary-500" type="checkbox" {...register("remember")} />
          Keep me signed in
        </label>
        <Button loading={loginMutation.isPending} type="submit">Sign in</Button>
      </form>
      <p className="mt-7 text-center text-sm text-muted">
        New to QuizzRoom? <Link className="font-bold text-primary-600 hover:text-primary-700" to="/auth/signup">Create an account</Link>
      </p>
    </>
  );
};

export default LoginPage;
