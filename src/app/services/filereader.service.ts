import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileReaderService {

  readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      // file type
      if (!this.isValidTextFile(file)) {
        reject(new Error('only text file type is supported'));
        return;
      }

      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        const content = event.target?.result as string || '';
        resolve(content);
      };

      reader.onerror = () => {
        reject(new Error('error when read file'));
      };

      reader.readAsText(file, 'UTF-8');
    });
  }

  private isValidTextFile(file: File): boolean {
    const validTypes = ['text/plain'];

    // MIME
    if (validTypes.includes(file.type)) {
      return true;
    }
    return false
  }

  /*
  getFileInfo(file: File): any {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified)
    };
  }
    */
}