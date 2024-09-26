import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  inputChanged(file: File, callback: any) {
    if (file) {
      const reader = new FileReader()

      reader.onload = (e: any) => {
        callback(`data:${file.type};base64,${btoa(e.target.result)}`)
      }
      reader.readAsBinaryString(file)
    }
  }
  uploadFile2(files: any, okCallback: any) {
    if (files == null) {
      okCallback(files)
      return
    }
    const formData = new FormData()
    //files = files.filter((x: any) => x[0] != null)

    // if (files.length == 0) {
    //   okCallback(files)
    //   return
    // }
    formData.append('files', JSON.stringify(files))

    this.http.post('https://gk-system.myshort.pl/external/upload.php', formData).subscribe({
      next: (result: any) => okCallback(result),
    })
  }
  uploadFile(fileName: string, base64: string) {
    const formData = new FormData()
    formData.append('fileName', fileName)
    formData.append('base64string', base64)
    this.http.post('https://gk-system.myshort.pl/external/upload_backup.php', formData).subscribe()

    // const formData = new FormData()
    // formData.append('file', file)
    // formData.append('dirName', dirName == undefined ? '' : dirName)

    // this.http.post(environment.phpUrl + '/upload-file.php', formData).subscribe({
    //   next: (result: any) => okCallback(result),
    //   error: () => errorCallback(),
    // })
  }
  getAvailabelImages(): Promise<any> {
    return new Promise((response, error) => {
      this.http.get<any>(environment.phpUrl + '/list-images.php').subscribe({
        next: (resp: any) => {
          response(resp)
        },
        error: (err) => {
          error(err)
        },
      })
    })
  }
  createDirectory(name: string, okCallback: any, errorCallback: any) {
    let fmData = new FormData()
    fmData.append('name', name)

    this.http.post(environment.phpUrl + '/create-directory.php', fmData).subscribe({
      next: () => okCallback(),
      error: () => errorCallback(),
    })
  }

  removeDirectory(name: string, okCallback: any) {
    let fmData = new FormData()
    fmData.append('name', name)

    this.http.post(environment.phpUrl + '/remove-element.php', fmData).subscribe({
      next: (result) => okCallback(result),
    })
  }
  removePattern(name: string, okCallback: any) {
    let fmData = new FormData()
    fmData.append('name', name)

    this.http.post(environment.phpUrl + '/remove-pattern.php', fmData).subscribe({
      next: () => okCallback(),
    })
  }
}
