export const css = `
/* basic theme */
.light-mode {
  --theme-background-1: #fff;
  --theme-background-2: #fafaf9;
  --theme-background-3: rgb(245 245 245);

  --theme-color-1: #21201c;
  --theme-color-2: #63635d;
  --theme-color-3: #8e8e8e;

  --theme-color-accent: #5a45ff;
  --theme-background-accent: #5a45ff1f;

  --theme-border-color: color(display-p3 0.913 0.912 0.903);
  --theme-code-language-color-supersede: var(--theme-color-1);
  --theme-code-languages-background-supersede: var(--theme-background-3);
}
.dark-mode {
  --theme-background-1: #0f0f0f;
  --theme-background-2: #222222;
  --theme-background-3: #272727;

  --theme-color-1: #e2e4e8;
  --theme-color-2: rgba(255, 255, 255, 0.62);
  --theme-color-3: #6a737d;

  --theme-color-accent: #e2ddfe;
  --theme-background-accent: #3c2d6a;

  --theme-border-color: rgba(255, 255, 255, 0.1);
  --theme-code-language-color-supersede: var(--theme-color-1);
  --theme-code-languages-background-supersede: var(--theme-background-3);
}

/* Document Sidebar */
.light-mode .t-doc__sidebar,
.dark-mode .t-doc__sidebar {
  --sidebar-background-1: var(--theme-background-1);
  --sidebar-color-1: var(--theme-color-1);
  --sidebar-color-2: var(--theme-color-2);
  --sidebar-border-color: var(--theme-border-color);

  --sidebar-item-hover-background: var(--theme-background-2);
  --sidebar-item-hover-color: currentColor;

  --sidebar-item-active-background: var(--theme-background-accent);
  --sidebar-color-active: var(--theme-color-accent);

  --sidebar-search-background: var(--theme-background-2);
  --sidebar-search-color: var(--theme-color-3);
  --sidebar-search-border-color: var(--theme-border-color);
}

/* advanced */
.light-mode {
  --theme-color-green: #0e766e;
  --theme-color-red: #e53935;
  --theme-color-yellow: #e2931d;
  --theme-color-blue: #0f766e;
  --theme-color-orange: #f76d47;
  --theme-color-purple: #4338ca;
}
.dark-mode {
  --theme-color-green: #0ad8b6;
  --theme-color-red: #e5484d;
  --theme-color-yellow: #eac063;
  --theme-color-blue: #6abaff;
  --theme-color-orange: #ff9b52;
  --theme-color-purple: #6550b9;
}
/* custom-theme */
.show-api-client-button:before {
  background: white !important;
}
.show-api-client-button span,
.show-api-client-button svg {
  color: var(--theme-background-1) !important;
}
.section:not(:last-of-type),
.section-container {
  border-top: none !important;
  border-bottom: none !important;
}
.section-container:after,
.tag-section-container section.section:after {
  content: "";
  width: 100%;
  height: 1px;
  position: absolute;
  top: 0;
  left: 0;
  background: repeating-linear-gradient(
    90deg,
    var(--theme-border-color) 0 4px,
    transparent 0 8px
  );
}
.section-container:nth-of-type(2):after {
  display: none;
}
.tag-section-container .section:first-of-type:after {
  display: none;
}
.sidebar {
  border-right: none !important;
}
.t-doc__sidebar {
  position: relative;
}
.t-doc__sidebar:after {
  content: "";
  width: 1px;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  background: repeating-linear-gradient(
    0deg,
    var(--theme-border-color) 0 4px,
    transparent 0 8px
  );
  display: block;
}
.download-cta .download-button,
.scalar-api-reference .section .markdown a {
  --theme-color-accent: var(--theme-color-1) !important;
  text-decoration: underline !important;
  cursor: pointer;
}`
