import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
export class CreateBookDto {

    @ApiProperty({
        type: String,
        description: 'The book name',
      })
    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    readonly bookName: String;

    @ApiProperty({
        type: String,
        description: 'The name if the author',
      })
    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    readonly author: String;

    @ApiProperty({
        type: Date,
        description: 'The date for book release such as 2022-09-12',
      })
    @IsDateString()
    @IsNotEmpty()
    readonly releaseDate: Date;

    @ApiProperty({
        type: String,
        description: 'The genre type of the book',
      })
    @IsString()
    @MaxLength(30)
    @IsNotEmpty()
    readonly genre: String;
}