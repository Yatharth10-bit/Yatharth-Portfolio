# Profile maintenance

This directory is an overlay for the public repository `yatharth10-bit/yatharth10-bit`. Preserve its Git history when installing it.

1. Open the username repository in GitHub. If it does not yet exist, click **+ → New repository**, select the owner **yatharth10-bit**, enter **yatharth10-bit** as its name, choose **Public**, select **Add a README**, and create it.
2. Clone the repository in a clean directory. In the default branch, run `git pull --ff-only`, create a fresh backup tag (for example `git tag profile-legacy-v1`), and push that tag with `git push origin profile-legacy-v1`. If that tag already exists, choose a new unused name. Create a feature branch with `git switch -c feature/signal-profile`.
3. Copy the contents of this profile directory over the checkout, including `.github`. Leave the checkout’s `.git` and unrelated files in place. Run `node --test tests/*.test.mjs` (on Windows use `node --test tests/profile.test.mjs`), inspect `git diff`, commit, push the feature branch and open a pull request.
4. Confirm the **check** job passes. In GitHub, preview the README on the branch under both **Settings → Appearance** themes. Merge the PR. Open the profile repository’s **Actions → Refresh profile → Run workflow**, select the default branch, then run. Refresh the profile when the job turns green. The schedule uses 04:27 UTC. Check write permissions and branch rules if the job can read but cannot push.
5. Open the account profile, select **Edit profile**, and enter the confirmed bio “Student developer and designer building interactive tools for space, desktop, and the web.” Set location to **India** and website to **https://yatharth10-bit.github.io/Yatharth-Portfolio/**. Save.
6. Use **Customize your pins** on the account profile to choose up to six verified repositories. Review final recon for candidates before pinning.

Edit the introductory paragraph and project accordions directly in `README.md`. The generator only replaces the marked activity block. Banners and link buttons live in `assets`. Regenerate banners with `node scripts/brand.mjs` after changing its typography or colors.

## Activity definitions

The daily job uses the built-in token on the runner. It requests only owned public repositories through the public user-repositories endpoint. Forks and the profile repository are excluded. The language mix ranks GitHub Linguist bytes across the remaining repositories. It includes archived repos. Recent projects are the most recently pushed non-archived, nonempty repositories.

The calendar covers the trailing 365 UTC dates. It counts unique commit SHAs in the default-branch history returned for the owner's GitHub author login, using the committer timestamp. Other branches, issue/PR activity and private contributions are outside the displayed scope. An active streak may end today or yesterday and is capped by the displayed 365-day window. Since the generator never reads private contributions its numbers can differ from the account-wide GitHub graph.

All API results must succeed before the two assets and recent-project block are written. Failed API requests, rate limits or conflicting pushes leave the last committed snapshot visible. Run the workflow again after resolving the failure. The initial cards explicitly show that data is pending. No service token, browser JavaScript or external card host is necessary.

