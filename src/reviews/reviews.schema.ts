import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, ObjectId } from "mongoose";

@Schema()
export class Review {
    @Prop()
    review: String;
    @Prop()
    rating: number;

}
export const ReviewSchema = SchemaFactory.createForClass(Review);