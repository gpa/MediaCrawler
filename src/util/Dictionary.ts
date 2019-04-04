import IReadOnlyDictionary from "./IReadOnlyDictionary";

export default class Dictionary<TKey extends string|number, TValue> implements IReadOnlyDictionary<TKey, TValue> {
    private items: { [key: string]: TValue } = {};

    get(key: TKey) {
        
        return this.items[<any>key];
    }

    set(key: TKey, value: TValue) {

        this.items[<any>key] = value;
    }

    containsKey(key: TKey) {

        return (typeof this.items[<any>key] !== 'undefined');
    }

    getKeys(): TKey[] {

        return <TKey[]>Object.keys(this.items);
    }
}