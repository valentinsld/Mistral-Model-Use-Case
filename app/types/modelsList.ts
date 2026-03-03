export interface Model {
  id: string
  smallName: string
  name: string
  description: string
  explanation: string
  image: string
  pixelArt?: {
    colors: Record<string, string>
    size: {
      x: number
      y: number
    }
    array: string[][]
  }
}

export default interface ModelsList extends Array<Model> {}
