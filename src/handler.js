const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const id = nanoid(16);

    const finished = pageCount === readPage;

    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
    };

    if (!name) {
        const response = h
            .response({
                status: 'fail',
                message: 'Gagal menambahkan buku. Mohon isi nama buku',
            })
            .code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h
            .response({
                status: 'fail',
                message:
                    'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
            })
            .code(400);
        return response;
    }

    books.push(newBook);

    const isSuccess = books.filter((note) => note.id === id).length > 0;
    if (isSuccess) {
        const response = h
            .response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: `${id}`,
                },
            })
            .code(201);
        return response;
    }

    const response = h
        .response({
            status: 'error',
            message: 'Buku gagal ditambahkan',
        })
        .code(500);
    return response;
};

const getAllBook = (request, h) => {
    const { name, reading, finished } = request.query;

    let filteredBooks = books;

    if (name !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book
            .name.toLowerCase().includes(name.toLowerCase()));
    }

    if (reading !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.reading === !!Number(reading));
    }

    if (finished !== undefined) {
        filteredBooks = filteredBooks.filter((book) => book.finished === !!Number(finished));
    }

    const response = h.response({
        status: 'success',
        data: {
            books: filteredBooks.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
    response.code(200);

    return response;
};

const getBookById = (request, h) => {
    const { bookId } = request.params;

    const targetBook = books.filter((b) => b.id === bookId)[0];

    if (targetBook) {
        const response = h
            .response({
                status: 'success',
                data: {
                    book: targetBook,
                },
            })
            .code(200);
        return response;
    }

    const response = h
        .response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        })
        .code(404);
    return response;
};

const editBookById = (request, h) => {
    const { bookId } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const updatedAt = new Date().toISOString();

    if (!name) {
        const response = h
            .response({
                status: 'fail',
                message: 'Gagal memperbarui buku. Mohon isi nama buku',
            })
            .code(400);
        return response;
    }

    if (readPage !== pageCount) {
        const response = h
            .response({
                status: 'fail',
                message:
                    'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
            })
            .code(400);
        return response;
    }

    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };
        const response = h
            .response({
                status: 'success',
                message: 'Buku berhasil diperbarui',
            })
            .code(200);
        return response;
    }

    const response = h
        .response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        })
        .code(404);
    return response;
};

const deleteBookById = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
        books.splice(index, 1);
        const response = h
            .response({
                status: 'success',
                message: 'Buku berhasil dihapus',
            })
            .code(200);
        return response;
    }

    const response = h
        .response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        })
        .code(404);
    return response;
};

module.exports = {
    addBook,
    getAllBook,
    getBookById,
    editBookById,
    deleteBookById,
};
