import Link from "next/link";
import { kids } from "@/app/data/kids";
import type { Kid, KidParent } from "@/app/data/kids";
import { Sidebar } from "@/app/components/Sidebar";
import { ParentInviteButton } from "@/app/components/ParentInviteButton";
import { notFound } from "next/navigation";

function BackChevronIcon() {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

function SummaryIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function parentStatusLabel(status: KidParent["status"]): string {
  return status === "active" ? "activa" : "invitación enviada";
}

export function generateStaticParams() {
  return kids.map((kid) => ({ childId: kid.id }));
}

export default async function KidProfilePage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const kid: Kid | undefined = kids.find((k) => k.id === childId);
  if (!kid) notFound();

  return (
    <div className="flex min-h-screen bg-[#F6ECDF]">
      <Sidebar />
      <main className="h-screen min-w-0 flex-1 overflow-y-auto">
      <div className="mx-auto w-full max-w-[820px] px-10 pt-[34px] pb-20">
        <Link
          href="/kids"
          className="mb-5 flex items-center gap-[7px] text-[14px] font-bold text-[#94887B]"
        >
          <BackChevronIcon />
          Volver a Niños
        </Link>

        <div className="flex flex-wrap items-start gap-[26px]">
          <div className="flex min-w-[300px] flex-1 flex-col gap-[18px]">
            <div className="flex items-center gap-[18px]">
              <div
                className="flex h-[84px] w-[84px] flex-none items-center justify-center rounded-full font-fredoka text-[34px] font-semibold"
                style={{ background: kid.avatarBg, color: kid.avatarColor }}
              >
                {kid.initial}
              </div>
              <div className="flex-1">
                <h1 className="m-0 font-fredoka text-[28px] font-semibold text-[#3F362E]">
                  {kid.name}
                </h1>
                <p className="m-0 mt-[3px] text-[15px] text-[#94887B]">
                  {kid.age} · Sala {kid.room}
                </p>
              </div>
              <span className="rounded-[12px] border-[1.5px] border-[#ECE0D0] bg-[#FFFDF9] px-4 py-[9px] text-[14px] font-bold text-[#6E6359]">
                Editar
              </span>
            </div>

            {kid.allergies && (
              <div className="flex gap-[14px] rounded-[16px] bg-[#FBDAD6] px-[18px] py-4">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-[11px] bg-[#F4A8A0]">
                  <AlertIcon />
                </div>
                <div>
                  <div className="mb-0.5 text-[15px] font-extrabold text-[#C5413A]">
                    Alergias y notas
                  </div>
                  <div className="text-[14.5px] leading-[1.5] text-[#B25249]">
                    {kid.allergies}
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-hidden rounded-[16px] border border-[#ECE0D0] bg-[#FFFDF9]">
              <div className="flex justify-between border-b border-[#F0E6D8] px-[18px] py-[15px]">
                <span className="text-[14.5px] text-[#94887B]">
                  Fecha de nacimiento
                </span>
                <span className="text-[14.5px] font-extrabold text-[#3F362E]">
                  {kid.birthDate}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#F0E6D8] px-[18px] py-[15px]">
                <span className="text-[14.5px] text-[#94887B]">Sala</span>
                <span className="text-[14.5px] font-extrabold text-[#3F362E]">
                  {kid.room}
                </span>
              </div>
              <div className="flex justify-between px-[18px] py-[15px]">
                <span className="text-[14.5px] text-[#94887B]">Ingreso</span>
                <span className="text-[14.5px] font-extrabold text-[#3F362E]">
                  {kid.joinDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex w-[300px] flex-none flex-col gap-[14px]">
            <span className="flex w-full items-center justify-center gap-[9px] rounded-[14px] bg-[#3F362E] px-[13px] py-[13px] text-[15px] font-extrabold text-white">
              <SummaryIcon />
              Resumen del día
            </span>

            <div className="rounded-[16px] border border-[#ECE0D0] bg-[#FFFDF9] px-[18px] py-4">
              <div className="mb-[14px] text-[12.5px] font-extrabold tracking-[.8px] text-[#8A7C6D]">
                PADRES VINCULADOS
              </div>
              <div className="flex flex-col gap-[14px]">
                {kid.parents.map((parent) => {
                  const active = parent.status === "active";
                  return (
                    <div key={parent.name} className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 flex-none items-center justify-center rounded-full font-fredoka text-base font-semibold text-white"
                        style={{ background: parent.avatarColor }}
                      >
                        {parent.initial}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[14.5px] font-extrabold text-[#3F362E]">
                          {parent.name}
                        </div>
                        <div className="text-[12.5px] text-[#A89A8B]">
                          {parent.role} · {parentStatusLabel(parent.status)}
                        </div>
                      </div>
                      <span
                        className="flex-none rounded-full px-[9px] py-1 text-[10.5px] font-extrabold"
                        style={
                          active
                            ? { background: "#CFEBD8", color: "#3E9B6C" }
                            : { background: "#F7E7A6", color: "#9A7B1E" }
                        }
                      >
                        {active ? "ACTIVA" : "PENDIENTE"}
                      </span>
                    </div>
                  );
                })}
                <ParentInviteButton kidName={kid.name} />
              </div>
            </div>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
