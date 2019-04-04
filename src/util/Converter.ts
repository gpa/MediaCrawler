import { Post } from "../model/Post";

export default class Converter {

    public static convert(serializedPosts: string): Post[] {
        let obj = JSON.parse(serializedPosts);
        return <Post[]>obj;
    }
}