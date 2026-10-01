# Worked examples

Four translations, chosen to calibrate different muscles. None of them is a template to copy — the point is the reasoning, especially the judgment call each one turns on.

Read the "turns on" line for each if you're short on time.

1. [Shipped and confirmed](#1-shipped-and-confirmed) — *turns on:* when the evidence is strong, say so plainly. Hedging everything is its own inaccuracy.
2. [A migration that contradicts itself](#2-a-migration-that-contradicts-itself) — *turns on:* surface the conflict; don't quietly pick a side.
3. [A measured performance win](#3-a-measured-performance-win) — *turns on:* use the real number, and be exact about what it measured.
4. [Maintenance nobody can see](#4-maintenance-nobody-can-see) — *turns on:* make unglamorous work matter without inventing benefits.

---

## 1. Shipped and confirmed

**Source:**
> Merged #241 (bulk CSV export) to main, deployed to prod Tuesday 14:20 UTC. Smoke tests green post-deploy. 340 exports run by 41 distinct accounts in first 48h, error rate 0.2% (2 failures, both malformed uploads — handled, user sees a message now). Feature flag removed, so it's on for everyone.

**Ledger:** built ✓ / deployed to production ✓ (timestamped) / verified in the real world ✓ (real usage, measured error rate) / on for all users ✓ (flag removed). Every claim here is load-bearing and evidenced.

**Translation (Executive, Brief):**

> # Plain-Language Summary
> Customers can now export their data in bulk, and the feature has been live since Tuesday. In its first two days, 41 accounts ran 340 exports with a 0.2% failure rate — both failures were malformed files, and users now see a clear error message instead of a silent failure.
>
> ## What Was Completed
> - Bulk export built, released to production Tuesday, and switched on for all customers.
> - Confirmed working under real usage: 340 exports, 41 accounts, two handled failures.
> - Bad input files now produce a readable error rather than failing silently.
>
> ## Why It Matters
> - Customers who needed their data in bulk no longer have to request it manually.
> - Real usage in the first 48 hours suggests genuine demand rather than a feature nobody asked for.
>
> ## Current Status
> Complete and live for all customers.
>
> ## Next Step
> Watch the error rate over a full week before treating 0.2% as the steady-state number.

**Why it reads this way:** this work earned confident language, so it gets it. A skill that hedges everything trains its reader to ignore the hedges — then the hedge that matters gets ignored too. Note the one restraint kept: 48 hours of data is called out as 48 hours of data, not as the permanent error rate.

---

## 2. A migration that contradicts itself

**Source:**
> Postgres migration is done — all 14 tables moved, cutover script written. Remaining: tables 12–14 still dual-writing to the old store until we verify row counts match. Rollback plan drafted but untested. Handoff note says "migration complete, safe to decommission legacy DB."

**Ledger:** 11 tables migrated ✓ / tables 12–14 still writing to both systems — *not* finished / row counts unverified / rollback plan exists but untested / **contradiction:** the note says complete and safe to decommission, while the same source says three tables are mid-verification.

**Translation (Executive, Brief):**

> # Plain-Language Summary
> The database move is most of the way done — 11 of 14 tables are fully transferred. The last three are still writing to both the old and new systems while their record counts are being checked. One caution: the handoff note describes the migration as finished and the old database as safe to shut down, which doesn't match the three tables still under verification. Worth confirming which is current before anyone decommissions anything.
>
> ## Current Status
> In progress. 11 of 14 tables migrated; 3 in a dual-write verification stage. A rollback plan exists but has not been tested.
>
> ## Risks or Open Questions
> - The source contradicts itself on whether the migration is complete. Treat "safe to decommission" as unconfirmed until the three tables are verified.
> - The rollback plan is untested, so the recovery path if something goes wrong is unproven.
>
> ## Next Step
> Confirm the record counts on the three remaining tables, and resolve the contradiction in the handoff note before any decision about the old database.

**Why it reads this way:** the tempting move is to average the two readings into "mostly complete" and move on. That destroys the most valuable thing in the source — the fact that two people (or one person at two moments) disagree about whether it's safe to delete a database. Surfacing the conflict costs three sentences and may prevent a very expensive mistake. Also note the rollback plan: "drafted but untested" is a *risk*, not an accomplishment, so it's filed under risk.

---

## 3. A measured performance win

**Source:**
> Added an index on events(account_id, created_at). Dashboard query p95 went from 4.2s → 310ms in staging with a copy of prod data. Not yet deployed to prod.

**Ledger:** index built ✓ / improvement measured ✓ — *in staging, on a copy of production data* / deployed to production ✗.

**Translation (Executive, Brief):**

> # Plain-Language Summary
> The main dashboard was slow to load because of how the database searched for records. A change to how that data is organized cut the load time from about 4.2 seconds to roughly 0.3 seconds in testing — a copy of real customer data, running in a test environment. It hasn't been released to customers yet.
>
> ## Why It Matters
> - A four-second dashboard load is the kind of delay users notice and complain about; a third of a second is not.
> - The improvement was measured rather than estimated, so the expected result is well grounded — though the test environment isn't a perfect stand-in for production.
>
> ## Current Status
> Built and measured in testing. Not yet released to customers.
>
> ## Next Step
> Deploy to production and confirm the improvement holds under real traffic.

**Why it reads this way:** there's a real measurement, so use it — a concrete number is exactly the kind of detail that makes an update credible. But the measurement's scope is stated in the same breath (staging, copied data), because "we made the dashboard 13× faster" and "we measured a 13× improvement in a test environment" license different actions. The first invites a customer email; the second invites a deploy.

Contrast with the unmeasured case: had the source said only "added an index, should speed up the dashboard," the honest version names the mechanism and stops — *"the change should reduce load time, though no measurement has been taken yet."* Never manufacture a number for the shape of the sentence.

---

## 4. Maintenance nobody can see

**Source:**
> Bumped 23 dependencies, dropped Node 18 support, moved CI to Node 22. Two CVEs closed (both in transitive deps, neither reachable from our code paths per audit). No functional changes. All 986 tests pass.

**Ledger:** dependencies updated ✓ / two known vulnerabilities closed ✓ — *audit says neither was reachable from this codebase* / no user-visible change (by design) / test suite passes ✓ — which confirms nothing broke, not that anything improved.

**Translation (Internal non-technical, Brief):**

> # Plain-Language Summary
> This was housekeeping: the third-party software the product depends on was updated to current versions, and the build system moved to a newer version of its runtime. Nothing customers see has changed, and the full test suite passes, so nothing appears to have broken.
>
> ## What Was Completed
> - 23 third-party components updated to current versions.
> - Two publicly known security vulnerabilities closed. Both were in components the product includes but, according to the audit, doesn't actually use in a way that exposed them.
> - Build system moved to a newer runtime; support for the older one dropped.
>
> ## Why It Matters
> - Staying current on dependencies is what keeps future security patches routine instead of urgent — falling behind is how a small fix becomes a large project.
> - Removing known vulnerabilities reduces what has to be explained in security reviews and customer questionnaires.
>
> ## Current Status
> Complete. No customer-facing change expected.
>
> ## Risks or Open Questions
> - Dropping the older runtime means anyone still building on it locally will need to update.

**Why it reads this way:** maintenance work tempts two opposite distortions. One is to oversell it — "closed two critical security vulnerabilities" when the audit says neither was reachable. The other is to shrug it off as "just housekeeping," which teaches stakeholders that this work is optional and makes it harder to fund next time. The honest middle names the real benefit (future patches stay routine, security questionnaires get easier) without inflating the threat. And note that 986 passing tests is reported as *nothing broke* — it is not evidence that anything got better.
