# Services business

A website whose content Brisk edits: the pages, posts and settings in `content/`, written as Brisk writes them, and the Astro site that shows them.

```sh
npm ci           # its packages, as package-lock.json has them
npm run dev      # the site, with the content as it is here
npm run check    # content/ read as Brisk will read it
npm run fmt      # its JSON files written as Brisk writes them
npm run build    # BRISK_SITE_URL=https://… for its own address
```

- `brisk.definition.ts` names the site’s definition (`definition.ts`): what the content may hold, its components and their fields, its pages and posts. The definition’s seed is the content a new site starts with; `content/` is the content the site has.
- `content/` holds it: `site.json`, `authors.json`, a JSON file per page and collection, and a Markdown file per post. Brisk commits its own changes here; edit them here too, then `npm run check`.
- Add an image with `npx --no-install brisk media add <image> --alt "<description>"`.
- `brisk.json` says what the pages may load from other sites, and which inline scripts may run: Brisk makes each page’s Content-Security-Policy from it. After `npm run build`, `npm run check` lists what the policy would stop.
- It needs the Node `engines` in `package.json` names, or later.
- Commit `package-lock.json`: the check workflow installs from it.
- A build also writes `dist/_brisk/definition.json`, which only Brisk reads.
