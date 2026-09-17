import { ImageIcon, MegaphoneIcon } from "./components/icons";
import { PostCard } from "./components/PostCard";
import { PostComposer } from "./components/PostComposer";
import { Sidebar } from "./components/Sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#F6ECDF]">
      <Sidebar />

      <main className="h-screen min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[760px] px-10 pt-[34px] pb-20">
          <div className="mb-6">
            <div className="mb-1 text-[12.5px] font-extrabold tracking-[.8px] text-[#D9583C]">
              GUARDERÍA · SALA SOLES
            </div>
            <h1 className="m-0 font-fredoka text-[30px] font-semibold text-[#3F362E]">
              Buenas, Caro
            </h1>
            <p className="mt-1.25 m-0 text-[14.5px] text-[#94887B]">
              12 niños · martes 17 jun
            </p>
          </div>

          <PostComposer />

          <div className="mb-[14px] flex items-center gap-[14px]">
            <span className="text-[12.5px] font-extrabold tracking-[.8px] text-[#8A7C6D]">
              PUBLICADO HOY
            </span>
            <span className="h-px flex-1 bg-[#E7DAC8]" />
          </div>

          <div className="flex flex-col gap-4">
            <PostCard
              author="Mateo"
              meta="14:20 · publicado por vos"
              badge="achievement"
              recipient="Para: familia de Mateo"
              likeCount={3}
              commentCount={1}
              avatar={
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#A9D9E8] font-fredoka text-[17px] font-semibold text-[#1F7A93]">
                  M
                </div>
              }
            >
              <p className="m-0 text-[15.5px] leading-[1.55] text-[#4A4038]">
                ¡Usó el orinal solito por primera vez! Estaba feliz de
                contárselo a todos. Un gran paso.
              </p>
            </PostCard>

            <PostCard
              author="Mateo"
              meta="09:40 · publicado por vos"
              badge="activity"
              recipient="Para: familia de Mateo"
              likeCount={5}
              commentCount={2}
              avatar={
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#A9D9E8] font-fredoka text-[17px] font-semibold text-[#1F7A93]">
                  M
                </div>
              }
            >
              <p className="m-0 text-[15.5px] leading-[1.55] text-[#4A4038]">
                Pintamos con témperas esta mañana. Mateo eligió el azul para
                todo y se concentró un montón mezclando colores.
              </p>
              <a
                href="#"
                className="mt-[14px] flex h-[200px] flex-col items-center justify-center gap-2 rounded-[16px] border-[1.5px] border-dashed border-[#DBCDBA] bg-[#F4ECE1] text-[#B0A290]"
              >
                <ImageIcon />
                <span className="text-[13.5px]">
                  Foto · pintando con témperas
                </span>
              </a>
            </PostCard>

            <PostCard
              author="Anuncio general"
              meta="07:50 · publicado por vos"
              badge="notice"
              recipient="Para: toda la sala"
              likeCount={8}
              commentCount={0}
              avatar={
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#CCD8F4] text-[#4E72C8]">
                  <MegaphoneIcon />
                </div>
              }
            >
              <p className="m-0 text-[15.5px] leading-[1.55] text-[#4A4038]">
                El viernes salimos al parque por la mañana. Recuerden mandar
                gorra y una botellita de agua.
              </p>
            </PostCard>
          </div>
        </div>
      </main>
    </div>
  );
}
