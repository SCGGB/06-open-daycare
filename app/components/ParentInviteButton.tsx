"use client";

import { useState } from "react";
import { LinkParentModal } from "@/app/components/LinkParentModal";

function PlusIcon() {
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
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

interface ParentInviteButtonProps {
  kidName: string;
}

export function ParentInviteButton({ kidName }: ParentInviteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center gap-3 pt-2 text-left"
      >
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border-[1.5px] border-dashed border-[#D8CBBA] text-[#B0A290]">
          <PlusIcon />
        </span>
        <span className="text-[14.5px] font-extrabold text-[#C5503A]">
          Vincular otro padre
        </span>
      </button>
      {isOpen && (
        <LinkParentModal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          kidName={kidName}
        />
      )}
    </>
  );
}