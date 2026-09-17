"use client";

import { useState } from "react";
import { CameraIcon } from "./icons";
import { CreatePostModal } from "./CreatePostModal";

export function PostComposer() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsCreatePostOpen(true)}
        className="mb-6 flex w-full items-center gap-[14px] rounded-[18px] border border-[#ECE0D0] bg-[#FFFDF9] px-[18px] py-[14px] text-left shadow-[0_4px_14px_-10px_rgba(120,90,60,.4)]"
      >
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#F2937A] font-fredoka text-base font-semibold text-white">
          C
        </div>
        <span className="flex-1 text-[15px] text-[#A89A8B]">
          Compartí un momento…
        </span>
        <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[12px] bg-[#FBE3D8] text-[#E0654A]">
          <CameraIcon />
        </span>
      </button>
      <CreatePostModal
        open={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />
    </>
  );
}
