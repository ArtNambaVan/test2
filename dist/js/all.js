var mediator = (function() {

    var subscribers = {};

    return {
        subscribe : function(eventName, fn) {
            subscribers[eventName] = subscribers[eventName] || [];
            subscribers[eventName].push(fn);
        },

        publish : function(eventName, data) {
            if (subscribers[eventName]) {
                subscribers[eventName].forEach(function(fn) {
                    fn(data);
                });
            }
        }
    };

})();

var bookCounter = (function() {
    var counter = document.querySelector('.js-count');
    var count = 0;

    var publicBooksCounter = function(books) {
        count = books.length;
        counter.textContent = count;
        return count;
    };

    var allBooksCounter = function(books) {
        count = books.length;
        counter.textContent = count;
        return count;
    };

    var increaseCounter = function() {
        count ++;
        counter.textContent = count;
        return count;
    };

    var reduceCount = function() {
        count--;
        counter.textContent = count;
        return count;
    };



    mediator.subscribe('countPublicBooks', publicBooksCounter);
    mediator.subscribe('countAllBooks', allBooksCounter);
    mediator.subscribe('increaseCounter', increaseCounter);
    mediator.subscribe('reduceCount', reduceCount);


})();

var booksFormController = (function() {

    var bookForm = document.getElementById('book-form');

    var createForm = function() {
        var $tmpl     = $('#temp').html(),
            $bookForm = $('#book-form'),
            html
        ;

        html = Mustache.to_html($tmpl);
        $bookForm.html(html).hide().fadeIn(1000);

        $('#pre-selected-options').multiSelect();
        addListenerOnGenreBtn();
    };

    var addListenerOnGenreBtn = function() {
        var $arrow = $('#book-form').find('.toggle-arrow'),
            $panel = $('#book-form').find('.ms-container')
        ;
        $panel.hide();

        $arrow.on('click', function() {
            $panel.slideToggle('slow');
        });
    };

    var removeForm = function() {
        $('#book-form').children().fadeOut(500,function(){
            $(this).remove();
        });
    };

    mediator.subscribe('userLogIn', createForm);
    mediator.subscribe('userSession', createForm);
    mediator.subscribe('userLogOut', removeForm);

    bookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        createBook();
    });

    var createBook = function() {
        var inputTitle           = bookForm.querySelector('.js-title'),
            inputDescription     = bookForm.querySelector('.js-description'),
            inputType            = bookForm.querySelectorAll('input[type="radio"]'),
            inputCheckbox        = bookForm.querySelectorAll('.genre-checkbox'),
            genreArr = [],
            genre, type, now, date, author
            ;

        author = usersData.getCurrentUser()[0].name;

        inputType.forEach(function(el) {
            if (el.checked) {
                type = el.value;
                return type;
            }
        });

        inputCheckbox.forEach(function(el) {
            if (el.checked) {
                genreArr.push(el.value);
            }

            return genreArr;
        });

        genre = genreArr.join(', ');

        if (inputTitle.value !== '' && inputDescription.value !== '' && genre !== '') {

            now = new Date();
            date = now.getHours() + ':' + now.getMinutes();

            var bookItem = {
                title: inputTitle.value,
                description: inputDescription.value,
                author: author,
                genre: genre,
                type: type,
                date: date
            };
            bookForm.reset();

            var newItem = booksData.addBookItem(bookItem);

            mediator.publish('newBook', newItem);
            hideAlert();
        } else {
            showAlert();
        }
    };

    var showAlert = function() {

        $('#requireAlert').show('fade');

    };


    var hideAlert = function() {
        $('#requireAlert').hide();
    };

    mediator.subscribe('userLogOut', hideAlert);

})();

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

var cookies = (function() {

    var setCookie = function(name, value, options) {
        options = options || {};

        var expires = options.expires;

        if (typeof expires == 'number' && expires) {
            var d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }

        value = encodeURIComponent(value);

        var updatedCookie = name + '=' + value;

        for (var propName in options) {
            updatedCookie += '; ' + propName;
            var propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += '=' + propValue;
            }
        }

        document.cookie = updatedCookie;
    };

    var deleteCookie = function(name) {
        setCookie(name, '', {
            expires: -1
        });
    };

    return {
        setCookie: setCookie,
        deleteCookie: deleteCookie
    };


})();

var userAuthorizationController = (function() {

    var emailInput      = document.getElementById('email-input'),
        passwordInput   = document.getElementById('password-input'),
        loginForm       = document.getElementById('login-form'),
        logOutBtn       = document.querySelector('.js-logout'),
        logInBtn        = document.querySelector('.js-login')
    ;

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        userLogin();
    });

    logOutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        logInBtn.classList.toggle('d-none');
        logOutBtn.classList.toggle('d-none');
        usersData.deleteCurrentUser();
        mediator.publish('userLogOut');
        cookies.deleteCookie('name');
    });

    var userLogin = function() {

        var allUsers = usersData.getUsers();

        for (var i = 0; i < allUsers.length; i++) {
            if (emailInput.value.toLowerCase() === allUsers[i].email.toLowerCase() && passwordInput.value === allUsers[i].password) {
                $('#loginError').hide('fade');
                $('#modalLoginForm').modal('hide');

                usersData.currentUser(allUsers[i]);
                $('#loginError').hide('fade');
                changeBtn();
                showAlert(allUsers[i]);
                mediator.publish('userLogIn', allUsers[i]);
                cookies.setCookie('name', allUsers[i].name, {expires: 3600});
                return;
            }
        }

        $('#loginError').show('fade');
        loginForm.reset();
        emailInput.focus();

    };


    var changeBtn = function() {
        logInBtn.classList.toggle('d-none');
        logOutBtn.classList.toggle('d-none');
    };

    var showAlert = function(obj) {

        var tmpl = '{{name}}';
        var html = Mustache.to_html(tmpl, obj);

        $('#user-name').html(html);
        $('#successAlert').show('fade');

        setTimeout(function() {
            $('#successAlert').hide('fade');
        }, 3000);
    };

    mediator.subscribe('userSession', changeBtn);

})();


var usersData = (function() {


    var users, user1, user2;

    users = [];
    user1 = {
        id       : 1,
        name     : 'User1',
        email    : 'user1@gmail.com',
        password : 'user1'
    };
    user2 = {
        id       : 2,
        name     : 'Artem',
        email    : 'Artem@gmail.com',
        password : 'artem123'
    };

    users.push(user1,user2);


    return {
        getUsers: function() {
            return users;
        },

        getCurrentUser: function() {
            var user,
                currUser = localStorage.getItem('currentUser');

            if( currUser === null ) {
                user = null;
            } else {
                user = JSON.parse(currUser);
            }
            return user;
        },

        currentUser: function (user) {
            var currUser = [];
            currUser.push(user);
            localStorage.setItem('currentUser', JSON.stringify(currUser));
        },

        deleteCurrentUser: function () {
            localStorage.removeItem('currentUser');
        }
    };

})();

var getCookie = (function(name){
    var matches = document.cookie.match(new RegExp(
        '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
    ));
    var userName = matches ? decodeURIComponent(matches[1]) : undefined;
    if (userName) {
        mediator.publish('userSession', userName);
        console.log('in');
    } else {
        mediator.publish('userOutSession', userName);
        console.log('out');
    }
    return matches ? decodeURIComponent(matches[1]) : undefined;
})('name');



