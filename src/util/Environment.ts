import { join } from 'path';
import { config } from 'dotenv';

config();

export default class Environment {

    public static browserGlobalScriptsPath = join(__dirname, '../browser-context/*.js');

    public static browserDomainScriptsPath = join(__dirname, '../browser-context/rc/*.js');

    public static browserFlags = [<string>process.env.browserFlags];

    public static storagePath = <string>process.env.storagePath;

    public static mediaFileInterception = /.*\.(jpg|jpeg|png|svg|gif|webp|webm|webM|webP|mp4)\??.*$/;
}
