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

        var user = usersData.getCurrentUser()[0] || obj;
        var tmpl = '{{name}}';
        var html = Mustache.to_html(tmpl, user);

        $('#user-name').html(html);
        $('#successAlert').show('fade');

        setTimeout(function() {
            $('#successAlert').hide('fade');
        }, 3000);
    };

    mediator.subscribe('userSession', changeBtn);
    mediator.subscribe('userSession', showAlert);

})();

