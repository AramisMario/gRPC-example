const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync('./proto/bookStore.proto',{});
const bookStorePackage = grpc.loadPackageDefinition(packageDefinition).bookStorePackage;

const books = [];

function createBook(call, callback) {
    const book = call.request.book;

    const bookObject = {
        'id': books.length + 1,
        'book': book
    }
    books.push(bookObject);
    callback(null,bookObject);
}

function readBook(call, callback) {
    const id = call.request.id;
    const book = books.find((book) => book.id === id);
    callback(null,book);
}

function readBooks(call,callback) {
    callback(null,{books:books});
}

function sendToclient(call){

    const bookObject = {
        'id': books.length + 1,
        'book': "my book"
    }
    call.write(bookObject);
}


const server = new grpc.Server();

server.addService(bookStorePackage.Book.service, {
    createBook: createBook,
    readBook: readBook,
    readBooks: readBooks,
    sendToclient: sendToclient
});

server.bindAsync('0.0.0.0:50051',grpc.ServerCredentials.createInsecure(),() => {
    console.log("Server running at http://127.0.0.1:50051");
    server.start();
});