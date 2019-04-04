import Dictionary from './../util/Dictionary';
import IBrowserTab from './../browser/IBrowserTab';
import IRequest from './../browser/IRequest';
import IResponse from './../browser/IResponse';

export enum InterceptedRequestStatus {
    Awaiting,
    Finished,
    Failed
}

export interface InterceptedRequest {
    status: InterceptedRequestStatus,
    content?: string;
    error?: Error;
}

export class NetworkInterceptor {

    private interceptedRequests: Dictionary<string, InterceptedRequest>;

    private urlMapping: Dictionary<string, string>;

    private urlPattern: RegExp;

    private tab: IBrowserTab;

    private onResponseIntercepted: (response: IResponse) => void;

    public constructor(tab: IBrowserTab, pattern: RegExp) {

        this.tab = tab;
        this.urlPattern = pattern;
        this.urlMapping = new Dictionary<string, string>();
        this.interceptedRequests = new Dictionary<string, InterceptedRequest>();
    }

    public async startIntercepting(): Promise<void> {

        await this.tab.onRequest(this.onRequest.bind(this));
        await this.tab.onResponse(this.onResponse.bind(this));
        await this.tab.onRequestFailed(this.onRequestFailed.bind(this));
    }

    public async stopIntercepting(): Promise<void> {

        await this.tab.onRequest(null);
        await this.tab.onResponse(null);
        await this.tab.onRequestFailed(null);
    }

    public get(url: string): InterceptedRequest {

        let requestId = this.urlMapping.get(url);
        return this.interceptedRequests.get(requestId);
    }

    private onRequest(request: IRequest): void {

        if (request.url.match(this.urlPattern)) {
            this.interceptedRequests.set(request.id, { status: InterceptedRequestStatus.Awaiting });
            this.urlMapping.set(request.url, request.id);
        }
    }

    private async onResponse(response: IResponse): Promise<void> {

        if (this.shouldIntercept(response.requestId)) {

            let body = response.body;
            if(body == null) console.log('RESPONSE BODY IS EMPTY');
            this.interceptedRequests.set(response.requestId, {
                status: InterceptedRequestStatus.Finished,
                content: body
            });
        }
    }

    private onRequestFailed(request: IRequest, error: Error): void {

        if (this.shouldIntercept(request.id)) {
            this.interceptedRequests.set(request.id, {
                status: InterceptedRequestStatus.Failed,
                error: error
            });
        }
    }

    private shouldIntercept(requestId: string): boolean {

        return this.interceptedRequests.containsKey(requestId);
    }
}