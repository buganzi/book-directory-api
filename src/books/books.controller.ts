import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { response } from 'express';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) { }

    @Post()
    @ApiCreatedResponse({ description: 'Created Succesfully' })
    @ApiBadRequestResponse({ description: 'Bad Request' })
    @ApiOperation({ summary: 'Create a Book' })
    async createBook(@Res() response, @Body() createBookDto: CreateBookDto) {
        try {
            const newBook = await this.booksService.createBook(createBookDto);
            return response.status(HttpStatus.CREATED).json({
                message: 'Book has been created successfully',
                newBook,
            });
        } catch (err) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: 400,
                message: 'Error: Book not created!',
                error: 'Bad Request'
            });
        }
    }

    @Put('/:id')
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Should be an id of a book that exists in the database',
        type: String
    })
    @ApiBody({ type: UpdateBookDto })
    @ApiOkResponse({ description: 'The resource was returned successfully' })
    @ApiNotFoundResponse({ description: 'Resource not found' })
    @ApiOperation({ summary: 'Update a Book using its Id' })
    async updateBook(@Res() response, @Param('id') bookId: string,
        @Body() updateBookDto: UpdateBookDto) {
        try {
            const existingBook = await this.booksService.updateBook(bookId, updateBookDto);
            return response.status(HttpStatus.OK).json({
                message: 'Book has been successfully updated',
                existingBook,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Get()
    @ApiOperation({ summary: 'Get all Books in the database' })
    async getBooks(@Res() response) {
        try {
            const booksData = await this.booksService.getAllBooks();
            return response.status(HttpStatus.OK).json({
                message: 'All books data found successfully', booksData,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Get('/group-by-genre')
    @ApiOperation({ summary: 'Get all books group by genres' })
    async getBooksGroupedByGenre(@Res() response) {
        try {
            const booksData = await this.booksService.getAllBooksByGenre();
            return response.status(HttpStatus.OK).json({
                message: 'All books data found successfully', booksData,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Get('/group-by-genre-and-year')
    @ApiOperation({ summary: 'Get all books grouped by genre and then publication date' })
    async getBooksGroupedByGenreAndYear(@Res() response) {
        try {
            const booksData = await this.booksService.getAllBooksByGenreAndYear();
            return response.status(HttpStatus.OK).json({
                message: 'All books data found successfully', booksData,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Get('/rating-by-author')
    @ApiOperation({ summary: 'Get authors rating accross all books' })
    async getBooksRatingByAuthor(@Res() response) {
        try {
            const booksData = await this.booksService.getRatingByAuthor();
            return response.status(HttpStatus.OK).json({
                message: 'All books data found successfully', booksData,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Get('/:id')
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Should be an id of a book that exists in the database',
        type: String
    })
    @ApiOkResponse({ description: 'The resource was returned successfully' })
    @ApiNotFoundResponse({ description: 'Resource not found' })
    @ApiOperation({ summary: 'View a specific book by Id' })
    async getBook(@Res() response, @Param('id') bookId: string) {
        try {
            const existingBook = await
                this.booksService.getBook(bookId);
            return response.status(HttpStatus.OK).json({
                message: 'Book found successfully', existingBook,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Delete('/:id')

    @ApiParam({
        name: 'id',
        required: true,
        description: 'Should be an id of a book that exists in the database',
        type: String
    })
    @ApiOkResponse({ description: 'The resource was returned successfully' })
    @ApiNotFoundResponse({ description: 'Resource not found' })
    @ApiOperation({ summary: 'Delete a Book by its Id' })
    async deleteBook(@Res() response, @Param('id') bookId: string) {
        try {
            const deletedBook = await this.booksService.deleteBook(bookId);
            return response.status(HttpStatus.OK).json({
                message: 'Book deleted successfully',
                deletedBook,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

    @Post('/:id/review')
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Should be an id of a book that exists in the database',
        type: String
    })
    @ApiCreatedResponse({ description: 'Created Succesfully' })
    @ApiOkResponse({ description: 'The resource was returned successfully' })
    @ApiNotFoundResponse({ description: 'Resource not found' })
    @ApiOperation({ summary: 'Create a Book Review to a specific book' })
    async createBookReview(@Res() response, @Param('id') bookId: string, @Body() createReviewDto: CreateReviewDto) {
        try {
            const newBook = await this.booksService.createBookReview(bookId, createReviewDto);
            return response.status(HttpStatus.CREATED).json({
                message: 'Review has been added successfully',
                newBook,
            });
        } catch (err) {
            console.log(err)
            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: 400,
                message: 'Error: Review not added!',
                error: 'Bad Request'
            });
        }
    }

    @Delete('/:id/review/:reviewId')
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Should be an id of a book that exists in the database',
        type: String
    })
    @ApiParam({
        name: 'reviewId',
        required: true,
        description: 'Should be an id of a Review that exists in the database',
        type: String
    })
    @ApiOkResponse({ description: 'The resource was returned successfully' })
    @ApiNotFoundResponse({ description: 'Resource not found' })
    @ApiOperation({ summary: 'Delete a Book Review' })
    async deleteBookReview(@Res() response, @Param('id') bookId: string, @Param('reviewId') reviewId: string) {
        try {
            const deletedBook = await this.booksService.deleteBookReview(bookId, reviewId);
            return response.status(HttpStatus.OK).json({
                message: 'Book deleted successfully',
                deletedBook,
            });
        } catch (err) {
            return response.status(err.status).json(err.response);
        }
    }

}


