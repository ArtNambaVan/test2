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
