import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { IBook } from './books.interface';
import mongoose, { Model } from "mongoose";
import { UpdateBookDto } from './dto/update-book.dto';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { Review } from 'src/reviews/reviews.schema';
import { ObjectId } from "mongoose";

@Injectable()
export class BooksService {

    private readonly logger = new Logger(BooksService.name);

    constructor(@InjectModel('Book') private bookModel: Model<IBook>) { }

    async createBook(createBookDto: CreateBookDto): Promise<IBook> {
        const newBook = await new this.bookModel(createBookDto);
        newBook.save();
        this.logger.log("Book created");
        return newBook;
    }

    async createBookReview(bookId: string, createReviewDto: CreateReviewDto): Promise<IBook> {
        const existingBook = await this.bookModel.findById(bookId);

        if (!existingBook) {
            throw new NotFoundException(`Book #${bookId} not found`);
        }

        //Create a new Review
        var review = new Review();
        review.rating = createReviewDto.rating;
        review.review = createReviewDto.review;

        existingBook.reviews.push(review);

        existingBook.save();

        this.logger.log("Book Review created");
        return existingBook;
    }

    async updateBook(bookId: string, updateBookDto: UpdateBookDto): Promise<IBook> {
        const existingBook = await this.bookModel.findByIdAndUpdate(bookId, updateBookDto, { new: true });
        if (!existingBook) {
            this.logger.error("Book Not found");
            throw new NotFoundException(`Book #${bookId} not found`);
        }
        this.logger.log("Book updated");
        return existingBook;
    }

    async getAllBooks(): Promise<IBook[]> {
        const bookData = await this.bookModel.find();
        if (!bookData || bookData.length == 0) {
            throw new NotFoundException('Books data not found!');
        }
        return bookData;
    }

    async getAllBooksByGenre(): Promise<IBook[]> {
        const bookData = await this.bookModel.aggregate([
            {
                $group: {
                    _id: '$genre',
                    books: { $push: "$$ROOT" }
                }


            }
        ]);

        if (!bookData || bookData.length == 0) {
            this.logger.error("Books Not found");
            throw new NotFoundException('Books data not found!');
        }
        return bookData;
    }

    async getAllBooksByGenreAndYear(): Promise<IBook[]> {
        const bookData = await this.bookModel.aggregate([
            {
                '$group': {
                    '_id': {
                        'genre': '$genre',
                        'year': {
                            '$dateToString': {
                                'format': '%Y',
                                'date': '$releaseDate'
                            }
                        }
                    },
                    'books': {
                        '$push': '$$ROOT'
                    }
                }
            }, {
                '$group': {
                    '_id': '$_id.genre',
                    'years': {
                        '$push': {
                            'year': '$_id.year',
                            'books': '$books'
                        }
                    }
                }
            }, {
                '$project': {
                    '_id': 0,
                    'genre': '$_id',
                    'years': 1
                }
            }
        ]);

        if (!bookData || bookData.length == 0) {
            this.logger.error("Books Not found");
            throw new NotFoundException('Books data not found!');
        }
        return bookData;
    }

    async getRatingByAuthor(): Promise<IBook[]> {
        const bookData = await this.bookModel.aggregate([
            {
                '$group': {
                    '_id': '$author',
                    'sum': {
                        '$sum': {
                            '$sum': '$reviews.rating'
                        }
                    },
                    'average': {
                        '$avg': {
                            '$avg': '$reviews.rating'
                        }
                    }
                }
            },
            {
                '$project': {
                    '_id': 0,
                    'author': '$_id',
                    'sum': 1,
                    'average': { $ifNull: [ "$average", 0 ] }
                }
            }
        ]);

        if (!bookData || bookData.length == 0) {
            this.logger.error("Books Not found");
            throw new NotFoundException('Books data not found!');
        }
        return bookData;
    }


    async getBook(bookId: string): Promise<IBook> {
        const existingBook = await this.bookModel.findById(bookId).exec();
        if (!existingBook) {
            this.logger.error("Book Not found");
            throw new NotFoundException(`Book #${bookId} not found`);
        }
        return existingBook;
    }

    async deleteBook(bookId: string): Promise<IBook> {
        const deletedBook = await this.bookModel.findByIdAndDelete(bookId);
        if (!deletedBook) {
            this.logger.error("Book Not found");
            throw new NotFoundException(`Book #${bookId} not found`);
        }
        return deletedBook;
    }

    async deleteBookReview(bookId: string, reviewId: string): Promise<IBook> {

        const existingBook = await this.bookModel.findByIdAndUpdate(bookId, {
            "$pull": {
                "reviews": {
                    "_id": new mongoose.Types.ObjectId(reviewId)
                }
            }
        });
        if (!existingBook) {
            this.logger.error("Book Not found");
            throw new NotFoundException(`Book #${bookId} not found`);
        }
        return existingBook;
    }
}