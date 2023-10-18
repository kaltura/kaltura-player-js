/**
 * @typedef {Object} PKTextStyleObject
 * @property {"50%" | "75%" | "100%" | "200%" | "300%" | "400%"} fontSize='100%' - Percentage unit relative to the parent element's font size.
 * @property {-2 | -1 | 0 | 2 | 3 | 4} fontScale=0 - - Integer number representing the scaling factor relative to the parent element's font size.
 * @property {string} fontFamily='sans-serif'
 * @property {[number, number, number]} fontColor=[255, 255, 255] - Color in RGB format.
 * @property {number} fontOpacity=1
 * @property {Array<[number, number, number, number, number, number]>} fontEdge=[]
 * @property {[number, number, number]} backgroundColor=[0, 0, 0] - Color in RGB format.
 * @property {number} backgroundOpacity=1
 */
export interface TextStyle {
  fontSize?: '50%' | '75%' | '100%' | '200%' | '300%' | '400%';
  fontScale?: -2 | -1 | 0 | 2 | 3 | 4;
  fontFamily?: string;
  fontColor?: [number, number, number];
  fontOpacity?: number;
  fontEdge?: Array<[number, number, number, number, number, number]>;
  backgroundColor?: [number, number, number];
  backgroundOpacity?: number;
}
//# sourceMappingURL=text-style.d.ts.map
