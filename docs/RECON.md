# GitHub verification on 19 November 2026

The authenticated GitHub connection confirmed the public account inventory after the initial offline audit. The deployment branch is `main`, at `2dadd7861f4ec5a6881982ba223d4b717f662049` when inspected. Created the remote backup branch `legacy-v1` at that SHA before opening `feature/signal-studio`. The local tag matches the remote backup branch.

| Public repository | Primary language | Stars | Topics | Updated (UTC) |
| --- | --- | ---: | --- | --- |
| Satellite-tracker | TypeScript | 2 | None | 2026-08-29 |
| orbytmax-app | TypeScript | 2 | None | 2026-10-08 |
| claimguard | TypeScript | 1 | compliance, nextjs, revenuecat, saas, supabase, typescript | 2026-08-29 |
| Yatharth-Portfolio | CSS | 1 | None | 2026-08-29 |
| second-brain | HTML | 0 | None | 2026-11-05 |

The account search returned five public repositories. OrbytMax has a mission library and interactive orbit education. Satellite-tracker includes an earlier standalone ORBITAL globe under `legacy/legacy` alongside a newer app. ClaimGuard has a documented review workflow and a declared [product deployment](https://claimguard-silk.vercel.app). The portfolio contains After You. Second Brain is an offline-capable encrypted notes app, updated in November, with no root README at audit time. The sensitive data behind its unlock screen was not needed or inspected. All five have substantial content. There is no supported archive recommendation.

Ultron is a local Windows prototype with private source. Its case study includes help output and a description of its interface. The account-named profile repository returned HTTP 404. Its public creation is pending. There are five public project repos eligible for pinning at this point.

The raw live Pages URL remained unreachable through this workstation. GitHub's remote main SHA matched the copy used for baseline Lighthouse. The account-wide dates above are GitHub metadata and do not imply release dates.


## Initial local audit (historical)

# Portfolio reconnaissance

**Audit date** 19 November 2026  
**Owner** Yatharth Srivastav · [@Yatharth10-bit](https://github.com/Yatharth10-bit)  
**Deployment target** [GitHub Pages](https://yatharth10-bit.github.io/Yatharth-Portfolio/)

## What the available sources establish

The local portfolio checkout uses the origin `https://github.com/Yatharth10-bit/Yatharth-Portfolio.git`. Its last recorded `main` and `origin/main` point to `2dadd78` (13 June 2026). Its working directory also contains newer pages and assets outside that commit. The build draws from both versions. The local refs establish a backup baseline. Only a fresh remote fetch can establish the current production SHA.

The live Pages URL, GitHub profile, repository list, profile-repo endpoint and raw source endpoint were requested. The shell could not resolve GitHub or the Pages host, the browsing service could not open the requested URLs, and `gh auth status` reported an invalid login. As a result, the account-wide ranking, repository visibility, GitHub topics/stars, exact remote update times, profile-repo existence and live baseline scores remain unverified. The following shortlist ranks work by the quality of its local evidence and usefulness to visitors. Dates labeled “local” are Git dates.

## Identity and contact inventory

| Item | Source material |
| --- | --- |
| Name and work | Yatharth Srivastav, student developer and product designer based in India. Sources include `2dadd78:index.html` and the working homepage. |
| Interests | Product design, frontend development, interactive 3D, prototyping, UI engineering. The working bio cites learning by building, badminton, lifting, gaming and anime. |
| Tools | Working homepage lists Next.js, React, TypeScript, Python, Three.js and Figma. The committed marquee also names Node.js, Tailwind, product design, UI engineering, prototyping and AI tools. |
| Contact | [Email](mailto:yatharthlegend252@gmail.com) · [GitHub](https://github.com/Yatharth10-bit) · [Instagram](https://www.instagram.com/yatharthsrivastav_/) · [YouTube](https://www.youtube.com/@yatharthsrivastav10) |
| Form | The committed `script.js` sends to `https://formsubmit.co/ajax/yatharthlegend252@gmail.com`. Delivery requires inbox activation on first use. The newer working homepage uses direct email and copy. |
| Portrait | `Images/2.jpg` is the genuine portrait used across editions. |
| Location and résumé | India is published. The site supplies no city, résumé link, downloadable résumé, employer history, client list, awards or certification evidence. The 2025 “11th class” wording is historical. |

## Featured work

| Project | What the source supports | Source and destination |
| --- | --- | --- |
| OrbytMax | A satellite map, approximate city-based pass lookup, mission libraries, parts guide and orbit quiz. Next.js 16, React, TypeScript, satellite.js, Three.js, Prisma and PostgreSQL. Auth.js supports account features. | Working `orbytmax.html`; actual [repository](https://github.com/Yatharth10-bit/orbytmax-app) README and manifest, local `421a660`, 1 Aug 2026. App layout declares `https://orbytmax.com` as a configurable canonical fallback. Current deployment needs checking. |
| Ultron | Local Windows voice and gesture assistant. Python 3.11+, Vosk, MediaPipe, OpenCV and optional Piper speech. Configured rules map inputs to apps, folders or shortcuts. It supports keyboard and dry-run modes. | Working `ultron.html`; actual [repository](https://github.com/Yatharth10-bit/ultron-local-assistant) origin, README and scripts, local `fb169d4`, 30 Aug 2026. Local installation is the product experience. |
| ClaimGuard | A claim-review workspace for food, supplement and wellness brands. It flags wording, suggests revisions and tracks regulatory updates. The repo describes deterministic claim-risk analysis. Next.js 15, React 19, TypeScript, Tailwind, Supabase/PostgreSQL. | `2dadd78:claimguard.html`, working case study and actual [repository](https://github.com/Yatharth10-bit/claimguard) README/manifest, local `fdaea8e`, 14 Jun 2026. No independently confirmed hosted product URL. |
| ORBITAL | A Three.js globe with category filters, selectable satellites, orbit paths and follow mode. The case study attributes the visualization to Yatharth. Omit its historical “20,000+” count from current metrics. | `2dadd78:orbital.html` and working page, both linking [Satellite-tracker](https://github.com/Yatharth10-bit/Satellite-tracker). OrbytMax also contains an ORBITAL implementation under `legacy/legacy`. Verify that separate repo's current entry point before publishing setup commands. |
| After You | A browser typewriter experiment with a movable carriage and a form that adds notes to a local page. The “live” text is scripted. The implementation provides no shared guestbook or cross-visitor storage. HTML, CSS and JavaScript. | Working `afteryou.html`, `afteryou.css`, `afteryou.js` in the [portfolio repository](https://github.com/Yatharth10-bit/Yatharth-Portfolio). No separate project repo is evidenced. |

Authorship language follows the portfolio's own project descriptions. These sources do not establish sole ownership of all implementation, team size, client work, active users, paid usage or business impact.

## Archive and assets

The last committed homepage featured ClaimGuard and ORBITAL. The later local edition added OrbytMax, Ultron and After You, project filters, a motion-controlled hero, copy email, an India clock and project case-study pages. Separate `roadmap.html` and `project-detail.html?project=…` pages describe a CSE learning plan and twelve project ideas. Planned builds are not accomplishments.

The January 2025 homepage at `049d802:index.html` also contains these historical entries. Source or ownership verification is necessary before featuring any of them as current work.

| Archived work | Evidence in the earlier site |
| --- | --- |
| Floppy Fish | Java buoyancy-based game, `floppy-fish.png`. Empty source link. |
| Circles | Swift/Firebase photo-sharing prompts, `circles-1.png`. Empty source link. |
| Chibi Luffy | Anime meme bot, labeled Swift and GitHub REST API, `chibi-luffy.png`. Empty source link. |
| Functional Adventure | Haskell text exploration game, `haskell-text-game.png`. Empty source link. |
| 12 Week Year | Figma mobile self-improvement prototype, `twelve-week-year.png`. [Original prototype link](https://www.figma.com/proto/0NshRiNCSJNlJZLa89gKUD/12-week-year?node-id=0-1&t=EalDOeHDylY6Xsxm-1) |
| Job Search App | Figma iOS job-search concept for new graduates, `job-seaerch-design.png`. [Original prototype link](https://www.figma.com/proto/MGnRMH4dFjqNTwpmuQWg4M/Job-search-app?node-id=0-1&t=bE8P9chhwnzQaEsk-1) |
| Lunisolar | Figma Lunar New Year recipe-page concept, `lunisolar.png`. [Original prototype link](https://www.figma.com/proto/PXPzcGU2lJOCgJ9mMg5aj3/Lunisolar?node-id=0-1&t=XIDb52YKwp26KGnu-1) |

Other assets in the working portfolio's `Images/` directory are `circles.png`, `claimguard-og.png`, `orbital-og.png`, `monogram.svg`, `orbit-form.svg`, `font.ttf` and `yatharth-character-hq.png`. The source README identifies the current project art as editorial artwork. None of those covers establishes an application screenshot. Scratch PDFs are project-idea documents. The historical LinkedIn icon has an empty link.

## Journey evidence

- **4 January 2025** — initial portfolio history, commits `456786a` and `ba1340d`.
- **12 June 2026** — portfolio redesign with ClaimGuard and ORBITAL case studies, commit `33ebd33`. Pages cache-busting and `.nojekyll` followed in `83ac753`.
- **1 August 2026** — OrbytMax checkout at `421a660` documents satellite discovery, pass lookup and orbit learning.
- **30 August 2026** — Ultron checkout at `fb169d4` records gesture-recognition tuning.

The committed portfolio describes ORBITAL as a 2024–2025 project and ClaimGuard as starting in 2025. The dates above are dated artifacts, not product launch dates.

## Design decision

The committed homepage hides work beneath a loader, repeats skills in a marquee, and names two projects. The working variant expands the catalog but repeats project content in multiple pages, depends on external font services, and mixes several decorative motifs. Neither index supplies a canonical URL, Twitter preview or Person schema. These observations come from source inspection; field performance and delivery of the old contact form remain unmeasured.

**Signal Studio** gives the portfolio a single visual signature. A copper signal sculpture sits against a dark drawing surface. Its visual connection to orbital paths, gesture recognition and creative coding comes directly from the projects. Large editorial type, a switchable light palette and accessible controls keep the navigation legible. Selected work gets clear case studies and evidence links.

The build uses a dependency-free Node static generator with shared JSON content, tokenized CSS and native browser interactions. It can publish under the existing Pages repository path, render useful content before JavaScript runs, and keep tokens out of delivered files.

## GitHub inventory still requiring live access

After signing in, run from a networked terminal:

```sh
gh repo list yatharth10-bit --limit 100 --visibility public --json name,url,description,updatedAt,pushedAt,stargazerCount,primaryLanguage,languages,repositoryTopics,isFork,isArchived,diskUsage
gh repo view yatharth10-bit/yatharth10-bit --json nameWithOwner,visibility,defaultBranchRef
```

Use the five source-backed repository candidates above, including the portfolio repo once for After You. Confirm visibility and names first. Choose a sixth only from actual public work with meaningful source or a demo. No archive recommendation can be justified from unreachable metadata. Empty links in a 2025 portfolio page are not evidence of empty GitHub repos. No other repositories were changed or archived.

**TODO:** verify remote SHA and live production content, the full public inventory, profile-repo existence, direct project deployments, public screenshot permissions and any team/role details beyond the case studies. Add an approved résumé PDF or city only if the owner wants them shown.

