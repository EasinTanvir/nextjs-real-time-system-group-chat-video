"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useForm } from "react-hook-form";

import AuthField from "@/components/auth/auth-field";
import AuthPageShell from "@/components/auth/auth-page-shell";

const usernameRules = {
  required: "Username is required.",
  minLength: {
    value: 3,
    message: "Username must be at least 3 characters.",
  },
  maxLength: {
    value: 30,
    message: "Username must be 30 characters or fewer.",
  },
  pattern: {
    value: /^[A-Za-z0-9_-]+$/,
    message: "Use letters, numbers, underscores, or hyphens only.",
  },
};

const emailRules = {
  required: "Email is required.",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Enter a valid email address.",
  },
};

const passwordRules = {
  required: "Password is required.",
  minLength: {
    value: 6,
    message: "Password must be at least 8 characters.",
  },
};

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values) => {
    try {
      await api.post("/auth/register", values);

      toast.success("Account created.");
      router.refresh();
      router.push("/chat");
    } catch (error) {
      console.log("register error", error);

      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthPageShell
      title="Create your account"
      description="Join Chatify and start meaningful conversations in one place."
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-1">
        <AuthField
          id="username"
          label="Username"
          autoComplete="username"
          placeholder="Choose a username"
          error={errors.username}
          registration={register("username", {
            ...usernameRules,
            setValueAs: (value) => value.trim(),
          })}
        />

        <AuthField
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email}
          registration={register("email", emailRules)}
        />

        <AuthField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
          error={errors.password}
          registration={register("password", passwordRules)}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(16,185,129,0.18)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(16,185,129,0.24)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="my-7 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-100" />

        <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-slate-300">
          Chatify
        </span>

        <div className="h-px flex-1 bg-slate-100" />
      </div>

      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-emerald-600 transition hover:text-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
        >
          Log in
        </Link>
      </p>
    </AuthPageShell>
  );
}
