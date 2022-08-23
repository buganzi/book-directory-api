import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types } from "mongoose";
import { Review, ReviewSchema } from "src/reviews/reviews.schema";
@Schema()
export class Book {

    @Prop()
    bookName: string;
    @Prop()
    author: string;
    @Prop()
    releaseDate: Date;
    @Prop()
    genre: string;
    @Prop({type: [ReviewSchema]})
    reviews: [Review];

}
export const BookSchema = SchemaFactory.createForClass(Book);