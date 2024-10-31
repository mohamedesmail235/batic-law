/*
 *  Setup Controller
 */

angular.module('baticNgApp', []).controller("setupController", function ($scope, $rootScope, $http, $state, $timeout, $localStorage, toastr, Desktop) {

    let Ctrl = this;
    let widget = $('.card.card-page');

    Ctrl.view = 'view';

    $scope.reports = {};

    $rootScope.$watch('app.workspaces', function (workspaces) {
        if (workspaces.length) {
            workspaces.map(workspace => {
                Desktop.get_workspace_setup(workspace.name).then(function (response) {
                    $scope.reports[workspace.name] = response.data.message;
                });
            });
        }
    }, true);

});
