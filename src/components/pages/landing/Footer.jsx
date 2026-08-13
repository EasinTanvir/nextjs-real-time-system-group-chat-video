const Footer = () => (
  <footer className="border-t border-ink/10">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row lg:px-8">
      <span className="font-display text-sm font-semibold text-ink">
        Chatify
      </span>
      <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-ink-soft">
        All systems online
      </div>
      <p className="font-mono text-[11px] text-ink-soft/70">
        © {new Date().getFullYear()} Chatify
      </p>
    </div>
  </footer>
);

export default Footer;
