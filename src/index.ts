import Chrome from './browser/chrome/Browser';
import Environment from './util/Environment';
import { Database } from './model/Database';
import { join } from 'path';
import Manager from './core/Manager';
import { NetworkInterceptor } from './core/NetworkInterceptor';

async function scrap(url: string) {

    let database = new Database(join(Environment.storagePath, 'database.sqlite'));

    let chrome = new Chrome(Environment.browserFlags);
    await chrome.open();

    let tab = await chrome.openTab();
  
    let networkInterceptor = new NetworkInterceptor(tab,  /.*\.(jpg|jpeg|png|svg|gif|webp|webm|webM|webP|mp4)\??.*$/);
    await networkInterceptor.startIntercepting();

    await tab.navigate(url);

    let manager = new Manager(tab, url);
    await manager.startScrapping();
}

(async () => {
    await scrap('https://9gag.com');
})();