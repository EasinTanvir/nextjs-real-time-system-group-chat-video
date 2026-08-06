import {
  EllipsisVertical,
  Filter,
  Search,
  Sparkles,
  UserPlus,
  UsersRound,
} from "lucide-react";

const users = [
  ["Emma Johnson", "@emma.j", "Product designer passionate about creating beautiful and functional experiences.", true, "EJ", "from-rose-300 to-orange-200"],
  ["Liam Wilson", "@liam.w", "Full-stack developer who loves building cool things.", true, "LW", "from-amber-300 to-orange-300"],
  ["Olivia Brown", "@olivia.b", "Marketing specialist. Coffee lover ☕", false, "OB", "from-pink-300 to-violet-200"],
  ["Noah Davis", "@noah.d", "UI/UX enthusiast and minimal design advocate.", true, "ND", "from-emerald-300 to-teal-200"],
  ["Sophia Miller", "@sophia.m", "Photographer & storyteller. Capturing moments that matter.", false, "SM", "from-sky-300 to-indigo-200"],
  ["Alexander Smith", "@alex.s", "Data scientist by day, music producer by night.", true, "AS", "from-cyan-300 to-blue-200"],
  ["Marketing Team", "@marketing", "Official account for all marketing team updates.", false, "MT", "from-slate-600 to-slate-800"],
];

const suggestions = [
  ["James Anderson", "@james.a", "JA", "from-amber-300 to-orange-200"],
  ["Isabella Martinez", "@isabella.m", "IM", "from-emerald-300 to-teal-200"],
  ["William Taylor", "@william.t", "WT", "from-blue-300 to-indigo-200"],
  ["Ava Thomas", "@ava.t", "AT", "from-pink-300 to-rose-200"],
  ["Jacob White", "@jacob.w", "JW", "from-slate-300 to-slate-100"],
];

function Avatar({ initials, color, online, size = "md" }) {
  const sizeClass = size === "sm" ? "h-10 w-10 text-xs" : "h-12 w-12 text-sm";
  return <span className="relative shrink-0"><span className={`grid ${sizeClass} place-items-center rounded-full bg-gradient-to-br ${color} font-bold text-slate-700`}>{initials}</span>{typeof online === "boolean" && <span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${online ? "bg-emerald-500" : "bg-slate-300"}`} />}</span>;
}

function AddButton({ compact = false }) {
  return <button className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-blue-500 bg-gradient-to-br from-blue-600 to-indigo-600 font-semibold text-white shadow-[0_7px_16px_rgba(37,99,235,.18)] transition hover:-translate-y-px hover:shadow-[0_9px_18px_rgba(37,99,235,.26)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${compact ? "h-9 px-4 text-xs" : "h-10 px-4 text-sm"}`}><UserPlus className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />Add{compact ? "" : " Friend"}</button>;
}

function Status({ online }) {
  return <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${online ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}><span className={`h-2 w-2 rounded-full ${online ? "bg-emerald-500" : "bg-slate-400"}`} />{online ? "Online" : "Offline"}</span>;
}

export default function UsersPage() {
  return (
    <main className="mx-auto max-w-[1500px] px-4 py-7 sm:px-8 sm:py-8 lg:px-8 xl:px-10">
      <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_350px] xl:gap-7">
        <section aria-labelledby="users-heading" className="min-w-0">
          <h1 id="users-heading" className="text-[30px] font-bold tracking-[-.04em] text-slate-950 sm:text-[32px]">Users</h1>
          <p className="mt-1 text-[16px] text-slate-500">Discover and connect with people on Chatify.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <label className="flex h-12 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-slate-500 shadow-sm"><Search className="h-5 w-5" /><input type="search" aria-label="Search users" placeholder="Search users by name, username or email..." className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-500" /></label>
            <button className="inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-slate-100 px-7 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"><Filter className="h-5 w-5" />Filters</button>
          </div>
          <div className="mt-5 flex flex-wrap gap-3" aria-label="User filters">
            <button aria-pressed="true" className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-4 text-sm font-semibold text-blue-600"><UsersRound className="h-4 w-4" />All Users</button>
            <button aria-pressed="false" className="inline-flex h-9 items-center gap-2 rounded-full bg-slate-100 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-200"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Online</button>
            <button aria-pressed="false" className="inline-flex h-9 items-center gap-1.5 rounded-full bg-slate-100 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-200"><Sparkles className="h-4 w-4 text-violet-500" />New Users</button>
            <button aria-pressed="false" className="inline-flex h-9 items-center rounded-full bg-slate-100 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-200">A↕ By Name</button>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_6px_18px_rgba(15,23,42,.025)]">
            {users.map(([name, handle, bio, online, initials, color]) => <article key={name} className="flex flex-col gap-4 border-b border-slate-100 px-4 py-5 last:border-b-0 sm:flex-row sm:items-center sm:px-5 sm:py-5"><div className="flex min-w-[190px] items-center gap-3"><Avatar initials={initials} color={color} online={online} /><div className="min-w-0"><h2 className="truncate text-[15px] font-bold text-slate-900">{name}</h2><p className="mt-0.5 text-sm text-slate-500">{handle}</p></div></div><div className="sm:w-[105px]"><Status online={online} /></div><p className="min-w-0 flex-1 text-sm leading-6 text-slate-600">{bio}</p><div className="flex items-center gap-2 sm:ml-auto"><AddButton /><button className="grid h-10 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800" aria-label={`More actions for ${name}`}><EllipsisVertical className="h-5 w-5" /></button></div></article>)}
          </div>
        </section>
        <aside className="space-y-5" aria-label="People suggestions">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_6px_18px_rgba(15,23,42,.025)]" aria-labelledby="suggestions-heading"><div className="flex items-center justify-between"><h2 id="suggestions-heading" className="text-[17px] font-bold tracking-[-.025em] text-slate-900">People You May Know</h2><button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View all</button></div><div className="mt-5 space-y-4">{suggestions.map(([name, handle, initials, color]) => <div key={name} className="flex items-center gap-3"><Avatar initials={initials} color={color} size="sm" /><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-bold text-slate-900">{name}</h3><p className="truncate text-xs text-slate-500">{handle}</p></div><AddButton compact /></div>)}</div></section>
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-indigo-50/40 to-white px-7 py-9 text-center shadow-[0_6px_18px_rgba(15,23,42,.025)]" aria-labelledby="invite-heading"><span className="mx-auto grid h-20 w-20 place-items-center rounded-[23px] bg-gradient-to-br from-blue-200 to-indigo-100 text-blue-600 shadow-[0_10px_26px_rgba(99,102,241,.14)]"><UsersRound className="h-10 w-10" /></span><h2 id="invite-heading" className="mt-6 text-[19px] font-bold tracking-[-.03em] text-slate-900">Invite Your Friends</h2><p className="mt-2 text-sm leading-6 text-slate-500">The more, the merrier! Invite your friends to join Chatify.</p><button className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-[0_9px_18px_rgba(37,99,235,.18)] transition hover:-translate-y-px"><UserPlus className="h-4 w-4" />Invite Friends</button></section>
        </aside>
      </div>
      <footer className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>© 2024 Chatify. All rights reserved.</p><div className="flex flex-wrap gap-x-7 gap-y-2"><a href="#privacy" className="hover:text-blue-600">Privacy Policy</a><a href="#terms" className="hover:text-blue-600">Terms of Service</a><a href="#help" className="hover:text-blue-600">Help Center</a></div></footer>
    </main>
  );
}
