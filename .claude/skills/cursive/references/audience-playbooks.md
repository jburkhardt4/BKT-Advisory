# Audience playbooks

Deeper guidance per audience mode. Read the one that matches; skip the rest.

The useful question for every mode is: **what does this person do with the update?** That determines what leads, what gets cut, and how much unfinished work belongs up top.

---

## Executive

**Who:** Founder, CEO, COO, department head. Usually the person paying for the work.

**What they do with it:** Decide where effort goes next, judge whether the timeline holds, answer someone else's question about progress, decide whether to tell anyone outside.

**Lead with:** Progress against the goal they care about — not the work itself. "The iOS app now has an approved specification and a signed license boundary" matters more to them than which files were written.

**Always include:** anything that needs a decision from them, and anything that will slip if it doesn't get one. Executives forgive bad news; they don't forgive finding out late.

**Cut:** file names, branch names, commit hashes, library choices, test counts — unless a number is the point (e.g. "3 of 9 documents still need your sign-off").

**Calibration:** if the update contains no decision, no risk, and no change to the plan, say so explicitly and keep it to a few lines. A short "on track, nothing needed from you" is a good update, not a lazy one.

---

## Investor

**Who:** Current investor, prospective investor, board member with a financial lens.

**What they do with it:** Judge execution speed and whether the team builds real things. Possibly repeat your claims to other people.

**Lead with:** capability that demonstrably exists now, and what it makes possible that wasn't possible before.

**The hard line:** engineering progress is evidence of *execution*, and nothing else. It is not evidence of revenue, customer demand, retention, market position, defensibility, or valuation. Those require data the source almost never contains.

Supportable: "The routing system now decides automatically which action to take, which removes a manual step from every session."
Not supportable from code alone: "This will increase user retention." / "This creates a durable moat." / "This unlocks the enterprise segment."

If the source *does* contain measured business data, use it and say where it came from. If it doesn't, describe capability and let the reader draw conclusions. Sophisticated investors discount inflated claims heavily and remember who made them; an honest update with a named risk reads as competence.

**Include remaining risk.** An investor update with no risk section is a signal in itself — and rarely a good one.

**Cut:** implementation detail entirely, unless the technical approach is itself the differentiator being described.

---

## Client or Partner

**Who:** A customer, an agency client, an integration partner. Someone outside your company with a contractual or delivery relationship.

**What they do with it:** Check whether what they're waiting for has arrived, decide whether to accept it, find out what they owe you.

**Lead with:** what they can now do, see, or test — framed from their side of the boundary.

**Be exact about acceptance status.** "Ready for your review" and "delivered" and "live for your users" are three different things and clients act differently on each. This is the mode where overstatement causes the most damage, because a client may commit to their own customers based on your wording.

**Always surface client-side dependencies prominently:** approvals, credentials, content, test data, sign-off windows. If you're waiting on them, that belongs near the top, stated without blame.

**Cut:** internal process detail, team structure, tooling choices — anything that isn't about what they receive or what they must do.

---

## Internal non-technical team

**Who:** Operations, sales, support, marketing, finance — colleagues who use the systems but don't build them.

**What they do with it:** Change how they work. Answer customer questions. Update their own docs and scripts.

**Lead with:** what is different now, in terms of the thing they touch — the screen, the report, the workflow, the customer-facing behavior.

**Be concrete about timing.** "Starting Monday" or "once it's approved, which hasn't happened yet" is the difference between a team that adapts smoothly and one that's confused on Monday.

**Include what to do when it goes wrong:** who to tell, what to capture. This audience is often the first to notice a problem in the real world.

**Cut:** rationale for the technical approach, architecture, and anything they cannot see or act on. Keep the reason *why* only when it helps them explain the change to someone else.
