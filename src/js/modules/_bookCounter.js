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
