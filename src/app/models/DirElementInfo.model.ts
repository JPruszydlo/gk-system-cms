export type DirElementInfo = {
  isFile: boolean
  name: string
  mimeType: string
  files: DirElementInfo[]
}
