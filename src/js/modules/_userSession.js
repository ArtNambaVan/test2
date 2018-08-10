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



