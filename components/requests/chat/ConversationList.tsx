import Image from "next/image";
import { DeveloperPortfolioLink } from "@/components/developers/DeveloperPortfolioLink";
import { UnreadBadge, UnreadDot } from "@/components/requests/UnreadBadge";
import { APPLICATION_STATUS_LABELS } from "@/lib/project-request-labels";

export type ChatContact = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
};

export type Conversation = {
  id: string;
  developer: ChatContact;
  contact: ChatContact;
  pitchMessage: string | null;
  status: string;
  messageCount: number;
  lastMessage: { body: string; createdAt: string; senderId: string } | null;
};

function formatContactTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (sameDay) {
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  }

  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function ContactAvatar({ contact, unreadCount = 0 }: { contact: ChatContact; unreadCount?: number }) {
  const name = contact.name ?? contact.email;

  return (
    <div className="relative h-10 w-10 shrink-0">
      <div className="relative h-10 w-10 overflow-hidden border border-muted bg-page">
        {contact.avatarUrl ? (
          <Image src={contact.avatarUrl} alt={name} fill className="object-cover" />
        ) : (
          <span className="flex h-full items-center justify-center text-sm font-bold text-primary">
            {name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <UnreadDot show={unreadCount > 0} />
    </div>
  );
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  unreadCounts = {},
}: {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  unreadCounts?: Record<string, number>;
}) {
  if (conversations.length === 0) {
    return (
      <div className="p-4 text-xs text-muted">
        Belum ada developer yang mengajukan.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-muted px-4 py-3">
        <h4 className="text-xs font-bold uppercase text-muted">Kontak</h4>
        <p className="mt-1 text-xs text-muted">{conversations.length} developer</p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {conversations.map((conv) => {
          const name = conv.contact.name ?? conv.contact.email;
          const active = conv.id === selectedId;
          const preview = conv.lastMessage?.body ?? conv.pitchMessage;
          const previewTime = conv.lastMessage?.createdAt;
          const unreadCount = unreadCounts[conv.id] ?? 0;

          return (
            <button
              key={conv.id}
              type="button"
              onClick={() => onSelect(conv.id)}
              className={`flex w-full items-start gap-3 border-b border-muted p-4 text-left transition-colors hover:bg-page ${
                active ? "border-l-2 border-l-primary bg-page" : "border-l-2 border-l-transparent"
              }`}
            >
              <ContactAvatar contact={conv.contact} unreadCount={unreadCount} />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-bold uppercase text-text-main">{name}</p>
                      <UnreadBadge count={unreadCount} />
                    </div>
                  </div>
                  {previewTime && (
                    <span className="shrink-0 text-[10px] text-muted">
                      {formatContactTime(previewTime)}
                    </span>
                  )}
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span
                    className={`border px-1.5 py-0.5 text-[10px] uppercase ${
                      conv.status === "selected"
                        ? "border-primary text-primary"
                        : conv.status === "withdrawn"
                          ? "border-muted text-muted"
                          : "border-accent text-accent"
                    }`}
                  >
                    {APPLICATION_STATUS_LABELS[conv.status as keyof typeof APPLICATION_STATUS_LABELS] ??
                      conv.status}
                  </span>
                  {conv.messageCount > 0 && (
                    <span className="text-[10px] text-muted">{conv.messageCount} pesan</span>
                  )}
                </div>

                {preview ? (
                  <p className="mt-2 line-clamp-2 text-xs text-muted">
                    {!conv.lastMessage && conv.pitchMessage ? `Pitch: ${preview}` : preview}
                  </p>
                ) : (
                  <p className="mt-2 text-xs italic text-muted">Belum ada pesan</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ConversationHeader({
  conversation,
  showDeveloperPortfolio,
}: {
  conversation: Conversation;
  showDeveloperPortfolio?: boolean;
}) {
  const name = conversation.contact.name ?? conversation.contact.email;

  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-muted px-4 py-3">
      <ContactAvatar contact={conversation.contact} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold uppercase text-text-main">{name}</p>
        <p className="truncate text-xs text-muted">{conversation.contact.email}</p>
      </div>
      {showDeveloperPortfolio && conversation.contact.id === conversation.developer.id && (
        <DeveloperPortfolioLink developerId={conversation.developer.id} />
      )}
    </div>
  );
}
