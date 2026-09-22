import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Gamepad2, Search, MessageCircle, Users, Mail, LogOut, ArrowRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import brandMark from "@/assets/club-board-mark.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Club Board | Chat and Play" },
      { name: "description", content: "Find friends, continue conversations, and start a multiplayer game from one clear dashboard." },
      { property: "og:title", content: "Club Board | Chat and Play" },
      { property: "og:description", content: "Find friends, continue conversations, and start a multiplayer game from one clear dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClubBoard,
});

const conversations = [
  { initials: "MR", name: "Mira Rowe", message: "Rematch at eight? I owe you a Connect Four.", time: "4m", tone: "bg-primary/10 text-primary" },
  { initials: "DK", name: "Devon Kline", message: "Best of three in Rock Paper Scissors. No backing out.", time: "12m", tone: "bg-accent/15 text-accent-foreground" },
  { initials: "SO", name: "Sam Okoro", message: "Memory board is half cleared. Come finish it.", time: "1h", tone: "bg-secondary/10 text-secondary" },
];

const games = [
  { code: "TT", name: "Tic-Tac-Toe", detail: "3 online · 14s average" },
  { code: "CF", name: "Connect Four", detail: "5 online · 2m average" },
  { code: "RS", name: "Rock Paper Scissors", detail: "7 online · 8s average" },
  { code: "MM", name: "Memory Game", detail: "2 online · 3m average" },
];

const people = ["Lena Wu", "Theo Bhatt", "Nora Chen"];

function ClubBoard() {
  const [query, setQuery] = useState("");
  const [invites, setInvites] = useState([
    { id: 1, initials: "JT", name: "June Tan", game: "Tic-Tac-Toe", tone: "bg-primary/10 text-primary" },
    { id: 2, initials: "PA", name: "Priya Anand", game: "Connect Four", tone: "bg-accent/15 text-accent-foreground" },
  ]);
  const [notice, setNotice] = useState("Welcome back. You have 2 game invitations.");
  const matches = useMemo(() => people.filter((name) => name.toLowerCase().includes(query.toLowerCase())), [query]);

  const respond = (id: number, action: "accepted" | "declined") => {
    const invite = invites.find((item) => item.id === id);
    if (!invite) return;
    setInvites((current) => current.filter((item) => item.id !== id));
    setNotice(action === "accepted" ? `${invite.game} with ${invite.name} is ready.` : `${invite.name}'s invitation was declined.`);
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-border bg-background px-3 py-5 lg:flex">
          <div className="mb-2 flex items-center gap-2 border-b border-border px-2 pb-4">
            <img src={brandMark} alt="" width={32} height={32} className="size-8 object-contain" />
            <span className="font-serif text-[15px] font-bold text-secondary">Club Board</span>
          </div>
          <NavItem icon={MessageCircle} label="Chat" active />
          <NavItem icon={Gamepad2} label="Games" />
          <NavItem icon={Users} label="Members" />
          <NavItem icon={Mail} label="Invites" count={invites.length} />
          <div className="mt-auto flex items-center gap-2 border-t border-border px-2 pt-4">
            <Avatar initials="AM" tone="bg-accent/15 text-accent-foreground" size="sm" />
            <div className="min-w-0 flex-1 leading-tight"><div className="truncate text-xs font-medium text-secondary">Alex Morgan</div><div className="text-[10px] text-muted-foreground">Online</div></div>
            <Button variant="ghost" size="icon" aria-label="Log out" title="Log out" className="size-8 text-muted-foreground"><LogOut /></Button>
          </div>
        </aside>

        <div className="mx-auto min-w-0 max-w-6xl flex-1 px-4 py-5 sm:px-8 sm:py-6">
          <header className="flex items-center justify-between gap-4 border-b border-border pb-4">
            <div className="flex min-w-0 items-center gap-3">
              <img src={brandMark} alt="Club Board" width={36} height={36} className="size-9 object-contain lg:hidden" />
              <div><h1 className="font-serif text-xl font-bold leading-tight text-secondary sm:text-2xl">Good evening, Alex</h1><p className="mt-1 hidden text-[13px] text-muted-foreground sm:block">Everything waiting for you, in one place.</p></div>
            </div>
            <Button size="sm" onClick={() => document.getElementById("people-search")?.focus()}><Users />Invite a friend</Button>
          </header>

          <div role="status" className="mt-4 flex items-center justify-between gap-3 border-l-2 border-accent bg-accent/10 px-3 py-2 text-xs text-secondary">
            <span>{notice}</span><button className="shrink-0 font-medium text-primary" onClick={() => setNotice("")}>{notice ? "Dismiss" : ""}</button>
          </div>

          <section aria-label="How Club Board works" className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["01", "Find someone", "Search by name to open a conversation or send an invite."],
              ["02", "Choose a game", "Pick a quick game from their profile or the games list."],
              ["03", "Play together", "Your board opens as soon as they accept the invitation."],
            ].map(([step, title, text], index) => (
              <div key={step} className="board-enter rounded-md border border-border bg-card p-4 shadow-sm" style={{ animationDelay: `${index * 70}ms` }}>
                <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">Step {step}</div>
                <h2 className="mt-1.5 font-serif text-[15px] font-bold text-secondary">{title}</h2>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </section>

          <div className="mt-6 grid min-w-0 gap-7 lg:grid-cols-3">
            <div className="min-w-0 space-y-7 lg:col-span-2">
              <Section title="Recent conversations" action="All chats">
                <div className="divide-y divide-border">
                  {conversations.map((chat) => <button key={chat.name} className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Avatar initials={chat.initials} tone={chat.tone} /><div className="min-w-0 flex-1"><div className="text-[13px] font-medium text-secondary">{chat.name}</div><div className="truncate text-xs text-muted-foreground">“{chat.message}”</div></div><span className="shrink-0 text-[11px] text-muted-foreground">{chat.time}</span><ArrowRight className="size-3.5 text-muted-foreground" /></button>)}
                </div>
              </Section>
              <Section title="Available games" action="Browse all">
                <div className="grid gap-3 sm:grid-cols-2">
                  {games.map((game) => <div key={game.code} className="flex items-center gap-3 rounded-md border border-border bg-card p-3 shadow-sm"><div className="grid size-9 shrink-0 place-items-center rounded bg-secondary/5 text-[13px] font-semibold text-secondary">{game.code}</div><div className="min-w-0 flex-1"><div className="text-[13px] font-medium text-secondary">{game.name}</div><div className="text-[11px] text-muted-foreground">{game.detail}</div></div><Button size="sm" onClick={() => setNotice(`Choose a friend to play ${game.name}.`)}>Play</Button></div>)}
                </div>
              </Section>
            </div>

            <aside className="min-w-0 space-y-7">
              <Section title="Open invites" badge={`${invites.length} pending`}>
                {invites.length ? <div className="space-y-2.5">{invites.map((invite) => <div key={invite.id} className="rounded-md border border-border bg-card p-3 shadow-sm"><div className="flex items-center gap-2"><Avatar initials={invite.initials} tone={invite.tone} size="sm" /><div className="text-xs font-medium text-secondary">{invite.name}</div></div><p className="mt-2 text-xs text-muted-foreground">Challenged you to {invite.game}.</p><div className="mt-2.5 flex gap-2"><Button size="sm" className="flex-1" onClick={() => respond(invite.id, "accepted")}>Accept</Button><Button size="sm" variant="outline" className="flex-1" onClick={() => respond(invite.id, "declined")}>Decline</Button></div></div>)}</div> : <div className="rounded-md border border-dashed border-border p-4 text-center text-xs text-muted-foreground">You’re all caught up.</div>}
              </Section>

              <Section title="Find people" action="Directory">
                <div className="relative mb-2"><Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" /><Input id="people-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search members" className="h-8 pl-8 text-xs" /></div>
                <div className="space-y-1">{matches.map((name) => <div key={name} className="flex items-center gap-2.5 py-1.5"><Avatar initials={name.split(" ").map((part) => part[0]).join("")} tone="bg-secondary/10 text-secondary" size="sm" /><div className="min-w-0 flex-1 text-xs font-medium text-secondary">{name}</div><Button variant="link" size="sm" className="h-7 px-1" onClick={() => setNotice(`Game choices opened for ${name}.`)}>Invite</Button></div>)}{matches.length === 0 && <p className="py-3 text-center text-xs text-muted-foreground">No member found.</p>}</div>
              </Section>

              <div className="rounded-md bg-secondary p-4 text-secondary-foreground shadow-sm"><div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-secondary-foreground/60"><Trophy className="size-3.5 text-accent" />This week</div><div className="mt-1.5 font-serif text-[15px] font-bold">Mira leads the board</div><p className="mt-1 text-xs leading-relaxed text-secondary-foreground/70">4 wins across Connect Four and Tic-Tac-Toe. Can you catch her?</p></div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

function NavItem({ icon: Icon, label, active = false, count }: { icon: typeof MessageCircle; label: string; active?: boolean; count?: number }) {
  return <button className={`flex items-center gap-2 rounded px-2 py-2 text-[13px] font-medium transition-colors ${active ? "bg-secondary text-secondary-foreground" : "text-secondary/70 hover:bg-secondary/5"}`}><Icon className="size-4" /><span>{label}</span>{count !== undefined && <span className="ml-auto text-[11px]">{count}</span>}</button>;
}

function Avatar({ initials, tone, size = "md" }: { initials: string; tone: string; size?: "sm" | "md" }) {
  return <div className={`grid shrink-0 place-items-center rounded-full font-semibold ${tone} ${size === "sm" ? "size-7 text-[10px]" : "size-8 text-[11px]"}`}>{initials}</div>;
}

function Section({ title, action, badge, children }: { title: string; action?: string; badge?: string; children: ReactNode }) {
  return <section className="min-w-0 overflow-hidden"><div className="mb-3 flex items-baseline justify-between border-b border-border pb-2"><h2 className="font-serif text-[16px] font-bold text-secondary">{title}</h2>{action && <Button variant="link" size="sm" className="h-auto p-0 text-xs">{action}</Button>}{badge && <span className="text-[11px] font-medium text-accent-foreground">{badge}</span>}</div>{children}</section>;
}