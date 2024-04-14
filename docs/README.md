# Docs boilerplate

The boilerplate repo we use across AdonisJS projects to create a documentation website. The boilerplate allows for maximum customization without getting verbose.

## Why not use something like VitePress?
I have never been a big fan of a frontend first tooling when rendering markdown files to static HTML. I still remember the Gridsome and Gatsby days, when it was considered normal to use GraphQL to build a static website 😇.

With that said, the [feature set around rendering markdown](https://vitepress.dev/guide/markdown) feels modern and refreshing with frontend tooling. But, the underlying libraries are not limited to the frontend ecosystem, and you can use them within any JavaScript project.

So, if I have all the tools at my disposal, why not build and use something simple that does not change with the new wave of innovation in the frontend ecosystem?

## Workflow
The docs boilerplate is built around the following workflow requirements.

- Create a highly customizable markdown rendering pipeline. I need control over rendering every markdown element and tweaking its HTML output per my requirements. This is powered by [@dimerapp/markdown](https://github.com/dimerapp/markdown) and [@dimerapp/edge](https://github.com/dimerapp/edge) packages.

- Use [Shiki](https://github.com/shikijs/shiki) for styling codeblocks. Shiki uses VSCode themes and grammar for syntax highlighting and requires zero frontend code.

- Use a [base HTML and CSS theme](https://github.com/dimerapp/docs-theme) to avoid re-building documentation websites from scratch every time. But still allow customizations to add personality to each website.

- Use a dumb JSON file to render the docs sidebar (JSON database file). Scanning files & folders and sorting them by some convention makes refactoring a lot harder.

- Allow linking to markdown files and auto-resolve their URLs when rendering to HTML.

- Allow keeping images and videos next to markdown content and auto-resolve their URLs when rendering to HTML.

## Folder structure

```
.
├── assets
│  ├── app.css
│  └── app.js
├── bin
│  ├── build.ts
│  └── serve.ts
├── content
│  ├── docs
│  └── config.json
├── src
│  ├── bootstrap.ts
│  └── collections.ts
├── templates
│  ├── elements
│  ├── layouts
│  ├── partials
│  └── docs.edge
├── vscode_grammars
│  ├── dotenv.tmLanguage.json
│  └── main.ts
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.js
```

### The assets directory

The `assets` directory has the CSS and frontend JavaScript entry point files. Mainly, we import additional packages and the [base theme](https://github.com/dimerapp/docs-theme) inside these files. However, feel free to tweak these files to create a more personalized website.

### The bin directory

The `bin` directory has two script files to start the development server and export the docs to static HTML files. These scripts boot the AdonisJS framework under the hood.

### The content directory
The `content` directory contains the markdown and database JSON files. We organize markdown files into collections, each with its database file.

You can think of collections as different documentation areas on the website. For example: You can create a **collection for docs**, a **collection for API** reference, and a **collection for config reference**.

See also: [Creating new collections](#creating-new-collections)

### The src directory
The `src` directory has a `bootstrap` file to wire everything together. We do not hide the bootstrap process inside some packages. This is because we want the final projects to have complete control over configuring, pulling in extra packages, or removing unused features.

The `collections.ts` file is used to define one or more collections.

### The templates directory
The `templates` directory contains the Edge templates used for rendering HTML.

- The `docs` template renders a conventional documentation layout with the header, sidebar, content, and table of contents. You may use the same template across multiple collections.
- The logos are kept as SVG inside the `partials/logo.edge` and `partials/logo_mobile.edge` files.
- The base HTML fragment is part of the `layouts/main.edge` file. Feel free to add custom meta tags or scripts/fonts inside this file.

### The vscode_grammars directory
The `vscode_grammars` directory contains a collection of custom VSCode languages you want to use inside your project.

See also: [Using custom VSCode grammars](#using-custom-vscode-grammars)

## Usage
Clone the repo from Github. We recommend using [degit](https://www.npmjs.com/package/degit), which downloads the repo without git history.

```sh
npx degit dimerapp/docs-boilerplate <my-website>
```

Install dependencies

```sh
cd <my-website>
npm i
```

Run the development server.

```sh
npm run dev
```

And visit [http://localhost:3333/docs/introduction](http://localhost:3333/docs/introduction) URL to view the website in the browser.

## Adding content
By default, we create a `docs` collection with an `introduction.md` file inside it. 

As a first step, you should open the `content/docs/db.json` file and add all the entries for your documentation. Defining entries by hand may feel tedious at first, but it will allow easier customization in the future.

A typical database entry has the following properties.

```json
{
  "permalink": "introduction",
  "title": "Introduction",
  "contentPath": "./introduction.md",
  "category": "Guides"
}
```

- `permalink`: The unique URL for the doc. The collection prefix will be applied to the permalink automatically. See the `src/collection.ts` file for the collection prefix.
- `title`: The title to display in the sidebar.
- `contentPath`: A relative path to the markdown file.
- `category`: The grouping category for the doc.

Once you have defined all the entries, create markdown files and write some real content.

## Changing website config

We use a very minimal configuration file to update certain website sections. The config is stored inside the `content/config.json` file.

```json
{
  "links": {
    "home": {
      "title": "Your project name",
      "href": "/"
    },
    "github": {
      "title": "Your project on Github",
      "href": "https://github.com/dimerapp"
    }
  },
  "fileEditBaseUrl": "https://github.com/dimerapp/docs-boilerplate/blob/develop",
  "copyright": "Your project legal name"
}
```

- `links`: The object has two fixed links. The homepage and the Github project URL.

- `fileEditBaseUrl`: The base URL for the file on Github. This is used inside the content footer to display the **Edit on Github** link.

- `copyright`: The name of display in the Copyright footer.

- `menu`: Optionally, you can define a header menu as an array of objects.
  ```json
  {
    "menu": [
      {
        "href": "/docs/introduction",
        "title": "Docs",
      },
      {
        "href": "https://blog.project.com",
        "title": "Blog",
      },
      {
        "href": "https://github.com/project/releases",
        "title": "Releases",
      }
    ]
  }
  ```

- `search`: Optionally, you can define config for the Algolia search.
  ```json
  {
    "search": {
      "appId": "",
      "indexName": "",
      "apiKey": ""
    }
  }
  ```

## Creating new collections
You may create multiple collections by defining them inside the `src/collections.ts` file. 

A collection is defined using the `Collection` class. The class accepts the URL to the database file. Also, call `collection.boot` once you have configured the collection.

```ts
// Docs
const docs = new Collection()
  .db(new URL('../content/docs/db.json', import.meta.url))
  .useRenderer(renderer)
  .urlPrefix('/docs')

await docs.boot()

// API reference
const apiReference = new Collection()
  .db(new URL('../content/api_reference/db.json', import.meta.url))
  .useRenderer(renderer)
  .urlPrefix('/api')

await apiReference.boot()

export const collections = [docs, apiReference]
```

## Using custom VSCode grammar
You may add custom VSCode languages support by defining them inside the `vscode_grammars/main.ts` file. Each entry must adhere to the `ILanguageRegistration` interface from [Shiki](https://github.com/shikijs/shiki/blob/main/docs/languages.md).

## Changing the markdown code blocks theme

The code blocks theme is defined using the Markdown renderer instance created inside the `src/bootstrap.ts` file. You can either use one of the [pre-defined themes or a custom theme](https://github.com/dimerapp/shiki/tree/next#using-different-themes).

```ts
export const renderer = new Renderer(view, pipeline)
  .codeBlocksTheme('material-theme-palenight')
```

## Customizing CSS

The [base docs theme](https://github.com/dimerapp/docs-theme) makes extensive use of CSS variables, therefore you can tweak most of the styling by defining a new set of variables.

If you want to change colors, we recommend looking at [Radix Colors](https://www.radix-ui.com/docs/colors/getting-started/installation), because this is what we have used for the default styling.

## Customizing HTML

The HTML output is not 100% customizable since we are not creating a generic docs generator for the rest of the world. The boilerplate is meant to be used under constraints.

However, you can still control the layout, because all sections of the page are exported as Edge component and you can place them anywhere in the DOM. Do check the `templates/docs.edge` file to see how everything is used.

### Header slots

You may pass the following component slots to the website header.

- `logo (required)`: Content for the logo to display on Desktop viewport.

- `logoMobile (required)`: Content for the logo to display on Mobile viewport.

- `popupMenu (optional)`: Define custom markup for the popup menu trigger. The 
trigger is displayed in mobile view only.
  ```edge
  @component('docs::header', contentConfig)
    @slots('popMenu')
      <span> Open popup menu </span>
    @end
  @end
  ```

- `themeSwitcher (optional)`: Define custom markup for the theme switcher button.
  ```edge
  @component('docs::header', contentConfig)
    @slots('themeSwitcher')
      <span x-if="store.darkMode.enabled"> Dark </span>
      <span x-if="!store.darkMode.enabled"> Light </span>
    @end
  @end
  ```

- `github (optional)`: Define custom markup for the github link in the header.
  ```edge
  @component('docs::header', contentConfig)
    @slots('github')
      <span> Github (11K+ Stars) </span>
    @end
  @end
  ```

## Deployment
The docs boilerplate allows you to create a static build and deploy it on any CDN including Netlify, Cloudflare pages and so on.

You can create the static build using the `npm run export` command. The command runs the following actions.

- Create a production build for assets using Vite.
- Convert collections to HTML pages.
- Copy everything to the `dist` directory.

Once the build is created, you can deploy the `dist` directory as it has everything to serve the website.

### Environment variables

When creating the build, you must set the `APP_URL` environment variable to generate correct links for the `og:url` and `twitter:url` meta tags. The env variable should point to the production URL of your website.  
