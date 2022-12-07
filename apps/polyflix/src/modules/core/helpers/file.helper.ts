import { v4 as uuid } from 'uuid'

export const generateFilename = (file: File) => {
  return `${uuid()}.${file.name.split('.')[1]}`
}

export const dataUriToBlob = (dataUri: string): Blob => {
  const splitted = dataUri.split(',')

  // Convert base64 to raw binary
  const byteString = atob(splitted[1])

  // Separate the mime component
  const type = splitted[0].split(':')[1].split(';')[0]

  const arrayBuffer = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(arrayBuffer)

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  return new Blob([arrayBuffer], { type })
}
