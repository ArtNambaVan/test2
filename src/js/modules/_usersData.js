var usersData = (function() {


    var users, user1, user2, user3;

    users = [];
    user1 = {
        id       : 1,
        name     : 'User1',
        email    : 'user1@gmail.com',
        password : 'user1'
    };
    user2 = {
        id       : 2,
        name     : 'User2',
        email    : 'user2@gmail.com',
        password : 'User123'
    };

    user3 = {
        id       : 3,
        name     : 'Artem',
        email    : 'Arthorror@gmail.com',
        password : 'Anthrax1'
    };

    users.push(user1,user2, user3);


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
