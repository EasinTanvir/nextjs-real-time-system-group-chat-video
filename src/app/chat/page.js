const conversations = [
  ["Emma Johnson", "That's awesome! Can't wait to see...", "10:32 AM", "emma", 2, true],
  ["Design Team", "Liam: Please check the new mockups", "9:45 AM", "team", 4],
  ["Liam Wilson", "See you tomorrow", "9:30 AM", "liam"],
  ["Olivia Brown", "Thank you! 🙌", "Yesterday", "olivia", 1],
  ["Noah Davis", "Okay! Let me know.", "Yesterday", "noah"],
  ["Best Friends", "Sarah: It's movie night! 🍿", "Yesterday", "friends", 3],
  ["Project Alpha", "You: Great work team! 🚀", "Mon", "project"],
  ["Sophia Miller", "Let's catch up later", "Mon", "sophia"],
  ["Marketing Team", "Jason: Campaign is live!", "Sun", "marketing"],
  ["Alexander Smith", "How was your weekend?", "Sun", "alex"],
];

const navItems = [
  ["chats", "Chats", 8, true], ["users", "Friends"], ["users", "Groups"],
  ["phone", "Calls"], ["bell", "Notifications", 3], ["bookmark", "Bookmarks"], ["settings", "Settings"],
];

const favorites = [["Design Team", "team"], ["John Doe", "john"], ["Best Friends", "friends"], ["Project Alpha", "project"]];

function Icon({ name, size = 20, stroke = 1.9 }) {
  const paths = {
    chats: <><path d="M7 17.5 3.8 20v-5.2A7.5 7.5 0 1 1 19.5 12a7.3 7.3 0 0 1-.5 2.7" /><path d="M8 10h8M8 13.5h5" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3.5 20v-1.5A4.5 4.5 0 0 1 8 14h2a4.5 4.5 0 0 1 4.5 4.5V20M16 7a3 3 0 0 1 0 5.8M17 14.2a4.5 4.5 0 0 1 3.5 4.3V20" /></>,
    phone: <path d="M8.1 3.7 5.6 5.1c-.7.4-1 1.2-.7 2A18 18 0 0 0 16.9 19c.8.3 1.6 0 2-.7l1.4-2.5-4.2-2.1-1.3 1.8a13 13 0 0 1-6.2-6.2l1.8-1.3-2.3-4.3Z" />,
    bell: <><path d="M18 10a6 6 0 0 0-12 0c0 7-2.5 7-2.5 8.5h17C20.5 17 18 17 18 10Z" /><path d="M9.5 21h5" /></>,
    bookmark: <path d="M6 3.5h12a1 1 0 0 1 1 1v16l-7-4-7 4v-16a1 1 0 0 1 1-1Z" />,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1 1.7-2 1.2-1.4-1a7 7 0 0 1-2 .8l-.5 1.7h-3.2l-.5-1.7a7 7 0 0 1-2-.8l-1.4 1-2-1.2.1-1.7a7 7 0 0 1-1-1.8l-1.6-.6V9l1.6-.6a7 7 0 0 1 1-1.8L4.5 5l2-1.2 1.4 1a7 7 0 0 1 2-.8l.5-1.7h3.2l.5 1.7a7 7 0 0 1 2 .8l1.4-1 2 1.2-.1 1.7a7 7 0 0 1 1 1.8L22 9v3.4l-1.6.6a7 7 0 0 1-1 2Z" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.2 4.2" /></>,
    filter: <path d="M4 5h16l-6.2 7v5l-3.6 2v-7L4 5Z" />,
    compose: <><path d="m14.5 4.5 5 5M4 20l4.2-1 11-11a2.1 2.1 0 0 0-3-3l-11 11L4 20Z" /></>,
    video: <><rect x="3" y="6.5" width="13" height="11" rx="2" /><path d="m16 10 4.5-2.5v9L16 14" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 10.5V16M12 7.5h.01" /></>,
    smile: <><circle cx="12" cy="12" r="9" /><path d="M8 14.5c1 1.4 2.4 2 4 2s3-.6 4-2M8.5 9.5h.01M15.5 9.5h.01" /></>,
    paperclip: <path d="m20 11.5-7.8 7.8a4 4 0 0 1-5.7-5.7l8.2-8.2a2.7 2.7 0 1 1 3.8 3.8l-8.1 8.1a1.4 1.4 0 0 1-2-2l7.4-7.4" />,
    mic: <><rect x="8.5" y="3" width="7" height="11" rx="3.5" /><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" /></>,
    send: <path d="m21 3-7.2 18-3.3-7.7L3 10.2 21 3ZM10.5 13.5 15 9" />,
    more: <path d="M5 12h.01M12 12h.01M19 12h.01" />,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Avatar({ variant, name, small = false }) {
  const initials = variant === "project" ? "PA" : name.split(" ").map((part) => part[0]).join("").slice(0, 2);
  return <span className={`chat-avatar chat-avatar-${variant} ${small ? "chat-avatar-small" : ""}`} aria-hidden="true">{initials}</span>;
}

function IconButton({ label, name, emphasis = false }) {
  return <button type="button" className={`chat-icon-button ${emphasis ? "chat-icon-button-emphasis" : ""}`} aria-label={label}><Icon name={name} /></button>;
}

function ConversationRow({ item }) {
  const [name, message, time, avatar, unread, active] = item;
  return <button type="button" className={`chat-conversation ${active ? "chat-conversation-active" : ""}`} aria-current={active ? "page" : undefined}>
    <span className="chat-avatar-wrap"><Avatar variant={avatar} name={name} /><i className="chat-online-dot" /></span>
    <span className="chat-conversation-copy"><strong>{name}</strong><span>{message}</span></span>
    <span className="chat-conversation-meta"><time>{time}</time>{unread ? <b>{unread}</b> : null}</span>
  </button>;
}

function Message({ outgoing, children, time }) {
  return <div className={`chat-message ${outgoing ? "chat-message-outgoing" : ""}`}>
    {!outgoing && <Avatar variant="emma" name="Emma Johnson" small />}
    <div><p>{children}</p><time>{time}{outgoing ? "  ✓✓" : ""}</time></div>
  </div>;
}

export default function ChatPage() {
  return <main className="chat-page">
    <aside className="chat-sidebar">
      <div className="chat-brand"><span className="chat-brand-mark"><Icon name="chats" size={23} stroke={2.2} /></span><strong>Chatify</strong></div>
      <nav className="chat-main-nav" aria-label="Application navigation">
        {navItems.map(([icon, label, badge, active]) => <button type="button" className={`chat-nav-item ${active ? "chat-nav-active" : ""}`} key={label}><Icon name={icon} /><span>{label}</span>{badge ? <b>{badge}</b> : null}</button>)}
      </nav>
      <div className="chat-favorites"><div className="chat-favorites-title"><span>Favorites</span><button type="button" aria-label="Add favorite">+</button></div>
        {favorites.map(([name, variant]) => <button className="chat-favorite" type="button" key={name}><Avatar name={name} variant={variant} small /><span>{name}</span><i className="chat-online-dot" /></button>)}
      </div>
      <div className="chat-user"><Avatar variant="john" name="Fasin Tanvir" /><span><strong>Fasin Tanvir</strong><small><i className="chat-online-dot" /> Online</small></span><IconButton label="Open account menu" name="more" /></div>
    </aside>

    <aside className="chat-inbox" aria-label="Conversations">
      <header className="chat-inbox-header"><h1>Conversations</h1><IconButton label="Compose a new message" name="compose" /></header>
      <label className="chat-search"><Icon name="search" size={19} /><input type="search" placeholder="Search conversations..." aria-label="Search conversations" /><Icon name="filter" size={18} /></label>
      <div className="chat-filters" aria-label="Conversation filters"><button className="chat-filter-active" type="button">All</button><button type="button">Unread</button><button type="button">Groups</button><button type="button">Direct</button></div>
      <div className="chat-conversation-list">{conversations.map((item) => <ConversationRow key={item[0]} item={item} />)}</div>
    </aside>

    <section className="chat-thread" aria-label="Conversation with Emma Johnson">
      <header className="chat-thread-header"><div className="chat-recipient"><span className="chat-avatar-wrap"><Avatar variant="emma" name="Emma Johnson" /><i className="chat-online-dot" /></span><span><strong>Emma Johnson</strong><small><i className="chat-online-dot" /> Online</small></span></div><div className="chat-thread-actions"><IconButton label="Search this conversation" name="search" /><IconButton label="Start voice call" name="phone" /><IconButton label="Start video call" name="video" /><IconButton label="View conversation information" name="info" /></div></header>
      <div className="chat-messages"><p className="chat-day-label">Today</p><Message time="10:30 AM">Hey! How are you doing today?</Message><Message outgoing time="10:31 AM">I&apos;m doing great! Just working on the new project.</Message><Message time="10:32 AM">That&apos;s awesome! Can&apos;t wait to see it.</Message><Message outgoing time="10:33 AM">Sure! I&apos;ll share it with you once it&apos;s ready.</Message><Message time="10:34 AM">Sounds good! Let me know if you need any help.</Message><Message outgoing time="10:35 AM">Thanks! I might take you up on that. 😊</Message></div>
      <form className="chat-composer"><input aria-label="Message Emma Johnson" placeholder="Type a message..." /><div><IconButton label="Add emoji" name="smile" /><IconButton label="Attach a file" name="paperclip" /><IconButton label="Record a voice message" name="mic" /><button className="chat-send-button" aria-label="Send message" type="button"><Icon name="send" size={22} /></button></div></form>
    </section>
  </main>;
}
