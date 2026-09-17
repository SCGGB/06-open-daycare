"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { kids } from "@/app/data/kids";

type PostType =
  | "Comida"
  | "Siesta"
  | "Actividad"
  | "Logro"
  | "Ánimo"
  | "Foto"
  | "Anuncio";

interface PostTypeOption {
  label: PostType;
  color: string;
  soft: string;
}

const POST_TYPES: PostTypeOption[] = [
  { label: "Comida", color: "#9A7B1E", soft: "#F4DC8E" },
  { label: "Siesta", color: "#7B5FC0", soft: "#E7DCF6" },
  { label: "Actividad", color: "#2E89A6", soft: "#C7E7F1" },
  { label: "Logro", color: "#3E9B6C", soft: "#CFEBD8" },
  { label: "Ánimo", color: "#C56486", soft: "#F9D2DE" },
  { label: "Foto", color: "#D9684A", soft: "#FBD8CC" },
  { label: "Anuncio", color: "#4E72C8", soft: "#CCD8F4" },
];

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
}

function ImagePlaceholderIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 21" />
    </svg>
  );
}

function AddIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#C5503A"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CreatePostModalContent({ onClose }: { onClose: () => void }) {
  const [selectedKidIds, setSelectedKidIds] = useState<string[]>([]);
  const [wholeRoomSelected, setWholeRoomSelected] = useState(false);
  const [postType, setPostType] = useState<PostType>("Comida");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [recipientError, setRecipientError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleClose() {
    photos.forEach((url) => URL.revokeObjectURL(url));
    onClose();
  }

  function toggleKid(id: string) {
    setWholeRoomSelected(false);
    setSelectedKidIds((prev) =>
      prev.includes(id) ? prev.filter((kidId) => kidId !== id) : [...prev, id],
    );
    setRecipientError("");
  }

  function selectWholeRoom() {
    setWholeRoomSelected((prev) => !prev);
    setSelectedKidIds([]);
    setRecipientError("");
  }

  function handleAddPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;
    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setPhotos((prev) => [...prev, ...urls]);
    event.target.value = "";
  }

  function handlePublish() {
    const hasRecipient = wholeRoomSelected || selectedKidIds.length > 0;
    const trimmedDescription = description.trim();
    if (!hasRecipient) setRecipientError("Elegí al menos un niño.");
    if (!trimmedDescription) setDescriptionError("Escribí una descripción.");
    if (!hasRecipient || !trimmedDescription) return;
    handleClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-6 pt-10 pb-10">
      <div className="w-full max-w-[580px] overflow-hidden rounded-[24px] border border-[#ECE0D0] bg-[#FBF4EC] shadow-[0_20px_50px_-24px_rgba(63,54,46,.35)]">
        <div className="flex items-center justify-between border-b border-[#ECE0D0] px-[26px] py-5">
          <button
            onClick={handleClose}
            className="text-[15px] font-bold text-[#94887B]"
          >
            Cancelar
          </button>
          <span className="font-fredoka text-[18px] font-semibold text-[#3F362E]">
            Nueva publicación
          </span>
          <button
            onClick={handlePublish}
            className="text-[15px] font-extrabold text-[#D9583C]"
          >
            Publicar
          </button>
        </div>

        <div className="px-[26px] py-6">
          <div className="mb-2.5 text-[12px] font-extrabold tracking-[.7px] text-[#94887B]">
            PARA
          </div>
          <div className="mb-[22px]">
            <div className="flex flex-wrap gap-[9px]">
              {kids.map((kid) => {
                const active = selectedKidIds.includes(kid.id);
                const firstName = kid.name.split(" ")[0];
                return (
                  <button
                    key={kid.id}
                    onClick={() => toggleKid(kid.id)}
                    className={`flex items-center gap-2 rounded-full border-[1.5px] py-1.5 pl-1.5 pr-3.5 text-[14px] font-bold ${
                      active
                        ? "border-[#3F362E] bg-[#3F362E] text-white"
                        : "border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359]"
                    }`}
                  >
                    <span
                      className="flex h-[26px] w-[26px] items-center justify-center rounded-full font-fredoka text-[13px] font-semibold"
                      style={{
                        background: kid.avatarBg,
                        color: kid.avatarColor,
                      }}
                    >
                      {kid.initial}
                    </span>
                    {firstName}
                  </button>
                );
              })}
              <button
                onClick={selectWholeRoom}
                className={`rounded-full border-[1.5px] px-4 py-1.5 text-[14px] font-bold ${
                  wholeRoomSelected
                    ? "border-[#3F362E] bg-[#3F362E] text-white"
                    : "border-[#ECE0D0] bg-[#FFFDF9] text-[#6E6359]"
                }`}
              >
                Toda la sala
              </button>
            </div>
            {recipientError && (
              <p className="mt-2 text-[12px] text-[#D9583C]">
                {recipientError}
              </p>
            )}
          </div>

          <div className="mb-2.5 text-[12px] font-extrabold tracking-[.7px] text-[#94887B]">
            TIPO
          </div>
          <div className="mb-[22px] flex flex-wrap gap-[9px]">
            {POST_TYPES.map(({ label, color, soft }) => {
              const active = label === postType;
              return (
                <button
                  key={label}
                  onClick={() => setPostType(label)}
                  className="rounded-full px-4 py-2 text-[13.5px] font-extrabold"
                  style={
                    active
                      ? { background: color, color: "#fff" }
                      : { background: soft, color }
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="mb-2.5 text-[12px] font-extrabold tracking-[.7px] text-[#94887B]">
            DESCRIPCIÓN
          </div>
          <div className="mb-[22px]">
            <textarea
              placeholder="Contá cómo le fue hoy…"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                if (descriptionError) setDescriptionError("");
              }}
              className={`min-h-[120px] w-full resize-y rounded-[14px] border-[1.5px] bg-white px-4 py-3.5 text-[15px] leading-[1.5] text-[#3F362E] placeholder:text-[#B6A99B] focus:outline-none ${
                descriptionError ? "border-[#D9583C]" : "border-[#EADFD0]"
              }`}
            />
            {descriptionError && (
              <p className="mt-1 text-[12px] text-[#D9583C]">
                {descriptionError}
              </p>
            )}
          </div>

          <div className="mb-2.5 text-[12px] font-extrabold tracking-[.7px] text-[#94887B]">
            FOTOS
          </div>
          <div className="flex flex-wrap gap-3">
            {photos.length === 0 && (
              <div className="flex h-24 w-24 items-center justify-center rounded-[14px] border border-[#ECE0D0] bg-[#F4ECE1] text-[#CBB89F]">
                <ImagePlaceholderIcon />
              </div>
            )}
            {photos.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url}
                src={url}
                alt=""
                className="h-24 w-24 rounded-[14px] object-cover"
              />
            ))}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex h-24 w-24 flex-col items-center justify-center gap-1.5 rounded-[14px] border-[1.5px] border-dashed border-[#DBCDBA] bg-[#F4ECE1] text-[#B0A290]"
            >
              <AddIcon />
              <span className="text-[12px]">Agregar</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleAddPhotos}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CreatePostModal({ open, onClose }: CreatePostModalProps) {
  if (!open) return null;
  return <CreatePostModalContent onClose={onClose} />;
}
