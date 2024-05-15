export type ReferenceConfiguration = {
  /** A string to use one of the color presets */
  theme?: ThemeId
  /** The layout to use for the references */
  layout?: ReferenceLayoutType
  /** The Swagger/OpenAPI spec to render */
  spec?: SpecConfiguration
  /** URL to a request proxy for the API client */
  proxy?: string
  /** Whether the spec input should show */
  isEditable?: boolean
  /** Whether to show the sidebar */
  showSidebar?: boolean
  /** Remove the Scalar branding :( */
  /** Key used with CNTRL/CMD to open the search modal (defaults to 'k' e.g. CMD+k) */
  searchHotKey?: string
  /** If used, passed data will be added to the HTML header. Read more: https://unhead.unjs.io/usage/composables/use-seo-meta */
  metaData?: any
  /** Custom CSS to be added to the page */
  customCss?: string
  /** OnSpecUpdate is fired on spec/swagger content change */
  onSpecUpdate?: (spec: string) => void
}

export type SpecConfiguration = {
  /** URL to a Swagger/OpenAPI file */
  url?: string
  /** Swagger/Open API spec */
  content?: string | Record<string, any> | (() => Record<string, any>)
  /** The result of @scalar/swagger-parser */
  preparsedContent?: Record<any, any>
}

export type ReferenceLayoutType = 'modern' | 'classic'

export type ThemeId = 'alternate' | 'default' | 'moon' | 'purple' | 'solarized' | 'none'
