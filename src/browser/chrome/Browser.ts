import { launch, LaunchedChrome } from 'chrome-launcher';
import IBrowser from "../IBrowser";
import IBrowserTab from "../IBrowserTab";
import BrowserTab from './BrowserTab';

export default class Browser implements IBrowser {

    private chrome: LaunchedChrome;

    private flags: string[];

    public constructor(flags?: string[]) {
    
        this.flags = flags || [];
    }

    public async open(): Promise<void> {
        if (this.chrome != null)
            throw new Error('Browser was already started.');

        this.chrome = await launch({
            enableExtensions: true,
            chromeFlags: this.flags
        });
    }    
    
    public async close(): Promise<void> {

        if(this.chrome == null)
            throw new Error('Browser is not running.');

        await this.chrome.kill();
    }
   
    public async openTab(): Promise<IBrowserTab> {

        if(this.chrome == null)
            throw new Error('Browser is not running.');

        let tab = new BrowserTab();
        await tab.init(this.chrome.port);
        return tab;
    }
   
    public closeTab(tab: IBrowserTab): Promise<void> {

        if(this.chrome == null)
            throw new Error('Browser was not started');

        throw new Error("Method not implemented.");
    }
}