# uSpecMe Prompt Pack + Quality Control

## 1) Objective
Create **3 comparison-ready landing page designs** for uSpecMe with the same information architecture and content intent, but clearly different visual execution:
- Design A: mockup-near, dark, phone-card dominant
- Design B: bold editorial
- Design C: bold performance-dashboard

Output must be practical, responsive, and conversion-oriented for waitlist interest.

## 2) Audience
- Competitive online gamers (players)
- Team managers / captains looking for verified talent
- Secondary: esports communities, org scouts

## 3) Constraints
- Keep IA identical across all variants:
  - Hero
  - Value
  - Flow
  - Proof
  - Public Profile
  - Waitlist modal
  - Footer
- EN/DE language switch on page (default EN, persisted)
- No pricing and no buy buttons
- Keep waitlist frontend-only (no network submission)
- Use provided assets (avatar/logos/ranks/mockups)
- Mobile-safe at 360px width

## 4) Success Criteria
- Clear premium feel in all 3 variants
- Immediate differentiation between A/B/C at first glance
- Mockup fidelity highest in Design A
- Public Profile section looks production-ready and credible
- Language switch works and persists
- Waitlist flow is smooth and local-only

## 5) Anti-Goals (What not to do)
- No generic template look
- No purple-on-white default SaaS style
- No placeholder lorem copy
- No mixed language artifacts inside one selected language
- No hidden backend submission

## 6) Master Prompt (Reusable)
Act as a senior product designer + frontend engineer.
Build a landing page variant for uSpecMe that follows the provided IA and constraints exactly.

Required output format:
1. Visual direction summary (3-5 bullets)
2. Component map (Hero, Value, Flow, Proof, Public Profile, Waitlist, Footer)
3. Final HTML + CSS + JS implementation notes
4. Self-critique with 5 concrete weaknesses
5. Revision pass that fixes the weaknesses

Hard constraints:
- Default language EN, switchable to DE, persisted.
- Keep waitlist submit local-only (no network requests).
- Keep Public Profile fields:
  - Title: Public Profile
  - Role: Flex DPS
  - Avatar: shinobi 1
  - Game naming: Overwatch (not Overwatch 2)
- No pricing section or purchase CTA.

## 7) Variant Prompt A (Mockup-Near)
Goal: Maximize visual similarity to provided Shinobi mockups.

Prioritize:
- Phone-like profile card
- Dark premium gradients
- Dense but readable profile information
- Strong proof/trust cues (rank, logos, setup)

Do not:
- Flatten into generic cards
- Over-simplify the Public Profile block

## 8) Variant Prompt B (Bold Editorial)
Goal: Keep same content but deliver an editorial, high-contrast design language.

Prioritize:
- Typographic hierarchy as primary design element
- More whitespace and strong section rhythm
- Brand-forward headlines and crisp callouts

Do not:
- Lose scannability
- Remove trust and proof content depth

## 9) Variant Prompt C (Bold Performance-Dashboard)
Goal: Make the product feel analytical and performance-driven.

Prioritize:
- Data modules, status chips, metric emphasis
- Operational UI vibe with clean grid logic
- Rapid scanning for team decision-makers

Do not:
- Drift into clutter
- Sacrifice mobile readability

## 10) QC Framework (Assumptions, Risks, Stress Test)

### Assumptions (declare upfront)
- Asset paths are valid and stable
- Language toggle applies to all visible copy
- Waitlist remains frontend-only in this phase

### Edge Cases to test
- LocalStorage unavailable
- Missing image asset
- Form submitted then language switched
- Mobile width 360px
- Long DE strings wrapping in narrow cards

### Trade-off Questions (must answer)
- Fidelity vs readability in profile density
- Visual novelty vs conversion clarity
- Motion polish vs performance simplicity

### Self-Critique Checklist
- Is this design immediately distinguishable from the other two?
- Does Hero communicate co-op teamfinding + proof in 3 seconds?
- Does Public Profile feel believable, not decorative?
- Is the waitlist action obvious without feeling pushy?
- Is DE localization visually robust?

### Stress Test
- Remove colors: does hierarchy still hold?
- Remove images: does copy still sell the product?
- Read on mobile only: still premium + clear?

## 11) Comparison Scorecard Template
Use a 1-10 score for each:
- Clarity
- Premium Feel
- Mockup Fidelity
- Conversion Readiness
- Mobile UX

Then provide:
- Winner
- Why winner won
- What winner still gets wrong
- Which variant is best fallback if goals shift
