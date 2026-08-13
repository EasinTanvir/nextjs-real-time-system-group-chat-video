const TONES = [
  "from-cobalt to-cobalt-deep",
  "from-coral to-[#E8461F]",
  "from-ink to-[#3A3F4B]",
];
function toneFromName(name = "") {
  const code = name.charCodeAt(0) || 0;
  return TONES[code % TONES.length];
}

function Avatar({ initials, name, size = "md" }) {
  const sizes = { sm: "h-7 w-7 text-[9px]", md: "h-9 w-9 text-[11px]" };
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br font-bold text-white ${toneFromName(name || initials)} ${sizes[size]}`}
    >
      {initials}
    </span>
  );
}

export default Avatar;
