/**
 * Type declaration for importing GLSL shader files as raw strings.
 * Supported by Vite's ?raw query suffix.
 */
declare module "*.vert?raw" {
  const src: string
  export default src
}

declare module "*.frag?raw" {
  const src: string
  export default src
}
