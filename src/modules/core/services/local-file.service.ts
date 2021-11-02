import { Injectable } from '@polyflix/di'

@Injectable()
export class LocalFileService {
  /**
   * Read a file as text
   * @param file
   * @returns
   */
  public readAsText(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onerror = reject
      reader.onload = () => {
        if (reader.result) resolve(reader.result.toString())
        else reject('Result is not a string')
      }
      reader.readAsText(file)
    })
  }
}
