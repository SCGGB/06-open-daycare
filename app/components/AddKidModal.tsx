"use client";

import { useState } from "react";

const ROOM_OPTIONS = ["Soles", "Luna", "Estrella", "Nube"] as const;

function isValidDate(value: string): boolean {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return false;
  const [dd, mm, yyyy] = value.split("/").map(Number);
  const date = new Date(yyyy, mm - 1, dd);
  return (
    date.getFullYear() === yyyy &&
    date.getMonth() === mm - 1 &&
    date.getDate() === dd
  );
}

interface AddKidModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddKidModal({ open, onClose }: AddKidModalProps) {
  const [birthDate, setBirthDate] = useState("");
  const [birthDateError, setBirthDateError] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-6 pt-10 pb-10">
      <div className="w-full max-w-[520px] overflow-hidden rounded-[24px] border border-[#ECE0D0] bg-[#FBF4EC] shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ECE0D0] px-[26px] py-5">
          <button
            onClick={onClose}
            className="text-[15px] font-bold text-[#94887B]"
          >
            Cancelar
          </button>
          <span className="font-fredoka text-[18px] font-semibold text-[#3F362E]">
            Agregar niño
          </span>
          <button
            onClick={() => {
              if (birthDate && !isValidDate(birthDate)) {
                setBirthDateError("Fecha inválida. Use el formato dd/mm/aaaa.");
                return;
              }
              onClose();
            }}
            className="text-[15px] font-extrabold text-[#D9583C]"
          >
            Guardar
          </button>
        </div>

        {/* Body */}
        <div className="px-[26px] py-6">
          {/* NOMBRE COMPLETO */}
          <div className="mb-[18px]">
            <div className="mb-2 text-[12px] font-extrabold tracking-[.7px] text-[#94887B]">
              NOMBRE COMPLETO
            </div>
            <input
              placeholder="Ej. Martina López"
              className="w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[13px] text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none"
            />
          </div>

          {/* FECHA + SALA row */}
          <div className="mb-[18px] flex gap-[14px]">
            <div className="flex-1">
              <div className="mb-2 text-[12px] font-extrabold tracking-[.7px] text-[#94887B]">
                FECHA DE NACIMIENTO
              </div>
              <input
                placeholder="dd/mm/aaaa"
                value={birthDate}
                onChange={(e) => {
                  setBirthDate(e.target.value);
                  if (birthDateError) setBirthDateError("");
                }}
                onBlur={() => {
                  if (birthDate && !isValidDate(birthDate)) {
                    setBirthDateError("Fecha inválida. Use el formato dd/mm/aaaa.");
                  }
                }}
                className={`w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[13px] text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none ${
                  birthDateError
                    ? "border-[#D9583C]"
                    : "border-[#EADFD0]"
                }`}
              />
              {birthDateError && (
                <p className="mt-1 text-[12px] text-[#D9583C]">{birthDateError}</p>
              )}
            </div>
            <div className="flex-1">
              <div className="mb-2 text-[12px] font-extrabold tracking-[.7px] text-[#94887B]">
                SALA
              </div>
              <select className="w-full appearance-none rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[13px] text-[15px] font-bold text-[#3F362E] focus:outline-none">
                {ROOM_OPTIONS.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ALERGIAS */}
          <div className="mb-[18px]">
            <div className="mb-2 text-[12px] font-extrabold tracking-[.7px] text-[#94887B]">
              ALERGIAS (ETIQUETAS)
            </div>
            <input
              placeholder="Ej. Maní, Lactosa"
              className="w-full rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[13px] text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none"
            />
          </div>

          {/* NOTAS MÉDICAS */}
          <div>
            <div className="mb-2 text-[12px] font-extrabold tracking-[.7px] text-[#94887B]">
              NOTAS MÉDICAS
            </div>
            <textarea
              placeholder="Indicaciones, medicación, contactos…"
              className="min-h-[90px] w-full resize-y rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white px-4 py-[13px] text-[15px] leading-[1.5] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
