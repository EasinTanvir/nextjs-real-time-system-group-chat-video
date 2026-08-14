import { MessageCircle } from "lucide-react";
import Link from "next/link";

function Brand() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5"
      aria-label="Chatify home"
    >
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
        <MessageCircle className="h-[18px] w-[18px]" strokeWidth={2.4} />

        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-white ring-2 ring-emerald-500" />
      </span>

      <span className="font-display text-[20px] font-bold tracking-[-.04em] text-slate-950">
        Chatify
      </span>
    </Link>
  );
}

export default Brand;
