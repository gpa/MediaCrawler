export default interface IReadOnlyDictionary<TKey extends string|number, TValue> {

    get(key: TKey): TValue;
    getKeys(): TKey[];
}