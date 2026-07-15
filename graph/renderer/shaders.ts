/**
 * WebGL 2.0 Shader Programs
 *
 * All shaders are loaded from individual .glsl files under ./shaders/
 * for proper GLSL syntax highlighting and editing.
 */

import nodeVert from "./shaders/node.vert?raw"
import nodeFrag from "./shaders/node.frag?raw"
import nodePickVert from "./shaders/node-pick.vert?raw"
import nodePickFrag from "./shaders/node-pick.frag?raw"
import lineVert from "./shaders/line.vert?raw"
import lineFrag from "./shaders/line.frag?raw"
import linePickVert from "./shaders/line-pick.vert?raw"
import linePickFrag from "./shaders/line-pick.frag?raw"
import arrowVert from "./shaders/arrow.vert?raw"
import arrowFrag from "./shaders/arrow.frag?raw"
import arrowPickFrag from "./shaders/arrow-pick.frag?raw"
import textVert from "./shaders/text.vert?raw"
import textFrag from "./shaders/text.frag?raw"

export const NODE_VS = nodeVert
export const NODE_FS = nodeFrag
export const PICK_NODE_VS = nodePickVert
export const PICK_NODE_FS = nodePickFrag
export const LINE_VS = lineVert
export const LINE_FS = lineFrag
export const PICK_LINE_VS = linePickVert
export const PICK_LINE_FS = linePickFrag
export const ARROW_VS = arrowVert
export const ARROW_FS = arrowFrag
export const PICK_ARROW_VS = arrowVert
export const PICK_ARROW_FS = arrowPickFrag
export const TEXT_VS = textVert
export const TEXT_FS = textFrag
