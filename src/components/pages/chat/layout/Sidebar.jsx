import { usePathname, useRouter } from "next/navigation";
import Brand from "./Brand";
import { LogOut, X } from "lucide-react";
import Link from "next/link";
import Avatar from "./Avatar";
import { navigation } from "@/lib/navigation";
import { logout } from "@/lib/cookies";

function Sidebar({ close }) {
  const pathname = usePathname();

  const router = useRouter();
  return (
    <aside className="flex h-full w-[260px] flex-col border-r border-ink/8 bg-white px-5 py-7">
      <div className="flex items-center justify-between">
        <Brand />
        <button
          onClick={close}
          className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="mt-9 space-y-1" aria-label="Chat navigation">
        {navigation.map(([Icon, label, href]) => {
          const active = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              onClick={close}
              aria-current={active ? "page" : undefined}
              className={`flex h-12 items-center gap-4 rounded-xl px-4 text-[14.5px] font-semibold transition ${
                active
                  ? "bg-cobalt/[.08] text-cobalt"
                  : "text-ink-soft hover:bg-paper hover:text-ink"
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
              <span>{label}</span>
              {active && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cobalt" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-3 border-t border-ink/8 pt-5">
        <span className="relative">
          <Avatar initials="U" size="md" />
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-coral" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-bold text-ink">Account</p>
          <p className="font-mono text-[10px] uppercase tracking-[.05em] text-coral">
            Online
          </p>
        </div>
        <button
          onClick={async () => {
            await logout();

            router.push("/login");
            router.refresh();
          }}
          type="button"
          className="ml-auto grid h-9 w-9 place-items-center rounded-xl text-ink-soft transition hover:bg-paper hover:text-ink"
          aria-label="Log out"
        >
          <LogOut className="h-4.5 w-4.5" />
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
