export type BadgeVariant = "achievement" | "activity" | "notice";

const badgeConfig: Record<BadgeVariant, { label: string; dotColor: string; bg: string }> = {
  achievement: { label: "LOGRO", dotColor: "#3E9B6C", bg: "#CFEBD8" },
  activity: { label: "ACTIVIDAD", dotColor: "#2E89A6", bg: "#C7E7F1" },
  notice: { label: "ANUNCIO", dotColor: "#4E72C8", bg: "#CCD8F4" },
};

export function Badge({ variant }: { variant: BadgeVariant }) {
  const config = badgeConfig[variant];
  return (
    <div
      className="flex flex-none items-center gap-[7px] rounded-full px-3 py-1.5"
      style={{ background: config.bg }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ background: config.dotColor }}
      />
      <span
        className="text-xs font-extrabold tracking-[.5px]"
        style={{ color: config.dotColor }}
      >
        {config.label}
      </span>
    </div>
  );
}
