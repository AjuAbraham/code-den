import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import signUpSchema from "../schema/signUpSchema.js";
import { useState } from "react";
import { Code, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { signUpUser } from "../lib/axios.js";
import globalStore from "../store/index.js";
const SignUpForm = () => {
  const { setUser } = globalStore();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: (formData) => signUpUser(formData),
    onSuccess: (data) => {
      setUser(data.response);
      if (data.success) {
        toast.success("Registered Successfully");
      }
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong");
    },
  });
  const onSubmit = (formData) => {
    try {
      mutate(formData);
    } catch (error) {
      console.log("error", error);
      return;
    }
  };

  return (
    <div className="w-full max-w-md bg-base-200 rounded-2xl shadow-lg p-8 border border-base-300">
      <h1 className="text-3xl font-bold text-base-content mb-6 text-center tracking-tight">
        Sign Up 🔥
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-base-content/90 mb-1">
            Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Code className="h-5 w-5 text-base-content/50" />
            </div>
            <input
              type="text"
              {...register("username")}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                errors.name ? "border-red-300" : "border-base-300"
              } focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-base-300 text-base-content placeholder-base-content/50`}
              placeholder="Enter your name"
            />
          </div>
          {errors.name && (
            <p className="text-red-500/90 text-xs mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-base-content/90 mb-1">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-base-content/50" />
            </div>
            <input
              type="email"
              {...register("email")}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                errors.email ? "border-red-300" : "border-base-300"
              } focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-base-300 text-base-content placeholder-base-content/50`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <p className="text-red-500/90 text-xs mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-base-content/90 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-base-content/50" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className={`w-full pl-10 pr-12 py-2 rounded-lg border ${
                errors.password ? "border-red-300" : "border-base-300"
              } focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 bg-base-300 text-base-content placeholder-base-content/50`}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-base-content/50 hover:text-base-content/70" />
              ) : (
                <Eye className="h-5 w-5 text-base-content/50 hover:text-base-content/70" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500/90 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-focus focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-200 transition-all duration-200 font-medium"
        >
          {isPending ? <span className="loading loading-spinner"></span> : null}
          Sign Up
        </button>
      </form>
      <p className="text-sm text-center text-base-content/70 mt-4">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-primary hover:text-primary-focus font-medium transition-colors"
        >
          Log In
        </Link>
      </p>
    </div>
  );
};

export default SignUpForm;
