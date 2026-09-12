# PRODUCT.md — what we are actually building

This file is the source of truth for every product decision in this repo.
When this file and any code, copy, or roadmap disagree, this file wins.
The original vision document from the founder is summarized in §1; do not
reinterpret it. If a new idea is not answered by this file, answer the product
question first, update this file, then build.

## 1. The idea, canonically

People choose an adorable little companion, personalize how it looks and what
kind of companion it becomes, and then that same companion actually lives with
them on their computer — the way Beam lives on a screen: hanging around,
reacting, keeping company, entertaining, and (only if the owner wants) helping
or reminding them of things.

The website is where people discover, choose, customize, buy and manage their
companion: outfits, accessories, gadgets, abilities, useful behaviours. The
real value is the persistent presence afterwards — personal enough that people
get attached. It must feel like having your own lovable digital pet or friend:
not a game, not a chatbot, not random digital collectibles. The business grows
because people want to make their companion more personal, more capable and
more expressive over time.

Two layers of "who they are", never confuse them:
- **Personality is discovered, not chosen.** Hidden tendencies (curiosity,
  courage, energy, clinginess, mischief...) shape what the companion chooses to
  do. The owner never sees or edits numbers. Two owners of the same species get
  different individuals.
- **The kind of companion is shaped, not rolled.** Through what you give and
  teach — looks, gadgets that add behaviours, skills, optional useful
  behaviours (greeter, break buddy, focus buddy, bedtime) — the owner shapes
  what kind of companion theirs is. This is the customization business and it
  is fully in the owner's hands.

Lessons borrowed from Beam (purpose, never looks): the companion is present on
every page of the website, not just the home page; interaction is physical and
tiny (say hi, pat, drag on desktop, double-click to leap — not command menus);
learned routines are shown off; the character stays on-model everywhere because
the creatures themselves carry the brand.

## 2. The ten product questions, answered

**What exactly is the companion?**
A small autonomous presence with a continuous life and a memory. Not a game
entity (no needs bars, no fail states), not an assistant (no chat, no tasks),
not a skin (it exists between visits). A character with habits, moods,
favourites, and a personality the owner discovers over time.

**What can the owner control?**
Name. Which home it lives in (website, pinned browser window, later desktop).
What it owns and wears. What it has been taught, including optional useful
behaviours (greet you, take breaks with you, settle while you work, put itself
to bed) — all switchable, all skippable. Whether roaming creatures are on. The
owner never controls personality, mood, schedule, favourites, or secrets.

**What does the companion do by itself?**
Wanders, naps, watches the cursor, climbs, hides, plays with what it owns,
reacts to you arriving and leaving, develops favourite spots and behaviours,
and occasionally does rare things while you are away that you come back to
find out about.

**How does the owner interact?**
Presence first: say hi, pat, give things, teach things, visit their profile,
notice what they did. There is no command menu and no conversation window.
Most of their personality comes through what they do, like a real cat.

**What makes someone emotionally attach?**
The adoption ceremony (a parcel, a name, "Kevin moved in"). Ambient moments
noticed while doing something else. Discovery (a personality label landing, a
secret found, a favourite spot). History accruing (day 437 means something).
Belongings that make them more themselves. The feeling that nobody else has
this one.

**What makes it worth paying for?**
The companion itself (one-time adoption). Belongings bought out of attachment
("Kevin needs that raincoat"), where outfits change how they look, gadgets add
real behaviours to their day, and skills are tricks you taught them. Seasonal
drops. Everything permanent, transparently priced, owned like a game backpack.

**What part is website, what part lives on the computer?**
The website is home base: where you meet them, adopt, manage, see history, and
shop — and where they live today. A pinned browser window puts them in the
corner of your screen now, including on locked-down work machines. The desktop
app is the flagship dream: the same individual roaming your OS. The individual
travels — seed, belongings, skills, history — between all three.

**What do outfits, gadgets, and skills really mean?**
One system with three shelves: identity you express (outfits), possibilities
you add to their life (gadgets), things you taught them (skills). They are not
three businesses and not animation packs. An item exists only if it answers:
what changes in their day, or what does the owner feel when they see it?

**What makes a non-technical person want one and use it in two minutes?**
Land on a site that is visibly alive. Meet four characters. Adopt one for
$5.99. A parcel shakes, something climbs out, you name it. It is now living on
your page. Done — no install, no account maze, no tutorial.

**What makes this more than "cute thing walking across my screen"?**
Continuity. A free desktop pet resets every launch; yours remembers 437 days,
knows tricks you taught it, wears what you bought it, has secrets only you
have found, and is measurably not anybody else's. The value accrues with time
lived together.

## 3. Who this is for

Primary: people who spend long hours alone at a computer — students, remote
workers, people who live alone — who want company without obligation.
Secondary: gift-givers (the parcel ceremony is the gift). Tertiary: collectors
and character-universe fans. Explicitly not: wellness seekers, productivity
buyers, people wanting an AI conversationalist. Legal positioning is 13+; the
emotional centre is anyone who would keep a small stupid creature on their desk.

## 4. Keep / delete / repurpose map for this repo

KEEP (true vision mechanics, proven working):
- 3D figurine and stage system — the look the founder loves. Never flatten it.
- SiteWorld roaming layer — the site itself is alive.
- Adoption and gift parcel ceremonies.
- Hidden personality seed + discovery (personality.ts) — the founder's core
  mechanic. It is a reason yours is yours; it is not the whole product and must
  never be the only pitch.
- Behaviour engine and ambient life (moods, spontaneous actions, away events).
- Nest/ownership/inventory (demo localStorage + Supabase-shaped schema).
- Behaviour-changing gadgets and teachable skills; profile history; bonds.

REPOSITION (keep code, change framing and order):
- Shop: one "Their stuff" hub in the nav; closet/gadgets/skills/drops are
  shelves one level down, not five top-level businesses.
- Homepage order: want → understand → imagine yours → get effortlessly →
  then merchandise. Never lead with the store.
- Desktop/browser: the dream stated with pride; the browser corner is today's
  "around your computer"; never "you do not need a desktop app."

PARK (built, not marketed, no nav presence until the product earns them):
- Public profiles, personality-reveal share cards, "what did he just do?"
  capture, admin attic, Rive readiness, bonds depth ("partners in crime").
  These are year-two surfaces. They must not shape year-one copy.

DELETE ON SIGHT:
- Any copy that reads like a developer notebook (prototype, shipped, demo
  mode, now-path, test build, keys, entitlements).
- Any guilt, streak, need, or death mechanic. Any loot box or fake currency.
- Any command-menu or chatbot interaction presented as core.

## 5. Rules for every future change

1. Sell the relationship first; merchandise fifth.
2. No item, feature, or page ships without answering §2 for its slice.
3. No visible numbers, no commands, no chat, no guilt, no streaks.
4. One individual everywhere; history never resets; ownership never expires.
5. Copy: the creature is the subject; short, warm, human sentences; a teenager
   understands it, an adult still wants it. In user-facing words these are
   **digital pets** — say "pet", "companion", or their name; the word "species"
   never appears in anything a human reads (code identifiers only). No
   exclamation marks, no kindergarten tone, no hype: the register is a calm
   North-American consumer product.
6. Presentation register, researched: characters are introduced the way Disney
   introduces characters — name, face, one personality-trait bio. Items are
   presented the way Roblox presents catalog items — type tag (Look / Gadget /
   Skill / Limited), name, one line for what it does or unlocks, price, and a
   render that proves it. Roblox even sells behaviours as items; our skills and
   gadget behaviours follow that logic. Clarity first, charm second.
6. The desktop is the dream. Say so plainly. Never apologize for it.
7. New machinery requires a product answer in this file first. Scaffolding
   without a product answer gets parked, not shipped.
