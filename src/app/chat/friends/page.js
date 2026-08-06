import { Filter, Search, ShieldCheck, UserMinus, UsersRound } from "lucide-react";

const friends = [
  ["Emma Johnson", "@emma.j", "Product designer passionate about creating beautiful and functional experiences.", true, "EJ", "from-rose-300 to-orange-200"],
  ["Liam Wilson", "@liam.w", "Full-stack developer who loves building cool things.", true, "LW", "from-amber-300 to-orange-300"],
  ["Olivia Brown", "@olivia.b", "Marketing specialist. Coffee lover and brand storyteller.", false, "OB", "from-pink-300 to-violet-200"],
  ["Noah Davis", "@noah.d", "UI/UX enthusiast and minimal design advocate.", true, "ND", "from-emerald-300 to-teal-200"],
  ["Sophia Miller", "@sophia.m", "Photographer & storyteller. Capturing moments that matter.", false, "SM", "from-sky-300 to-indigo-200"],
  ["Alexander Smith", "@alex.s", "Data scientist by day, music producer by night.", true, "AS", "from-cyan-300 to-blue-200"],
];

function Avatar({ initials, color, online }) {
  return <span className="relative shrink-0"><span className={`grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br ${color} text-sm font-bold text-slate-700`}>{initials}</span><span className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${online ? "bg-emerald-500" : "bg-slate-300"}`} /></span>;
}

function Status({ online }) {
  return <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${online ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}`}><span className={`h-2 w-2 rounded-full ${online ? "bg-emerald-500" : "bg-slate-400"}`} />{online ? "Online" : "Offline"}</span>;
}

export default function FriendsPage() {
  return (
    <main className="mx-auto max-w-[1500px] px-4 py-7 sm:px-8 sm:py-8 lg:px-8 xl:px-10">
      <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_350px] xl:gap-7">
        <section aria-labelledby="friends-heading" className="min-w-0">
          <h1 id="friends-heading" className="text-[30px] font-bold tracking-[-.04em] text-slate-950 sm:text-[32px]">Friends</h1>
          <p className="mt-1 text-[16px] text-slate-500">Keep up with the people you&apos;re connected with on Chatify.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row"><label className="flex h-12 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-slate-500 shadow-sm"><Search className="h-5 w-5" /><input type="search" aria-label="Search friends" placeholder="Search friends by name or username..." className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-500" /></label><button className="inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-slate-100 px-7 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"><Filter className="h-5 w-5" />Filters</button></div>
          <div className="mt-5 flex flex-wrap gap-3" aria-label="Friend filters"><button aria-pressed="true" className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-4 text-sm font-semibold text-blue-600"><UsersRound className="h-4 w-4" />All Friends</button><button aria-pressed="false" className="inline-flex h-9 items-center gap-2 rounded-full bg-slate-100 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-200"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Online</button><button aria-pressed="false" className="inline-flex h-9 items-center rounded-full bg-slate-100 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-200">A↕ By Name</button></div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_6px_18px_rgba(15,23,42,.025)]">{friends.map(([name, handle, bio, online, initials, color]) => <article key={name} className="flex flex-col gap-4 border-b border-slate-100 px-4 py-5 last:border-b-0 sm:flex-row sm:items-center sm:px-5"><div className="flex min-w-[190px] items-center gap-3"><Avatar initials={initials} color={color} online={online} /><div className="min-w-0"><h2 className="truncate text-[15px] font-bold text-slate-900">{name}</h2><p className="mt-0.5 text-sm text-slate-500">{handle}</p></div></div><div className="sm:w-[105px]"><Status online={online} /></div><p className="min-w-0 flex-1 text-sm leading-6 text-slate-600">{bio}</p><button type="button" className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 text-sm font-semibold text-rose-600 transition hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"><UserMinus className="h-4 w-4" />Unfriend</button></article>)}</div>
        </section>
        <aside className="space-y-5" aria-label="Friendship summary"><section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_6px_18px_rgba(15,23,42,.025)]"><span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-600"><UsersRound className="h-6 w-6" /></span><h2 className="mt-5 text-[19px] font-bold tracking-[-.03em] text-slate-900">Your circle</h2><p className="mt-2 text-sm leading-6 text-slate-500">You&apos;re connected with {friends.length} friends. Start a conversation anytime from Chats.</p><div className="mt-6 grid grid-cols-2 divide-x divide-slate-200 rounded-xl bg-slate-50 py-3 text-center"><div><p className="text-2xl font-bold text-slate-900">{friends.length}</p><p className="mt-1 text-xs font-semibold text-slate-500">Friends</p></div><div><p className="text-2xl font-bold text-emerald-600">4</p><p className="mt-1 text-xs font-semibold text-slate-500">Online now</p></div></div></section><section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-blue-50 via-indigo-50 to-white p-6"><span className="grid h-12 w-12 place-items-center rounded-xl bg-white text-indigo-600 shadow-sm"><ShieldCheck className="h-6 w-6" /></span><h2 className="mt-5 text-[18px] font-bold text-slate-900">Your connections</h2><p className="mt-2 text-sm leading-6 text-slate-600">Only accepted friends are shown here. You can remove a connection whenever you need to.</p></section></aside>
      </div>
      <footer className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>© 2024 Chatify. All rights reserved.</p><div className="flex flex-wrap gap-x-7 gap-y-2"><a href="#privacy" className="hover:text-blue-600">Privacy Policy</a><a href="#terms" className="hover:text-blue-600">Terms of Service</a><a href="#help" className="hover:text-blue-600">Help Center</a></div></footer>
    </main>
  );
}
