interface FormAlertProps {
  message: string;
  variant?: "error" | "success";
}

const FormAlert = ({ message, variant = "error" }: FormAlertProps) => (
  <div
    className={`rounded-xl border px-4 py-3 text-sm font-medium ${
      variant === "success"
        ? "border-green-200 bg-green-50 text-green-700"
        : "border-red-200 bg-red-50 text-danger"
    }`}
    role={variant === "error" ? "alert" : "status"}
  >
    {message}
  </div>
);

export default FormAlert;
