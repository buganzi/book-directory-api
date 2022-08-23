import { Document } from 'mongoose';
import { Review } from 'src/reviews/reviews.schema';

export interface IBook extends Document{
    readonly bookName: String;
    readonly author: String;
    readonly releaseDate: Date;
    readonly genre: String;
    readonly reviews: [Review];

}