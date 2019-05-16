module.exports = {
    logined_user_id: null,

    login_user: function (id) {
        this.logined_user_id = id;
        console.log("User logined: ", id);
    },

    logout_user: function () {
        console.log("User logined out: ", this.logined_user_id);
        this.logined_user_id = null;
    },

    get_logined_user_id: function () {
        return this.logined_user_id;
    }
};