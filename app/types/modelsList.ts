export interface Model {
  id: string
  smallName: string
  name: string
  description: string
  explanation: string
  image: string
}

export default interface ModelsList extends Array<Model> {}
