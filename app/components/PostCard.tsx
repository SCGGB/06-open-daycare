import type { ReactNode } from "react";
import { Badge } from "./Badge";
import type { BadgeVariant } from "./Badge";
import { CommentIcon, HeartIcon } from "./icons";

type PostCardProps = {
  author: string;
  meta: string;
  badge: BadgeVariant;
  recipient: string;
  avatar: ReactNode;
  children: ReactNode;
  likeCount: number;
  commentCount: number;
};

export function PostCard({
  author,
  meta,
  badge,
  recipient,
  avatar,
  children,
  likeCount,
  commentCount,
}: PostCardProps) {
  return (
    <div className="rounded-[20px] border border-[#ECE0D0] bg-[#FFFDF9] p-5 px-[22px] shadow-[0_4px_16px_-12px_rgba(120,90,60,.5)]">
      <div className="mb-[14px] flex items-center gap-3">
        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full">
          {avatar}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-fredoka text-[16.5px] font-semibold text-[#3F362E]">
            {author}
          </div>
          <div className="text-[12.5px] text-[#A89A8B]">{meta}</div>
        </div>
        <Badge variant={badge} />
      </div>

      <div className="mb-2.5 text-[12.5px] text-[#A89A8B]">{recipient}</div>

      {children}

      <div className="mt-4 flex items-center gap-[18px] border-t border-[#F0E6D8] pt-[14px]">
        <span className="flex items-center gap-[7px] text-sm font-bold text-[#E0654A]">
          <HeartIcon />
          {likeCount}
        </span>
        <a href="#" className="flex items-center gap-[7px] text-sm font-bold text-[#94887B]">
          <CommentIcon />
          {commentCount}
        </a>
        <span className="flex-1" />
        <a href="#" className="text-sm font-extrabold text-[#C5503A]">
          Editar
        </a>
      </div>
    </div>
  );
}
