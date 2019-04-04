import IBrowserTab from "./IBrowserTab";

export default interface IBrowser {

    open(): Promise<void>;

    close(): Promise<void>;

    openTab(): Promise<IBrowserTab>;

    closeTab(tab: IBrowserTab): Promise<void>;
}