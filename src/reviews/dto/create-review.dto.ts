import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min } from "class-validator";
export class CreateReviewDto {
    
    @ApiProperty({
        type: String,
        description: 'The book review content',
      })
    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    @IsNotEmpty()
    readonly review: String;

    @ApiProperty({
        type: Number,
        description: 'The book rating score between 0 and 5',
      })
    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    @IsInt()
    @Min(0)
    @Max(10)
    readonly rating: number;

}