const { relations, sql } = require("drizzle-orm");
const {
  boolean,
  check,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} = require("drizzle-orm/pg-core");

const friendRequestStatusEnum = pgEnum("friend_request_status", [
  "pending",
  "accepted",
  "rejected",
  "cancelled",
]);

const conversationTypeEnum = pgEnum("conversation_type", ["direct", "group"]);
const conversationMemberRoleEnum = pgEnum("conversation_member_role", ["owner", "admin", "member"]);
const notificationTypeEnum = pgEnum("notification_type", ["friend_request", "friend_accepted", "friend_rejected", "group_created", "group_member_added", "group_member_removed", "message"]);

const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    username: text("username").notNull(),
    passwordHash: text("password_hash").notNull(),
    displayName: text("display_name").notNull(),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("users_email_unique").on(sql`lower(${table.email})`),
    uniqueIndex("users_username_unique").on(sql`lower(${table.username})`),
    index("users_discovery_idx").on(sql`lower(${table.displayName})`),
  ],
);

const userSettings = pgTable("user_settings", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  theme: text("theme").default("system").notNull(),
  notificationsEnabled: boolean("notifications_enabled").default(true).notNull(),
  readReceiptsEnabled: boolean("read_receipts_enabled").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

const friendRequests = pgTable(
  "friend_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    senderId: uuid("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    receiverId: uuid("receiver_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    status: friendRequestStatusEnum("status").default("pending").notNull(),
    respondedAt: timestamp("responded_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check("friend_requests_not_self", sql`${table.senderId} <> ${table.receiverId}`),
    uniqueIndex("friend_requests_one_pending_pair_unique")
      .on(table.senderId, table.receiverId)
      .where(sql`${table.status} = 'pending'`),
    index("friend_requests_receiver_created_idx").on(table.receiverId, table.createdAt.desc()),
    index("friend_requests_sender_created_idx").on(table.senderId, table.createdAt.desc()),
  ],
);

const friendships = pgTable(
  "friendships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userOneId: uuid("user_one_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    userTwoId: uuid("user_two_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check("friendships_distinct_users", sql`${table.userOneId} <> ${table.userTwoId}`),
    check("friendships_canonical_pair", sql`${table.userOneId} < ${table.userTwoId}`),
    unique("friendships_user_pair_unique").on(table.userOneId, table.userTwoId),
    index("friendships_user_one_idx").on(table.userOneId),
    index("friendships_user_two_idx").on(table.userTwoId),
  ],
);

const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: conversationTypeEnum("type").notNull(),
    name: text("name"),
    description: text("description"),
    avatarUrl: text("avatar_url"),
    directUserOneId: uuid("direct_user_one_id").references(() => users.id, { onDelete: "cascade" }),
    directUserTwoId: uuid("direct_user_two_id").references(() => users.id, { onDelete: "cascade" }),
    createdById: uuid("created_by_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    lastMessageId: uuid("last_message_id").references(() => messages.id, { onDelete: "set null" }),
    lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check(
      "conversations_type_shape",
      sql`(
        (${table.type} = 'direct' AND ${table.directUserOneId} IS NOT NULL AND ${table.directUserTwoId} IS NOT NULL AND ${table.name} IS NULL)
        OR
        (${table.type} = 'group' AND ${table.directUserOneId} IS NULL AND ${table.directUserTwoId} IS NULL AND ${table.name} IS NOT NULL)
      )`,
    ),
    check("conversations_direct_distinct_users", sql`${table.directUserOneId} IS NULL OR ${table.directUserOneId} <> ${table.directUserTwoId}`),
    check("conversations_direct_canonical_pair", sql`${table.directUserOneId} IS NULL OR ${table.directUserOneId} < ${table.directUserTwoId}`),
    unique("conversations_direct_pair_unique").on(table.directUserOneId, table.directUserTwoId),
    index("conversations_last_message_at_idx").on(table.lastMessageAt.desc()),
  ],
);

const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check("messages_content_not_blank", sql`length(trim(${table.content})) > 0`),
    index("messages_conversation_cursor_idx").on(table.conversationId, table.createdAt.desc(), table.id.desc()),
    index("messages_sender_created_idx").on(table.senderId, table.createdAt.desc()),
  ],
);

const conversationMembers = pgTable(
  "conversation_members",
  {
    conversationId: uuid("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    role: conversationMemberRoleEnum("role").default("member").notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
    lastReadMessageId: uuid("last_read_message_id").references(() => messages.id, { onDelete: "set null" }),
    lastReadAt: timestamp("last_read_at", { withTimezone: true }),
    leftAt: timestamp("left_at", { withTimezone: true }),
  },
  (table) => [
    primaryKey({ columns: [table.conversationId, table.userId], name: "conversation_members_pkey" }),
    index("conversation_members_user_active_idx").on(table.userId, table.joinedAt.desc()).where(sql`${table.leftAt} IS NULL`),
    index("conversation_members_conversation_active_idx").on(table.conversationId, table.joinedAt).where(sql`${table.leftAt} IS NULL`),
  ],
);

const messageReads = pgTable(
  "message_reads",
  {
    messageId: uuid("message_id").notNull().references(() => messages.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    readAt: timestamp("read_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.messageId, table.userId], name: "message_reads_pkey" }),
    index("message_reads_user_message_idx").on(table.userId, table.messageId),
  ],
);

const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    recipientId: uuid("recipient_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
    conversationId: uuid("conversation_id").references(() => conversations.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("notification_type").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("notifications_recipient_created_idx").on(table.recipientId, table.createdAt.desc()),
    index("notifications_recipient_unread_idx").on(table.recipientId, table.createdAt.desc()).where(sql`${table.readAt} IS NULL`),
  ],
);

const usersRelations = relations(users, ({ many, one }) => ({
  settings: one(userSettings),
  sentFriendRequests: many(friendRequests, { relationName: "friend_request_sender" }),
  receivedFriendRequests: many(friendRequests, { relationName: "friend_request_receiver" }),
  sentMessages: many(messages),
  memberships: many(conversationMembers),
  messageReads: many(messageReads),
  receivedNotifications: many(notifications, { relationName: "notification_recipient" }),
  actedNotifications: many(notifications, { relationName: "notification_actor" }),
}));

const friendRequestsRelations = relations(friendRequests, ({ one }) => ({
  sender: one(users, { fields: [friendRequests.senderId], references: [users.id], relationName: "friend_request_sender" }),
  receiver: one(users, { fields: [friendRequests.receiverId], references: [users.id], relationName: "friend_request_receiver" }),
}));

const conversationsRelations = relations(conversations, ({ one, many }) => ({
  createdBy: one(users, { fields: [conversations.createdById], references: [users.id] }),
  lastMessage: one(messages, { fields: [conversations.lastMessageId], references: [messages.id], relationName: "conversation_last_message" }),
  members: many(conversationMembers),
  messages: many(messages),
}));

const messagesRelations = relations(messages, ({ one, many }) => ({
  conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }),
  sender: one(users, { fields: [messages.senderId], references: [users.id] }),
  reads: many(messageReads),
}));

const conversationMembersRelations = relations(conversationMembers, ({ one }) => ({
  conversation: one(conversations, { fields: [conversationMembers.conversationId], references: [conversations.id] }),
  user: one(users, { fields: [conversationMembers.userId], references: [users.id] }),
  lastReadMessage: one(messages, { fields: [conversationMembers.lastReadMessageId], references: [messages.id], relationName: "member_last_read_message" }),
}));

const messageReadsRelations = relations(messageReads, ({ one }) => ({
  message: one(messages, { fields: [messageReads.messageId], references: [messages.id] }),
  user: one(users, { fields: [messageReads.userId], references: [users.id] }),
}));

const notificationsRelations = relations(notifications, ({ one }) => ({
  recipient: one(users, { fields: [notifications.recipientId], references: [users.id], relationName: "notification_recipient" }),
  actor: one(users, { fields: [notifications.actorId], references: [users.id], relationName: "notification_actor" }),
  conversation: one(conversations, { fields: [notifications.conversationId], references: [conversations.id] }),
}));

module.exports = {
  friendRequestStatusEnum,
  conversationTypeEnum,
  conversationMemberRoleEnum,
  notificationTypeEnum,
  users,
  userSettings,
  friendRequests,
  friendships,
  conversations,
  conversationMembers,
  messages,
  messageReads,
  notifications,
  usersRelations,
  friendRequestsRelations,
  conversationsRelations,
  messagesRelations,
  conversationMembersRelations,
  messageReadsRelations,
  notificationsRelations,
};
