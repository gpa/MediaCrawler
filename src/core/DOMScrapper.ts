import IBrowserTab from "../browser/IBrowserTab";
import FileLoader from "../util/FileLoader";
import Environment from '../util/Environment';
import IReadOnlyDictionary from "../util/IReadOnlyDictionary";

export type ScrappedElement = {
    payload: string;
    metadata: string;
}

export class DOMScrapper {

    private static globalBrowserContextScripts: IReadOnlyDictionary<string, string>
        = FileLoader.loadFolderFileContents(Environment.browserGlobalScriptsPath);

    private static domainBrowserContextScripts: IReadOnlyDictionary<string, string>
        = FileLoader.loadFolderFileContents(Environment.browserDomainScriptsPath);

    private tab: IBrowserTab;

    private url: string;

    private lock: Promise<void>|null;

    public constructor(tab: IBrowserTab, url: string) {

        this.tab = tab;
        this.url = url;
    }

    public async scrap(postCount: number): Promise<ScrappedElement[]> {

        while(this.lock != null)
            await this.lock;

        const response = await this.tab.evaluate(`__extract(${postCount});`, { awaitPromise: true });

        if (response == null)
            return [];

        const parsedResponse = JSON.parse(response);
        return <ScrappedElement[]>parsedResponse;
    }

    public async startScrapping() {

        await this.tab.onNavigation(this.onNavigation.bind(this));
        await this.tab.navigate(this.url);
    }

    private async onNavigation() {

        if(this.lock != null) {
            throw new Error('onNavigation was called while on lock');
        }

        let unlock: any;
        this.lock = new Promise(resolve => { unlock = resolve });

        console.log('navigation event fired');
        await this.waitForLoadEvent();
        console.log('load event fired');

        for (const name of DOMScrapper.domainBrowserContextScripts.getKeys()) {

            if (!this.url.includes(name))
                continue;

            const content = DOMScrapper.domainBrowserContextScripts.get(name);
            await this.tab.evaluate(content);
        }

        for (const script of DOMScrapper.globalBrowserContextScripts.getKeys()) {

            const content = DOMScrapper.globalBrowserContextScripts.get(script);
            await this.tab.evaluate(content);
        }

        this.lock = null;
        unlock();
    }

    private waitForLoadEvent(): Promise<void> {

        return new Promise(resolve => this.tab.onLoad(resolve));
    }
}