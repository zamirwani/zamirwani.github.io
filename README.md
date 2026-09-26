# Zamir Wani — GitHub Pages website

This is the complete **GitHub Pages** version of the academic profile and **RF & Microwave Lab@KU** research group. It includes the public website, team page, browser-based content editor, and publishing workflow. No Cloudflare account, external hosting, database server, or paid CMS is required by this implementation.

## Publish on your GitHub Pages repository

The configuration assumes:

- GitHub username: `zamirwani`
- Repository: `zamirwani.github.io`
- Branch: `main`

If yours differ, edit `site.config.json`. If the publishing branch differs, also change the branch in `.github/workflows/pages.yml`.

1. Unzip this package.
2. Upload the **contents inside `zamir-wani-pages`** to the root of your GitHub repository. `index.html` must be at the repository root. Do not upload the ZIP as one file or add an extra enclosing folder.
3. Include the hidden **`.github/workflows/pages.yml`** file. It handles publishing. On macOS, press Command+Shift+Period to reveal hidden files before uploading. GitHub Desktop or Git is more reliable than browser upload for hidden folders.
4. In the repository, open **Settings → Pages**.
5. Under **Build and deployment → Source**, select **GitHub Actions**.
6. Open **Actions → Publish GitHub Pages → Run workflow**, select `main`, and run it. Later commits run it automatically.
7. Once the workflow succeeds, GitHub shows the website URL in Settings → Pages. For the default configuration it is `https://zamirwani.github.io/`.

If you already have a site in this repository, download a backup or make a commit before replacing its files. Remove or disable an older competing Pages deployment workflow so only this workflow publishes. Preserve your `CNAME` file if you use a custom domain, and follow the note below.

### Using Git instead of browser upload

For an existing repository, clone it, copy these files into it, review the diff, then commit and push. For an empty repository, run inside this folder:

```sh
git init
git add .
git commit -m "Add academic website and GitHub Pages editor"
git branch -M main
git remote add origin https://github.com/zamirwani/zamirwani.github.io.git
git push -u origin main
```

Replace the repository URL if necessary. Do not force-push over an existing repository.

## How the editable backend works

GitHub Pages is static hosting. **GitHub itself provides authenticated content storage**, and GitHub Actions builds and publishes the website.

- Website content lives in `data/content.json`.
- The editor is available at `/admin/` (or `/repository-name/admin/` for a project site).
- The editor reads and writes that JSON file through GitHub’s authenticated API.
- Saving creates a commit on the configured branch. GitHub Actions then rebuilds the pages and publishes them.
- This means publication is **not instant**: wait for the Pages workflow to finish successfully.
- There is no separate admin password or server-side login. The editor page itself is publicly accessible, but writing requires a valid GitHub token for your repository.

## Set up editing access

You can always edit `data/content.json` directly on GitHub without using the website editor.

For the form-based editor:

1. Sign in to GitHub.
2. Open **Settings → Developer settings → Personal access tokens → Fine-grained tokens**.
3. Generate a token with an expiry date.
4. Select your account as the resource owner and **Only select repositories → `zamirwani.github.io`**.
5. Under **Repository permissions**, grant **Contents: Read and write**. The default Metadata read permission is sufficient for metadata. No workflow-editing permission is needed by the editor, because it changes only `data/content.json`.
6. Copy the token and open the website’s **Admin** link in the footer.
7. Enter your username, repository, branch and token, then click **Connect and load content**.
8. Edit your content and click **Save and publish**.
9. Use **View publishing status** and wait for a successful workflow before checking the public pages.

A token must belong to a user who can write to the repository. Organization approval rules or branch protection can prevent direct commits; if so, use GitHub’s normal pull-request process to edit the JSON file. Use a token limited to this repository, and never put it in `site.config.json`, source code, an issue, or chat.

The editor keeps the token only in the open tab’s memory. It is not stored in cookies, local storage, the JSON content, or a commit. Disconnecting or closing the tab clears it. Tokens can be revoked in GitHub settings. Do not connect on a shared or untrusted computer.

## Content and team details

The editor supports:

- Profile, biography, email and academic links.
- Research areas and funding information.
- Publications, book and education.
- Lab name and group description.
- Faculty, PhD scholars, master’s students, JRFs, project students and alumni.

Each team category has its own Add button. Member fields include name, role or degree, research topic, photo, email and profile URL. PhD, master’s and JRF sections stay visible even before members are added.

To add a photo, upload it to `assets/team/` in your repository, then use a path such as `assets/team/student.jpg` in the editor. HTTPS image URLs also work. Direct photo uploading through the editor is not included.

All data in this website repository and in its published JSON is intended to be public. Do not add private student records, unpublished personal contact details, passwords or other secrets.

## What is in the package

| File/folder | Purpose |
| --- | --- |
| `index.html` | Ready-built homepage |
| `group.html` | Ready-built research group page (beside index.html) |
| `admin/index.html` | Browser editor |
| `assets/admin.mjs` | Editor and authenticated GitHub saving |
| `assets/schema.mjs` | Shared content validation and team categories |
| `assets/style.css` | Website and editor styling |
| `assets/portrait.jpg` | Existing profile photograph |
| `data/content.json` | Editable site content |
| `site.config.json` | Public GitHub repository configuration |
| `scripts/build.mjs` | Generates static pages from the content |
| `scripts/serve.mjs` | Optional local preview server |
| `.github/workflows/pages.yml` | GitHub Pages build and deployment |

The source contains the bundled academic content and lab structure from the current site. It is **not a live database export**: additional content entered in the original ChatGPT Site’s Admin is not automatically shared with GitHub. Copy any such extra details into this editor or JSON before publishing them. The original ChatGPT Site remains unchanged.

The prebuilt HTML makes the initial website available as ordinary static files. Use the included **GitHub Actions publishing source** to ensure later editor changes update the site. Do not select “Deploy from a branch” for the editable setup: that mode would keep serving the prebuilt HTML without running this generator.

## Optional local preview

No packages need to be installed. With Node.js 20 or newer installed, run:

```sh
node scripts/build.mjs
node scripts/serve.mjs
```

Open `http://127.0.0.1:8080/`. Use a local web server; opening the editor as a `file://` URL will not work reliably. The editor, even in local preview, writes to the real repository when you connect and click Save. Merely previewing the public pages makes no changes.

Run checks with:

```sh
npm test
```

## Customization

Edit `assets/style.css` for layout and fonts. Edit the templates in `scripts/build.mjs` for structural changes. Do not rely on hand-edited `index.html` or `group.html`: the next build regenerates them from templates and content.

Relative links support both `username.github.io` sites and `username.github.io/repository-name/` project sites. For a custom domain, preserve your domain settings in GitHub Pages. If you keep a `CNAME` file at the repository root, the build copies it to the published output automatically.

## Recovery and troubleshooting

- **No website / 404:** enable Pages with GitHub Actions, check that `pages.yml` exists, and run the workflow.
- **Old content after saving:** check Actions. A successful content commit is not proof of a successful deployment. Wait for the workflow, then refresh.
- **Cannot connect:** check username, repository, branch, token expiry and the repository selected when creating the token.
- **Cannot save:** check Contents write permission and branch protection rules. Unsaved edits remain in the open tab after a failed save.
- **Conflict:** someone or another tab changed the same content file. Copy the edits you want to keep before disconnecting, then reconnect and apply them to the latest version. The editor does not silently overwrite a newer file.
- **Token exposed:** revoke it on GitHub and create a new one restricted to this repository.
- **Undo a published change:** revert the content commit in GitHub. The workflow republishes the reverted content.

## Validation and scope

The static build, internal links, content escaping, team sections, and editor save/error behavior are checked locally. GitHub saving is tested against a simulated API, not against your account. Uploading, configuring Pages, and testing with your own token are required to complete live setup. This ZIP has not been uploaded to GitHub for you.

Official references:

- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.github.com/en/rest/repos/contents
- https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens

The Group navigation link opens `group.html` at the repository root. The older `group/index.html` path is also kept for compatibility.
