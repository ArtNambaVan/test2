var booksData = (function() {

    var Book = function(id, obj) {
        this.id = id;
        this.position = -1;
        this.title = obj.title;
        this.description = obj.description;
        this.author = obj.author;
        this.genre = obj.genre;
        this.date = obj.date;
        this.type = obj.type;
    };

    var getBookFromLocalStorage = function() {
        var books,
            booksLS = localStorage.getItem('books');

        if(booksLS === null) {
            books = [];
        } else {
            books = JSON.parse(booksLS);
        }
        return books;
    };

    var addBookToLocalStorage = function(book) {
        var books = getBookFromLocalStorage();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    };

    var getBookID = function() {
        var IDs,
            IDLS = localStorage.getItem('ID');

        if (IDLS === null) {
            IDs = [];
        } else {
            IDs = JSON.parse (IDLS);
        }
        return IDs;

    };

    var addBookID = function(ID) {
        var IDs = getBookID();

        IDs.push(ID);
        localStorage.setItem('ID', JSON.stringify(IDs));
    };

    return {

        addBookItem: function(obj) {
            var IDs   = getBookID(),
                newItem, newID;

            if (IDs.length > 0) {
                newID = IDs.length;
            } else {
                newID = 0;
            }

            newItem = new Book(newID, obj);

            addBookToLocalStorage(newItem);
            addBookID(newID);

            return newItem;
        },

        getBookItems: function() {
            var books = getBookFromLocalStorage();

            return books;
        },

        removeBookItem : function(id) {
            var books = getBookFromLocalStorage();

            books.forEach(function(el, index) {
                if (el.id == id) {
                    books.splice(index, 1);
                }
            });

            localStorage.setItem('books', JSON.stringify(books));
        },

        localStorageNewPosition : function(books) {
            var oldBooks = getBookFromLocalStorage();

            oldBooks.forEach(function(e) {
                books.each(function(i) {
                    if (e.id == $(this).find('.id').text()) {
                        e.position = $(this).find('.position').text();
                    }
                });

            });

            localStorage.setItem('books', JSON.stringify(oldBooks));
        }
    };
})();
