import baseCss from "./base.css?inline"

let sharedBaseSheet: CSSStyleSheet | null = null

export function getSharedBaseSheet(): CSSStyleSheet {
  if (!sharedBaseSheet) {
    sharedBaseSheet = new CSSStyleSheet()
    sharedBaseSheet.replaceSync(baseCss)
  }
  return sharedBaseSheet
}
