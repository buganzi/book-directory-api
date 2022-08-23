import { Document } from 'mongoose';
import { Review } from 'src/reviews/reviews.schema';

export interface IReview extends Document{
    readonly review: String;
    readonly rating: number;

}