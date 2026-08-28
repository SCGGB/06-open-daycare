import type { ReactNode } from "react";
import {
  BellIcon,
  HomeIcon,
  LogoutIcon,
  PlusIcon,
  SparkleIcon,
  UserIcon,
  UsersIcon,
} from "./icons";

type NavItem = {
  label: string;
  icon: ReactNode;
  active?: boolean;
};

const navItems: NavItem[] = [
  { label: "Feed", icon: <HomeIcon />, active: true },
  { label: "Niños", icon: <UsersIcon /> },
  { label: "Avisos", icon: <BellIcon /> },
  { label: "Mi cuenta", icon: <UserIcon /> },
];

export function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-[248px] flex-none flex-col border-r border-[#ECE0D0] bg-[#FFFDF9] p-6 px-4">
      <a href="#" className="flex items-center gap-[11px] py-1 pl-2 pr-2 pb-[22px]">
        <div className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[12px] bg-[linear-gradient(155deg,#F8C3A8,#F2937A)]">
          <SparkleIcon />
        </div>
        <div>
          <div className="font-fredoka text-[17px] font-semibold leading-none text-[#3F362E]">
            OpenDayCare
          </div>
          <div className="mt-0.5 text-[11.5px] text-[#A89A8B]">Sala Soles</div>
        </div>
      </a>

      <a
        href="#"
        className="mb-[18px] flex w-full items-center justify-center gap-2 rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] px-3 py-3 text-[14.5px] font-extrabold text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,.75)]"
      >
        <PlusIcon />
        Nueva publicación
      </a>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={
              item.active
                ? "flex items-center gap-3 rounded-[12px] bg-[#FBE3D8] px-3 py-[11px] text-[14.5px] font-extrabold text-[#D9583C]"
                : "flex items-center gap-3 rounded-[12px] bg-transparent px-3 py-[11px] text-[14.5px] font-semibold text-[#6E6359]"
            }
          >
            {item.icon}
            {item.label}
          </a>
        ))}
      </nav>

      <div className="mt-2.5 border-t border-[#ECE0D0] pt-[14px]">
        <div className="flex items-center gap-[11px] px-2 py-1.5">
          <div className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-full bg-[#F2937A] font-fredoka text-base font-semibold text-white">
            C
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-extrabold text-[#3F362E]">
              Caro Giménez
            </div>
            <div className="text-xs text-[#A89A8B]">Maestra · Soles</div>
          </div>
          <a
            href="#"
            title="Cerrar sesión"
            className="flex h-8 w-8 flex-none items-center justify-center rounded-[10px] bg-[#F6ECDF] text-[#94887B]"
          >
            <LogoutIcon />
          </a>
        </div>
      </div>
    </aside>
  );
}
