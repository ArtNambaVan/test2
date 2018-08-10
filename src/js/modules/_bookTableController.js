var bookTableController = (function() {

    var table = document.querySelector( '.books' );

    var addBookToTable = function(obj) {
        var bookList = document.querySelector('.table-group'),
            tmpl = document.getElementById('comment-template').content.cloneNode(true);
        tmpl.querySelector('.id').innerText = obj.id;
        tmpl.querySelector('.title').innerText = obj.title;
        tmpl.querySelector('.description').innerText = obj.description;
        tmpl.querySelector('.author').innerText = obj.author;
        tmpl.querySelector('.date').innerText = obj.date;
        tmpl.querySelector('.genre').innerText = obj.genre;
        tmpl.querySelector('.type').innerText = obj.type;
        tmpl.querySelector('.js-delete-btn').addEventListener('click', deleteBookFromTable);
        bookList.appendChild(tmpl);

        updateBookPosition();
        mediator.publish('increaseCounter');
    };

    var updateBookPosition = function() {
        var $booksRow = $('.books-table').find('.table-book:not(:first-child)');
        $booksRow.each(function (index) {
            if ($(this).attr('data-position') != (index + 1)) {
                $(this).attr('data-position', (index + 1)).addClass('updated');
                $(this).find('.position').text(index + 1);
            }
        });
        booksData.localStorageNewPosition($booksRow);
    };

    var deleteBookFromTable = function(e) {
        if (e.target.classList.contains('js-delete-btn')) {
            e.target.parentElement.parentElement.remove();
            booksData.removeBookItem(e.target.parentElement.parentElement.querySelector('.id').textContent);
            updateBookPosition();
            mediator.publish('reduceCount');
        }
    };

    var showAllBooks = function() {
        removeAllBooks();
        var allBooks = booksData.getBookItems();

        function comparePos(posA, posB) {

            return posA.position - posB.position;
        }

        allBooks.sort(comparePos);

        allBooks.forEach(function(e) {
            addBookToTable(e);
        });

        updateBookPosition();

        mediator.publish('countAllBooks', allBooks);
    };

    var showPublicBooks = function() {
        removeAllBooks();

        var publicBooks = [],
            allBooks = booksData.getBookItems();

        function comparePos(posA, posB) {
            return posA.position - posB.position;
        }

        allBooks.sort(comparePos);

        allBooks.forEach(function(e) {
            if (e.type.toLowerCase() === 'public') {
                addBookToTable(e);
                publicBooks.push(e);
            }
        });
        removeDeleteBtns();
        updateBookPosition();
        mediator.publish('countPublicBooks', publicBooks);
    };

    var removeAllBooks = function() {
        var booksRow = document.querySelectorAll('.table-book');
        booksRow.forEach(function(e) {
            e.remove();
        });
        updateBookPosition();
    };

    var sortable = function() {
        $('.books-table').attr('id', 'sortable');
        var arr = [];
        $('#sortable').sortable({
            update: function (event, ui) {
                updateBookPosition();

                saveNewPosition();
            },
            disabled: false,

            change: function(event, ui) {
                ui.placeholder.css({
                    visibility: 'visible',
                    background: 'rgba(0,123,255,.25)',
                    height: '60px'
                });
            }
        });
    };

    var removeSortable = function() {
        $('#sortable').sortable({
            disabled: true
        });
    };

    var saveNewPosition = function() {
        var positions = [];
        $('.updated').each(function () {
            console.log($(this));
            positions.push([$(this).rowIndex, $(this).attr('data-position')]);
            $(this).removeClass('updated');
        });
    };

    var removeDeleteBtns = function() {

        $('.js-delete-btn').remove();
    };

    mediator.subscribe('userOutSession', showPublicBooks);
    mediator.subscribe('userLogIn', showAllBooks);
    mediator.subscribe('userSession', showAllBooks);

    mediator.subscribe('userLogOut', showPublicBooks);

    mediator.subscribe('newBook', addBookToTable);
    mediator.subscribe('userLogIn', sortable);
    mediator.subscribe('userSession', sortable);
    mediator.subscribe('userLogOut', removeSortable);


})();
