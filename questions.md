# Handling Client Questions: "Where is the database?"

## The Main Answer

> "Instead of a traditional database like MySQL, your products are stored as **simple data files** (JSON or Markdown) inside your website's code repository on **GitHub** — think of it like a secure, version-controlled Google Drive folder.
>
> When you log into the **Admin Panel**, you'll see a form where you can add, edit, or delete products — just like filling out an online form. Behind the scenes, when you click **Save**, it automatically updates the corresponding data file on GitHub, and the website rebuilds itself automatically.
>
> So **GitHub IS your database** — but with a simple, professional form on top of it so you never have to look at code."

---

## Common Follow-Up Questions

| Client Question | Your Answer |
|---|---|
| **What if we lose the data?** | It's safely stored on GitHub. It has an automatic version history, meaning we can recover ANY past version of your content, even if someone accidentally deletes everything. It's actually **safer** than a traditional database. |
| **Can multiple people edit at the same time?** | Yes. Each editor gets their own login. The CMS handles this through Git, which is the exact same system used by professional software teams worldwide to collaborate safely. |
| **What if the site hosting goes down, is the data gone?** | No. The data lives on GitHub, completely separate from the website hosting (Netlify). Even if the website hosting goes down temporarily, your data is 100% safe. |
| **Can we export our data if we switch platforms?** | Absolutely. Your data is plain files (JSON/Markdown). You own it completely. There's no vendor lock-in. You can easily take it anywhere, unlike systems like Shopify or WordPress where your data is trapped in their proprietary database. |
| **Why not just use a real database?** | For a site like yours, a database adds unnecessary monthly server costs (₱500-₱2,000/mo), requires ongoing maintenance, and introduces security risks (like SQL injection). Simple data files are faster, cheaper, and inherently more secure. |
| **Is this professional? Big companies use databases...** | This modern approach is called **Jamstack**. It's used by massive companies like Nike, Google, and Spotify for their marketing sites. Databases are meant for apps with thousands of users simultaneously writing data (like Facebook or Banks), not for product catalogs. |
| **How many products can we store?** | Practically unlimited for your use case. Even with 10,000 products with images, you wouldn't come close to hitting any storage limits. |

---

## The Killer Comparison

*If they are still skeptical, show them this direct comparison to highlight the benefits:*

| Feature | Traditional Database | Your Custom Setup (Git-based CMS) |
|---|---|---|
| **Monthly cost** | ₱500–2,000/mo for server hosting | **₱0** (Free tiers handle this effortlessly) |
| **Backups** | Manual configuration required | **Automatic** — every exact edit is permanently saved |
| **Security risk** | Vulnerable to database hacks | **Unhackable** — there is no database server to attack |
| **Speed** | Slower (queries must run on every page load) | **Lightning Fast** — pre-built pages ready to load |
| **Recovery** | Hope your latest backup actually works | **Git history** — undo any mistake instantly |
| **Maintenance** | Requires software patching and tuning | **Zero ongoing server maintenance** needed |
