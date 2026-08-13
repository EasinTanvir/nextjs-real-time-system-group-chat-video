import { useState } from "react";

function ActiveMembersDropdown({ members, onlineUsers }) {
  const [open, setOpen] = useState(false);
  const activeCount = members.filter((m) =>
    onlineUsers.has(String(m.userId)),
  ).length;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1.5 rounded-full bg-coral-soft px-3 py-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[.04em] text-coral">
        <span className="h-1.5 w-1.5 rounded-full bg-coral" />
        {activeCount} active
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-56 rounded-xl border border-ink/8 bg-white p-2 shadow-[0_16px_40px_rgba(20,22,27,.14)]">
          {members.map((m) => {
            const isOnline = onlineUsers.has(String(m.userId));
            return (
              <div
                key={m.userId}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[12.5px]"
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${isOnline ? "bg-coral" : "bg-ink-soft/40"}`}
                />
                <span className="truncate text-ink">{m.username}</span>
                {!isOnline && (
                  <span className="ml-auto font-mono text-[9.5px] uppercase text-ink-soft">
                    Offline
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ActiveMembersDropdown;
