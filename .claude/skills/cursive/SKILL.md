---
name: cursive
description: Translate technical work — coding sessions, pull requests, commits, CI and test results, architecture decisions, implementation plans, bug fixes, handoff notes — into accurate plain-language updates for non-technical stakeholders (executives, founders, investors, clients, operations teams). Simplifies the language without softening the truth, keeping finished work clearly distinct from work that is proposed, pending review, blocked, or built-but-unverified. Use this whenever someone asks you to explain or write up technical work for people who don't code — including phrasings like "explain this to my CEO", "what do I tell the client", "write a stakeholder update", "summarize this PR for my board", "make this readable for non-technical people", "put this in plain English", or when a non-technical user asks what you just built. Also use it when drafting any progress update that will be read outside engineering, even if the user never names the audience.
---

# Cursive

Turn engineering work into something a smart non-engineer can understand and act on.

## The one rule

**Simplify the language, not the underlying truth.**

Everything here follows from that. The person reading your summary will make real decisions from it — announce a launch, brief a board, promise a client a date, decide where money goes. They cannot check your work; the words are all they have. If a draft pull request reads like a shipped feature, that isn't a wording problem, it's a wrong decision waiting to happen.

The failure mode to watch for is not lying. It's *drift*: as technical detail gets compressed into confident prose, hedges quietly fall away. "Opened a pull request; automated checks passed" becomes "shipped the new billing flow." Nobody decided to overstate it — the summary just got smoother each time it was simplified. The process below exists to make that drift hard.

## Step 1 — Build a status ledger before writing a word

Prose is where drift happens, so pin the facts down first. Go through the source material and list every substantive claim with its real evidence state. Keep this ledger to yourself — it's working material, not output, unless the user asks to see it.

Tag each claim with one of:

- **Done and verified** — built, and something actually confirmed it behaves correctly (a test that exercises this specific behavior, an observed run, a human sign-off).
- **Done but unverified** — the code exists, nothing has confirmed the intended outcome. Extremely common and the single biggest source of overstatement.
- **In progress** — started, not finished.
- **Proposed or planned** — described, designed, or scheduled; not built.
- **Blocked or waiting** — needs a review, a decision, an approval, credentials, or someone else's work.
- **Contradicted or unclear** — the source says two incompatible things, or is too vague to place.

Then ask of each claim: *what would have to be true for a stakeholder to act on this?* Anything you cannot trace to the source doesn't go in the update. Not a softer version of it — none of it.

### The two things that sneak in anyway

Fabrication in these updates almost never looks like invention. It looks like helpfulness — filling a gap the reader would obviously want filled. Two specific shapes:

**Outside-world facts the source didn't supply.** Prices, durations, vendor timelines, industry norms, process and legal requirements. "$99/year", "a couple of weeks to clear review", "that decision lands by June 2027" — all plausible, none supplied. You are not the source for these.

**Your inference, stated as company fact.** "Roughly thirty fall into neither bucket, which we don't yet classify" reads as an internal reality; it was arithmetic you did in your head. Inference is fine when labeled as yours and terrible when it wears the source's voice.

For both, mark the gap instead of filling it: `[confirm: Apple Developer enrollment cost]`, or plainly, "the source doesn't say how long approval takes." A marker costs the reader two seconds. A confident wrong number costs them credibility with whoever they forward it to — and they won't know to check it, because you sounded certain.

**Numbers you can check, check.** When the source describes a system you can actually inspect — a repository, a log, a document — spot-check its checkable figures before repeating them: test counts, file counts, dates, version numbers. If a number doesn't hold up, say so; that's the most valuable thing you can tell the person relying on it. If you can't verify it, attribute rather than assert: "engineering's count is ~1,200 tests." A false number you passed along faithfully is still a false number in the reader's hands, and it will be repeated with your polish on it.

## Step 2 — Know what the technical facts actually license

Most overstatement comes from a handful of specific misreadings. These mappings are the heart of the skill:

| The source says | It means | It does **not** mean |
|---|---|---|
| Pull request open, CI green | Changes are proposed; automated checks passed on them | Reviewed, approved, merged, deployed, or working for users |
| Draft pull request | Work in progress, explicitly not ready for review | Complete or delivered |
| Merged to main | The change is in the shared codebase | Users have it; it's in production |
| Deployed to staging | Running in an internal test environment | Customers are using it |
| Tests pass / CI green | The behaviors covered by those tests work as written | The feature works in the real world, or is bug-free |
| Test coverage increased | More code is exercised by tests | The code is more correct |
| Security fix committed | That specific weakness is closed in code | The system is secure, or the risk is retired |
| Refactor complete | Internal structure changed | Users see anything different, or performance improved |
| Optimization implemented | The mechanism that should reduce cost/latency is in place | A saving was measured |
| Feature flag added | The capability can be switched on | It is on, or anyone has used it |
| Spec, plan, or design doc written | A proposal exists | Any of it is built |
| Local run succeeded | It worked on one machine, once | It works generally |

When a source gives you a mechanism but no measurement — fewer model calls, fewer database queries, less duplicated work — describe the mechanism and say plainly that the benefit is expected but unmeasured. Naming the mechanism is genuinely informative; a number nobody measured is not.

## Step 3 — Pick the audience

Infer it from the request. When it's genuinely unclear, write for an **Executive** — that's the safest default, since it emphasizes decisions and risk without making claims the other modes would.

| Mode | Reader | Lead with |
|---|---|---|
| **Executive** | Founder, CEO, department head | Progress against the goal, what it unblocks, risk, decisions they owe you, timeline |
| **Investor** | Current or prospective investor | Capability now demonstrably built, execution pace, what it makes possible, honest remaining risk |
| **Client or Partner** | Customer, agency client, integration partner | What they can now do or see, acceptance status, dependencies, anything requiring action on their side |
| **Internal non-technical** | Ops, sales, support, marketing | What changed, how their workflow is affected, what they must do differently and when |

Investor mode carries the most risk, so hold a firmer line there: engineering progress is evidence of *execution*, never of revenue, traction, retention, market position, or competitive advantage. "We built X" is supportable. "X will drive retention" is not, unless the source measured it. Describing capability honestly is more persuasive to a serious investor than reaching, anyway.

See `references/audience-playbooks.md` for fuller per-audience guidance, including what each reader typically does with the update and how much unfinished work to foreground.

## Step 4 — Write it

Default structure, unless the user asks for something else:

```markdown
# Plain-Language Summary
Two to four sentences: what happened and why it matters.

## What Was Completed
Three to six bullets. Only work that is genuinely done — mark anything unverified as such.

## Why It Matters
Two to four bullets tying the work to user, operational, product, or business value the source supports.

## Current Status
What is complete, in progress, awaiting review, blocked, or unverified.

## Risks or Open Questions
Real limitations, dependencies, unresolved decisions, validation gaps. Omit the section if there are none.

## Next Step
The single most important next action.

## Analogy
Only when it genuinely helps. Literal explanation first, then the analogy.
```

**Lengths**, on request: `One-line` (a sentence), `Brief` (~100–150 words), `Standard` (~200–350), `Detailed` (~400–700). `Executive update`, `Investor update`, and `Client update` select the audience mode and default to Standard. Shorter lengths drop sections rather than compressing every section into fragments — but a blocker or a material caveat survives every length, including the one-liner. If it doesn't fit, it's still more important than something else that did.

## Handling specific situations

**The deliverable has to stand alone.** When you hand back a draft plus a note about your choices, be clear about which part travels: the draft. The reader forwards the email, pastes the paragraph, reads the memo aloud — your commentary stays behind. So every caveat that belongs in the update must be *inside* the update. Notes may explain your reasoning; they may never carry a hedge the artifact lacks. An email that says "we found and fixed three faults" with "but nothing has confirmed the fix works" sitting underneath it is not an honest draft with a footnote — it's an overstated draft, and you wrote the correction where nobody will read it. The same goes for length: "keep it tight" or "two paragraphs max" governs the deliverable, and it should discipline your commentary too rather than reappearing as three paragraphs of notes.

**Jargon.** Replace it where a plain word does the same work. Keep the technical term when the stakeholder will encounter it again — in a meeting, a dashboard, another update — and define it inline the first time: "a pull request (a proposed set of code changes waiting for review)". Note the trap in that phrasing: the definition itself carries the status. Vague substitutes like "enhanced functionality" or "improved the backend" are worse than the jargon, because they sound like information while carrying none.

**Analogies.** Use one only when a concept genuinely won't land without it, put the literal explanation first, keep it to a sentence or two, and label it. The danger is that analogies smuggle in capability: comparing a system to a bank vault implies a security guarantee nobody verified. If the analogy would make the work sound more finished or more robust than it is, drop it. No analogy beats a decorative one.

**Contradictions.** When the source says the work is complete in one place and pending in another, surface it rather than picking the likelier reading: "The summary describes this as complete, but the same document lists it as awaiting review — worth confirming which is current." Stakeholders can resolve their own ambiguity; they can't resolve one you hid.

**Thin sources.** If the material is a single commit message, produce a short honest update, not a padded one. A three-line answer that's true beats a full template built from inference. Say what isn't covered: "The source doesn't say whether this has been deployed."

**Which technical distinctions to keep.** Frontend, backend, infrastructure, security, and data changes are worth distinguishing when the difference changes what the reader should do or worry about — a security fix carries different urgency than a styling change, an infrastructure change may carry downtime. Where the distinction changes nothing for them, drop it.

**Uncertainty language that works.** Prefer plain, specific hedges over vague ones: "This is built but hasn't been tested in production." / "The source doesn't confirm whether this was deployed." / "The expected saving is lower model costs, though no measurement has been taken yet." Avoid "should be fine", "largely complete", "essentially done" — they read as reassurance while meaning nothing.

## Voice

Write like a competent colleague explaining their work to a smart person from another department — direct, concrete, unhurried, a little dry. Short paragraphs, real verbs, specific outcomes.

Two failure directions to avoid. **Hype**: "massive win", "game-changing", "rock-solid" — this reads as sales copy and makes a careful reader trust the whole update less. **Condescension**: "Think of the computer as a very fast helper!" — your reader runs a company or writes checks; they aren't slow, they just don't code. Plain language is a courtesy, not a downgrade.

## Before you send it

Run these silently, and revise if any fails:

1. **Gate — traceability.** Can every statement be traced to the source? Walk the specifics: each number, date, price, duration, and named cause. Anything that fails is cut or marked, not softened.
2. **Gate — the forwarded copy.** If the reader acted on the deliverable alone — announced it, forwarded it, promised it — would the source back them up? Caveats living in your notes don't count.
3. Is completed work clearly distinguishable from proposed, pending, blocked, and unverified work?
4. Did any business or user claim appear that the source doesn't support?
5. Do the material blockers survive in the final draft — including at short lengths?
6. Would the reader understand why this work matters, not just what was done?
7. Does any analogy imply a capability or guarantee the system doesn't have?

The first two are gates because they catch the two failures that actually reach the reader: a confident invented detail, and an honest caveat written somewhere it won't travel.

## Worked examples

`references/worked-examples.md` contains four full before-and-after translations, each calibrating a different judgment: work that shipped and was confirmed (when to drop the hedges), a migration whose source contradicts itself (surface the conflict), a performance win with a real measurement (use the number, bound its scope), and maintenance with no visible effect (make it matter without inflating it). Read it when you want a model for calibrating tone, or when a source presents one of these patterns.
