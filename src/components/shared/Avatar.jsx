function toneFromName(name = "") {
  const code = name.charCodeAt(0) || 0;
  return TONES[code % TONES.length];
}
const TONES = [
  "from-cobalt to-cobalt-deep",
  "from-coral to-[#E8461F]",
  "from-ink to-[#3A3F4B]",
];

function Avatar({ name, size = 32 }) {
  const initial = name?.[0]?.toUpperCase() || "?";
  return (
    <div
      style={{ width: size, height: size }}
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold text-white ${toneFromName(name)}`}
    >
      {initial}
    </div>
  );
}

export default Avatar;
