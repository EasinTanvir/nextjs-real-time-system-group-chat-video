import { MessageCircle } from "lucide-react";
import Link from "next/link";

function Brand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5"
      aria-label="Chatify home"
    >
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-ink text-coral">
        <MessageCircle className="h-[18px] w-[18px]" strokeWidth={2.4} />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-coral ring-2 ring-white" />
      </span>
      <span className="font-display text-[21px] font-bold tracking-[-.04em] text-ink">
        Chatify
      </span>
    </Link>
  );
}

export default Brand;
