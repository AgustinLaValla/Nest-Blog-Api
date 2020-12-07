import { FindFeedQuery } from "./find-feed-query.interface";

export interface FindAllQuery extends FindFeedQuery {
    tag?: string;
    author?: string;
    favorited?: string;
}