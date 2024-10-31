/*
* User Service
*/

angular.module('services.api.user', []).service('User', function ($http) {
    return {
        info: function () {
            return $http.post(api_url('get_user_info'), {user: frappe.session.user});
        },
        login: function (args) {
            return $http.post(frappe_api_url('login'), {
                usr: args.usr,
                pwd: args.pwd,
                device: 'mobile'
            });
        },
    }
});
