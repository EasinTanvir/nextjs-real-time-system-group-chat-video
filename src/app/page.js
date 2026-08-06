const conversations = [
  { name: "Emma Johnson", message: "Hey! How are you doing today?", time: "10:30 AM", avatar: "EJ", active: true, unread: 2 },
  { name: "Design Team", message: "Alex: Shared a file", time: "9:45 AM", avatar: "DT", unread: 1 },
  { name: "Liam Wilson", message: "See you tomorrow", time: "9:30 AM", avatar: "LW" },
  { name: "Olivia Brown", message: "Thank you!", time: "Yesterday", avatar: "OB" },
  { name: "Noah Davis", message: "Okay!", time: "Yesterday", avatar: "ND" },
  { name: "Best Friends", message: "Sarah: It’s movie night!", time: "Yesterday", avatar: "BF" },
];

const features = [
  { icon: "◯", tone: "blue", title: "Real-time Messaging", text: "Instant messaging with real-time updates. See when people are typing and stay in sync." },
  { icon: "♧", tone: "green", title: "Group Conversations", text: "Create groups, add members, and collaborate together in organized spaces." },
  { icon: "♙", tone: "orange", title: "Secure & Private", text: "End-to-end security keeps your conversations private and your data protected." },
  { icon: "⌕", tone: "pink", title: "Voice & Video Calls", text: "High-quality voice and video calls to connect face-to-face, anytime, anywhere." },
];

const benefits = [
  ["♢", "Secure & Private", "Your data is always protected"],
  ["ϟ", "Lightning Fast", "Real-time messaging at scale"],
  ["♧", "For Everyone", "Built for teams, friends & communities"],
];

function Brand() {
  return <div className="brand"><span className="brand-mark">◯</span><span>Chatify</span></div>;
}

function IconButton({ label, children }) {
  return <button type="button" className="icon-button" aria-label={label}>{children}</button>;
}

function Avatar({ initials, small = false }) {
  return <span className={`avatar ${small ? "avatar-small" : ""}`}>{initials}</span>;
}

function ChatMockup() {
  return (
    <div className="chat-mockup" aria-label="Chatify product interface preview">
      <aside className="mock-sidebar">
        <div className="mock-brand-row"><Brand /><IconButton label="Compose message">⌑</IconButton></div>
        <div className="mock-search">⌕ <span>Search conversations...</span><kbd>⌘K</kbd></div>
        <nav className="mock-nav" aria-label="Chat preview navigation">
          <button className="mock-nav-item selected" type="button"><span>▣</span> Inbox <b>8</b></button>
          <button className="mock-nav-item" type="button"><span>@</span> Mentions</button>
          <button className="mock-nav-item" type="button"><span>♧</span> Friends</button>
          <button className="mock-nav-item" type="button"><span>♧</span> Groups</button>
          <button className="mock-nav-item" type="button"><span>♧</span> Bookmarks</button>
          <button className="mock-nav-item" type="button"><span>⚙</span> Settings</button>
        </nav>
        <p className="favorites-label">Favorites</p>
        {["Emma Johnson", "Design Team", "Best Friends", "Liam Wilson"].map((name, index) => (
          <div className="favorite" key={name}><Avatar initials={name.split(" ").map((part) => part[0]).join("")} small /><span>{name}</span><i className="online-dot" /></div>
        ))}
        <div className="mock-profile"><Avatar initials="JD" /><span><strong>John Doe</strong><small>Online</small></span><span>⌄</span></div>
      </aside>

      <section className="mock-inbox" aria-label="Conversation list">
        <header className="inbox-header"><strong>Inbox</strong><span>⌄</span><div><IconButton label="Add chat">＋</IconButton><IconButton label="More inbox options">•••</IconButton></div></header>
        <div className="conversation-list">
          {conversations.map((chat) => (
            <article className={`conversation ${chat.active ? "conversation-active" : ""}`} key={chat.name}>
              <Avatar initials={chat.avatar} />
              <div className="conversation-copy"><strong>{chat.name}</strong><span>{chat.message}</span></div>
              <div className="conversation-meta"><time>{chat.time}</time>{chat.unread ? <b>{chat.unread}</b> : null}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="mock-chat" aria-label="Conversation with Emma Johnson">
        <header className="active-chat-header"><div><Avatar initials="EJ" /><span><strong>Emma Johnson</strong><small><i className="online-dot" /> Online</small></span></div><div><IconButton label="Start voice call">⌕</IconButton><IconButton label="Start video call">▭</IconButton><IconButton label="Conversation menu">•••</IconButton></div></header>
        <div className="message-area">
          <p className="today-label">Today</p>
          <div className="message incoming"><Avatar initials="EJ" small /><div><p>Hey! How are you doing today?</p><time>10:30 AM</time></div></div>
          <div className="message outgoing"><div><p>I’m doing great! Just working<br />on the new project.</p><time>10:31 AM ✓✓</time></div></div>
          <div className="message incoming"><Avatar initials="EJ" small /><div><p>That’s awesome! Can’t wait<br />to see it.</p><time>10:32 AM</time></div></div>
          <div className="message outgoing"><div><p>Sure! I’ll share it with you<br />once it’s ready.</p><time>10:33 AM ✓✓</time></div></div>
        </div>
        <div className="composer"><span>Type a message...</span><div><IconButton label="Add emoji">☺</IconButton><IconButton label="Attach file">♧</IconButton><button type="button" className="send-button" aria-label="Send message">➤</button></div></div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      <section className="hero-shell">
        <header className="site-header">
          <Brand />
          <nav className="site-nav" aria-label="Primary navigation"><a href="#features">Features</a><a href="#security">Security</a><a href="#pricing">Pricing</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
          <div className="header-actions"><button type="button" className="login-button">Log in</button><button type="button" className="primary-button">Get Started</button></div>
        </header>

        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">✧ &nbsp; Modern chat for teams and friends</p>
            <h1>Real-time conversations,<br /><span>meaningful connections.</span></h1>
            <p className="hero-description">Chatify is a modern chat application built for everyone.<br />Clean design, real-time messaging, and powerful features<br />to keep you connected.</p>
            <div className="hero-actions"><button type="button" className="primary-button large-button">Get Started for Free <span>→</span></button><button type="button" className="secondary-button large-button">See Features <span>▷</span></button></div>
            <div className="benefit-row">{benefits.map(([icon, title, text]) => <div className="benefit" key={title}><span className="benefit-icon">{icon}</span><p><strong>{title}</strong><span>{text}</span></p></div>)}</div>
          </div>
          <ChatMockup />
        </div>
      </section>

      <section className="features-section" id="features">
        <p className="section-kicker">POWERFUL FEATURES</p>
        <h2>Everything you need in one place</h2>
        <p className="section-subtitle">Designed to help you communicate better and get more done.</p>
        <div className="feature-grid">{features.map((feature) => <article className="feature-card" key={feature.title}><span className={`feature-icon ${feature.tone}`}>{feature.icon}</span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div>
        <div className="metrics" id="security"><div><span>♧</span><p><strong>50K+</strong><small>Active Users</small></p></div><div><span>➤</span><p><strong>1M+</strong><small>Messages Sent</small></p></div><div><span>◎</span><p><strong>99.9%</strong><small>Uptime</small></p></div><div><span>♢</span><p><strong>256-bit</strong><small>SSL Encryption</small></p></div></div>
      </section>
    </main>
  );
}
