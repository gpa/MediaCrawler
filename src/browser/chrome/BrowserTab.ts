import IBrowserTab from "../IBrowserTab";
import IRequest from "../IRequest";
import IResponse from "../IResponse";

const chromeRemoteInterface: any = require('chrome-remote-interface');

export default class BrowserTab implements IBrowserTab {

    private network: any;

    private runtime: any;

    private page: any;

    private functions: any;

    public async init(chromePort: number) {
        
        const tab = await chromeRemoteInterface.New({ port: chromePort });
        const { Network, Page, Runtime } = await chromeRemoteInterface({ port: chromePort, tab });

        this.network = Network;
        this.runtime = Runtime;
        this.page = Page;
        this.functions = {};

        await Network.setCacheDisabled({
            cacheDisabled: true
        })

        await Promise.all([this.network.enable(), this.runtime.enable(), this.page.enable()]);
        await this.runtime.bindingCalled(this.bindingCalled.bind(this));
    }

    public getId(): string {

        return this.page.FrameId;
    }
    
    public async navigate(url: string): Promise<void> {

        await this.page.navigate({ url });
    }
   
    public async onNavigation(callback: () => void): Promise<void> {
        await this.page.frameNavigated((e: any) => {
            if(!e.frame.parentId)
                callback();
        });
    }

    public async evaluate(script: string, options?: { awaitPromise?: boolean }): Promise<string | void> {

        let result = await this.runtime.evaluate({ expression: script, awaitPromise: options != null ? options.awaitPromise : undefined });
        
        if(result.result.subtype == 'error')
            console.log(result);
       
        return result.result.value;
    }
  
    public async registerFunctionBridge(name: string, callback: (payload: string) => void): Promise<void> {

        if (typeof this.functions[name] !== 'undefined')
            throw new Error(name + ' binding was already defined');
        await this.runtime.addBinding({ name });
        this.functions[name] = callback;
    }

    public async onLoad(callback: () => void): Promise<void> {

        await this.page.loadEventFired(callback);
    }
  
    public async onRequest(callback: (request: IRequest) => void): Promise<void> {
        
        await this.network.requestWillBeSent((req: any) => {
            let request = { url: req.request.url, id: req.RequestId };
            callback(request);
        });
    }
   
    public async onRequestFailed(callback: (request: IRequest, error: Error) => void): Promise<void> {

        await this.network.loadingFailed((req: any) => {
            callback(req.requestId, new Error(req.errorText + req.blockedReason));
        });
    }
   
    public async onResponse(callback: (response: IResponse) => void): Promise<void> {

        await this.network.loadingFinished(async (req: any) => {
           
            try {
            let body = null;
            if(req.encodedDataLength != 0)
                body = await this.network.getResponseBody({ requestId: req.requestId });
            callback({ 
                requestId: req.requestId,
                body: body
            });
            } catch(exception) {
                console.log(req);
                console.log(exception);
            }
        });
    }

    private bindingCalled(info: any): void {
        this.functions[info.name](info.payload);
    }
}