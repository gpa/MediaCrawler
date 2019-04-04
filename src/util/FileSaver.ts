import { writeFile } from 'fs';
import { join } from 'path';

export default class FileSaver {

    private path: string;

    private fileWritePromises: Promise<void>[];

    private writtenFilesCount: number;
    
    public constructor(path: string) {
        this.path = path;
    }

    public async waitForWrittingFinished() : Promise<void> {

        await Promise.all(this.fileWritePromises);
    }

    public save(name: string, content: string, encoding: string) {

        this.fileWritePromises.push(this.saveFileAsync(name, content, encoding));
    }

    private saveFileAsync(name: string, content: string, encoding: string): Promise<void> {
        
        return new Promise(function (resolve, reject) {
            writeFile(join(this.path, name), content, encoding, function (err) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
}