import { sync } from 'glob';
import { join, basename, extname } from 'path';
import { readFileSync } from 'fs';
import Dictionary from './Dictionary';
import IReadOnlyDictionary from './IReadOnlyDictionary';

export default class FileLoader {

    public static loadFolderFileContents(path: string): IReadOnlyDictionary<string, string> {

        let paths = sync(path);
        let contents = new Dictionary<string, string>();

        for (let path of paths) {
            let name = basename(path, extname(path));
            contents.set(name, readFileSync(path, 'utf8'));
        }

        return contents;
    }
}
