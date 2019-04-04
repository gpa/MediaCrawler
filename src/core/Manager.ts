import IBrowserTab from "../browser/IBrowserTab";
import { NetworkInterceptor, InterceptedRequestStatus } from "./NetworkInterceptor";
import { DOMScrapper, ScrappedElement } from "./DOMScrapper";
import FileSaver from "../util/FileSaver";
import * as interval from 'interval-promise'
import Environment from "../util/Environment";

export default class Manager {

    private tab: IBrowserTab;

    private url: string;

    private networkInterceptor: NetworkInterceptor;

    private domScrapper: DOMScrapper;

    private fileSaver: FileSaver;

    private scrappedElements: ScrappedElement[];

    public constructor(tab: IBrowserTab, url: string) {

        this.tab = tab;
        this.url = url;
        this.networkInterceptor = new NetworkInterceptor(tab, Environment.mediaFileInterception);
        this.fileSaver = new FileSaver(Environment.storagePath);
        this.domScrapper = new DOMScrapper(tab, url);
        this.scrappedElements = [];
    }

    public async startScrapping(): Promise<void> {

        await Promise.all([this.networkInterceptor.startIntercepting(), this.domScrapper.startScrapping()]);
        (<any>interval)(this.update.bind(this), 1000);
    }

    private async update(iteration: number, stop: () => void): Promise<void> {

        let elements = await this.domScrapper.scrap(2);

        if(elements.length == 0 || this.scrappedElements.length > 10) {
            console.log('Stopping...');
            (<any>interval)(this.finalize.bind(this), 1000);
            return stop();
        }

        for(var i = 0; i < elements.length; ++i) {

            let element = elements[i];
            this.scrappedElements.push(element);
            console.log(element.payload);
        }
    }

    private async finalize() {

        for(var i = 0; i < this.scrappedElements.length; ++i) {

            let element = this.scrappedElements[i];
            let request = this.networkInterceptor.get(element.payload);
            if(request == null) {
                console.log('REQUEST WAS NOT INTERCEPTED');
            }
            else if(request.status == InterceptedRequestStatus.Failed) {
                console.log('Failed to intercept ' + element.payload);
                console.log(request.error);
            } else if(request.status == InterceptedRequestStatus.Awaiting) {
                console.log('Still waiting for ' + element.payload);
            } else {
                console.log('GOT ' + element.payload);
            }
        }
    }
}