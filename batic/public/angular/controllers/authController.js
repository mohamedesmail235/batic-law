/*
 * Auth Controller
*/

angular.module('baticNgApp', []).controller("authController", function ($scope, $rootScope, $http, $timeout, $state, User) {

    let Ctrl = this;

    $scope.Auth = {
        form: {
            is_loading: false,
            show_password: false,
            login_error: '',
            data: {
                email: '',
                password: ''
            },
            submit($event) {
                $event.preventDefault();
                this.is_loading = true;
                User.login({
                    usr: frappe.utils.xss_sanitise((this.data.email).trim()),
                    pwd: this.data.password
                }).then((response) => {
                    if (response.status && response.status === 200) {
                        window.location.reload();
                    } else {
                        this.is_loading = false;
                        if (response.data && response.data.message) {
                            this.login_error = response.data.message;
                        } else {
                            this.login_error = 'Invalid login credentials';
                        }
                    }
                });
            },
            showPassword() {
                if (this.show_password) {
                    this.show_password = false;
                } else {
                    this.show_password = true;
                }
            }
        }
    }

});
