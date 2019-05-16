//ГЛОБАЛЬНОЕ ХРАНЕНИЕ ID ЮЗВЕРЯ
let logined_user_id = null;

export function login_user(id) {
    logined_user_id = id
}

export function logout_user() {
    logined_user_id = null;
}

export function get_logined_user_id() {
    return logined_user_id;
}