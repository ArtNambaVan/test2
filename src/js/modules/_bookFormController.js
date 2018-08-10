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
