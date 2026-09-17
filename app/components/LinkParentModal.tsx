"use client";

import { useState } from "react";

type ParentRole = "Mamá" | "Papá" | "Tutor/a";

const INVITATION_CODE = "7K4P9";

const PARENT_ROLES: ParentRole[] = ["Mamá", "Papá", "Tutor/a"];

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

interface LinkParentModalProps {
  open: boolean;
  onClose: () => void;
  kidName: string;
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#4E72C8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flex: "none", marginTop: 1 }}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

export function LinkParentModal({
  open,
  onClose,
  kidName,
}: LinkParentModalProps) {
  const [parentRole, setParentRole] = useState<ParentRole>("Mamá");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-6 pt-10 pb-10">
      <div className="w-full max-w-[480px] overflow-hidden rounded-[24px] border border-[#ECE0D0] bg-[#FBF4EC] shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)]">
        <div className="flex items-center justify-between border-b border-[#ECE0D0] px-[26px] py-5">
          <div>
            <div className="font-fredoka text-[18px] font-semibold text-[#3F362E]">
              Vincular padre
            </div>
            <div className="text-[13px] text-[#A89A8B]">a {kidName}</div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[10px] bg-[#F0E6D8] text-[#94887B]"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="px-[26px] py-[22px]">
          <div className="mb-5 flex gap-[11px] rounded-[14px] bg-[#E3ECFB] px-4 py-[13px]">
            <InfoIcon />
            <span className="text-[13.5px] leading-[1.45] text-[#3F5694]">
              Le enviaremos un correo con un código para que active su cuenta.
              Solo verá el feed de {kidName}.
            </span>
          </div>

          <div className="mb-[18px]">
            <div className="mb-2 text-[12px] font-extrabold tracking-[.7px] text-[#94887B]">
              NOMBRE DEL PADRE/MADRE
            </div>
            <input
              placeholder="Ej. Diego Fernández"
              className="w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[13px] text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none"
            />
          </div>

          <div className="mb-[18px]">
            <div className="mb-2 text-[12px] font-extrabold tracking-[.7px] text-[#94887B]">
              EMAIL
            </div>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              onBlur={() => {
                if (!email) setEmailError("Ingresá un email.");
                else if (!isValidEmail(email))
                  setEmailError("Ingresá un email válido.");
              }}
              className={`w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[13px] text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none ${
                emailError ? "border-[#D9583C]" : "border-[#EADFD0]"
              }`}
            />
            {emailError && (
              <p className="mt-1 text-[12px] text-[#D9583C]">{emailError}</p>
            )}
          </div>

          <div className="mb-5">
            <div className="mb-2.5 text-[12px] font-extrabold tracking-[.7px] text-[#94887B]">
              PARENTESCO
            </div>
            <div className="flex gap-[9px]">
              {PARENT_ROLES.map((role) => {
                const active = role === parentRole;
                return (
                  <button
                    key={role}
                    onClick={() => setParentRole(role)}
                    className={`flex-1 rounded-full border-[1.5px] px-3 py-[11px] text-[14px] font-extrabold ${
                      active
                        ? "border-[#9FB8EC] bg-[#CCD8F4] text-[#4E72C8]"
                        : "border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359]"
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-5 rounded-[16px] border-[1.5px] border-dashed border-[#E6D08A] bg-[#FBF1D6] px-[18px] py-[18px] text-center">
            <div className="mb-2 text-[12px] font-extrabold tracking-[.7px] text-[#A88526]">
              CÓDIGO DE INVITACIÓN
            </div>
            <div className="font-fredoka text-[34px] font-semibold tracking-[7px] text-[#8A7234]">
              {INVITATION_CODE}
            </div>
            <div className="mt-1.5 text-[13px] text-[#A88526]">
              Vence en 7 días
            </div>
          </div>

          <button
            onClick={() => {
              if (!email) {
                setEmailError("Ingresá un email.");
                return;
              }
              if (!isValidEmail(email)) {
                setEmailError("Ingresá un email válido.");
                return;
              }
              onClose();
            }}
            className="flex w-full items-center justify-center gap-[9px] rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] px-4 py-[14px] text-[15.5px] font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,.7)]"
          >
            <SendIcon />
            Enviar invitación
          </button>
        </div>
      </div>
    </div>
  );
}