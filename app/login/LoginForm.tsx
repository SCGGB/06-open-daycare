"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/actions/auth";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(login, { error: null });

  return (
    <form action={formAction} className="w-full">
      <input type="hidden" name="next" value={next} />

      <div className="mb-[8px] text-[12px] font-bold tracking-[0.7px] text-[#94887B]">
        EMAIL
      </div>
      <input
        type="email"
        name="email"
        required
        autoComplete="email"
        className="mb-[18px] w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-[16px] py-[14px] text-[15px] text-[#3F362E]"
      />

      <div className="mb-[8px] text-[12px] font-bold tracking-[0.7px] text-[#94887B]">
        CONTRASEÑA
      </div>
      <input
        type="password"
        name="password"
        required
        autoComplete="current-password"
        placeholder="••••••••"
        className="mb-[10px] w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-[16px] py-[14px] text-[15px] text-[#3F362E]"
      />
      <div className="mb-[20px] text-right">
        <span className="cursor-pointer text-[13.5px] font-bold text-[#C5503A]">
          ¿Olvidaste tu contraseña?
        </span>
      </div>

      {state.error && (
        <p
          role="alert"
          className="mb-[16px] rounded-[12px] bg-[#FBDAD6] px-[14px] py-[11px] text-[14px] font-bold text-[#C5413A]"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="block w-full rounded-[15px] bg-gradient-to-b from-[#F4977E] to-[#EE8164] py-[15px] text-center text-[16px] font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,7)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Ingresando..." : "Iniciar sesión"}
      </button>

      <p className="mt-[24px] text-center text-[14.5px] text-[#94887B]">
        ¿Te invitó la guardería?{" "}
        <Link href="/activar-cuenta" className="font-extrabold text-[#C5503A]">
          Activá tu cuenta
        </Link>
      </p>
    </form>
  );
}
