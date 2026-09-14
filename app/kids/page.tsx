"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusIcon } from "@/app/components/icons";
import { Sidebar } from "@/app/components/Sidebar";
import { AddKidModal } from "@/app/components/AddKidModal";
import { kids } from "@/app/data/kids";

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#B0A290"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#CBB89F"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default function KidsPage() {
  const [isAddKidOpen, setIsAddKidOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F6ECDF]">
      <Sidebar />
      <main className="h-screen min-w-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-[880px] px-10 pt-[34px] pb-20">
        <div className="mb-[22px] flex items-end justify-between gap-4">
          <div>
            <div className="mb-1 text-[12.5px] font-extrabold tracking-[.8px] text-[#D9583C]">
              GESTIÓN
            </div>
            <h1 className="m-0 font-fredoka text-[30px] font-semibold text-[#3F362E]">
              Niños
            </h1>
          </div>
          <button
            onClick={() => setIsAddKidOpen(true)}
            className="flex items-center gap-2 rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] px-[18px] py-[11px] text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,.7)] transition-[transform,box-shadow] active:scale-95 active:shadow-[0_4px_10px_-4px_rgba(238,129,100,.7)]"
          >
            <PlusIcon />
            Agregar niño
          </button>
        </div>

        <div className="mb-[22px] flex items-center gap-[11px] rounded-[14px] border border-[#ECE0D0] bg-[#FFFDF9] px-4 py-3">
          <SearchIcon />
          <input
            placeholder="Buscar niño…"
            className="flex-1 border-none bg-transparent text-[15px] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none"
          />
        </div>

        <div className="mb-[14px] flex items-center gap-3">
          <span className="text-[12.5px] font-extrabold tracking-[.8px] text-[#3F362E]">
            SALA SOLES
          </span>
          <span className="text-[13px] text-[#A89A8B]">8 niños</span>
          <span className="h-px flex-1 bg-[#E7DAC8]" />
        </div>

        <div className="grid grid-cols-2 gap-[14px]">
          {kids.map((kid) => (
            <Link
              key={kid.id}
              href={`/kids/${kid.id}`}
              className="flex min-w-0 items-center gap-[14px] rounded-[18px] border border-[#ECE0D0] bg-[#FFFDF9] p-4 shadow-[0_4px_14px_-12px_rgba(120,90,60,.5)] transition-[border,.15s] hover:-translate-y-0.5 hover:border-[#F2A78E]"
            >
              <div
                className="flex h-12 w-12 flex-none items-center justify-center rounded-full font-fredoka text-[19px] font-semibold"
                style={{ background: kid.avatarBg, color: kid.avatarColor }}
              >
                {kid.initial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-fredoka text-[16px] font-semibold text-[#3F362E]">
                  {kid.name}
                </div>
                <div className="text-[13px] text-[#A89A8B]">
                  {kid.age} · {kid.parentsLabel}
                </div>
              </div>
              {kid.tag ? (
                <span
                  className="flex-none rounded-full px-[9px] py-[5px] text-[11px] font-extrabold"
                  style={{ background: kid.tagBg, color: kid.tagColor }}
                >
                  {kid.tag}
                </span>
              ) : (
                <ChevronIcon />
              )}
            </Link>
          ))}
        </div>
      </div>
      <AddKidModal open={isAddKidOpen} onClose={() => setIsAddKidOpen(false)} />
      </main>
    </div>
  );
}
