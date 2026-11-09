# Xianfu Chen — Research website

A responsive personal research website, ready for GitHub Pages. No build step or external dependencies. Includes a biography, research updates, a searchable publication archive, funded projects, education, academic service, and selected recognition.

## Add your research

Edit `content.js` to keep your biography, research updates, publications, projects, and profile links current. The website is already personalized; sample entries have been removed.

Updates support `date` (YYYY, YYYY-MM, or YYYY-MM-DD), `type` (Paper, Project, or Talk), `title`, `summary`, `body`, and optional `links`. Links use `{ label: 'Paper', url: 'https://...' }`. Use only the date precision supported by the source. Publications support `year` for the year filters.

## Content sources

Professional background, education, service, recognition, projects, invited talk, and older publication entries are based on the supplied CV, last updated December 13, 2025. Personal date of birth, citizenship, mobile number, and street address are not included in the website.

Four 2026 publication entries were verified against IEEE-deposited Crossref DOI records on October 7, 2026:

- https://doi.org/10.1109/TWC.2026.3674232
- https://doi.org/10.1109/TWC.2026.3659601
- https://doi.org/10.1109/TMC.2025.3601833
- https://doi.org/10.1109/TCCN.2025.3554003

The April 3, 2026 update is based on the Shanghai Advanced Research Institute's announcement: https://sari.cas.cn/news/kjdt/202604/t20260403_8181236.html

The Google Scholar profile is linked directly. Google blocked automated access during preparation; the website does not claim to contain the complete Scholar bibliography or live citation statistics. This is a curated website, with updates edited in `content.js`.

## Publish on GitHub Pages

1. Put the files in the root of your GitHub repository on the `master` branch. Include `.nojekyll`.
2. In repository Settings → Pages, choose **Deploy from a branch** as the source. Select `master` and `/ (root)`, then save.
3. GitHub Pages publishes the site automatically after changes to `master`.

The publishing status and URL appear in Settings → Pages. Relative asset paths support both a profile website and a repository website. GitHub Pages availability depends on your repository visibility and account plan.

## Preview locally

Serve this directory with any static HTTP server. You can also open `index.html` directly in a browser.

## Features

- Responsive layout for phones, tablets, and desktops
- Update categories and text search
- Full update reading dialog
- Publication and project sections
- Publication year filters and pagination (six records per page)
- Navy and blue visual theme with 18px base text, 20–22px paper titles, and responsive layouts
- Four recent updates on the home page, with a control to reveal the complete update list
- Keyboard navigation, visible focus states, reduced-motion support
- All content in one editable file

