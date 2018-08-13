var booksFormController = (function() {

    var bookForm = document.getElementById('book-form');

    var createForm = function() {
        var $tmpl     = $('#temp').html(),
            $bookForm = $('#book-form'),
            html
        ;

        html = Mustache.to_html($tmpl);
        $bookForm.html(html).hide().fadeIn(1000);


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
            inputPanel           = bookForm.querySelector('.panel'),
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
            inputTitle.classList.remove('border-success')
            inputDescription.classList.remove('border-success')
            inputPanel.classList.remove('border', 'border-danger')
            hideAlert();
            $('.panel').off();
            inputTitle.removeEventListener('input', function(){});
            inputDescription.removeEventListener('input', function(){});
        } else {
            showAlert();
            validateForm(inputTitle, inputDescription)

        }
    };

    var formError = function(inputName) {
        if (inputName.value === '') {
            inputName.classList.add('border-danger');
            inputName.focus();
        }
        inputName.addEventListener('input', function() {
            if (inputName.value === '') {
            inputName.classList.remove('border-success');
            inputName.classList.add('border-danger');
          } else if (inputName.value !== '') {
            inputName.classList.remove('border-danger');
            inputName.classList.add('border-success');
          }
        });
    }

    var showAlert = function() {

        $('#requireAlert').show('fade');

    };


    var hideAlert = function() {
        $('#requireAlert').hide();
    };

    var validateForm = function(title,description) {
        $('.invalid-feedback').addClass('d-block');
        $('.panel').on('change', function(){
            checked = $(".genre-checkbox:checked").length
            if (checked > 0) {
                $('.invalid-feedback').removeClass('d-block')
            } else {
                $('.invalid-feedback').addClass('d-block')
            }
        });
        formError(description);
        formError(title);


    }

    mediator.subscribe('userLogOut', hideAlert);

})();
