import IRequest from "./IRequest";
import IResponse from "./IResponse";

export default interface IBrowserTab {
    
    getId(): string;

    navigate(url: string): Promise<void>;

    evaluate(script: string, options?: { awaitPromise?: boolean }): Promise<void|string>;

    registerFunctionBridge(name: string, func: (payload: string) => void): Promise<void>;

    onNavigation(callback: () => void): Promise<void>;

    onLoad(callback: () => void): Promise<void>;

    onRequest(callback: null|((request: IRequest) => void)): Promise<void>;

    onRequestFailed(callback: null|((request: IRequest, error: Error) => void)): Promise<void>;

    onResponse(callback: null|((response: IResponse) => void)): Promise<void>;
}