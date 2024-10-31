/*
 *  Reports Controller
 */

angular.module('baticNgApp', []).controller("reportsController", function ($scope, $rootScope, $http, $state, $timeout, $localStorage, Desktop) {

    let Ctrl = this;
    let widget = $('.card.card-page');
    $scope.reports = {};
    $rootScope.$watch('app.workspaces', function (workspaces) {
        console.log('$rootScope.app.workspaces', workspaces)
        if (workspaces.length) {
            workspaces.map(workspace => {
                Desktop.get_workspace_reports(workspace.name).then(function (response) {
                    if (response.data && response.data.message)
                        $scope.reports[workspace.name] = response.data.message;
                });
            });
        }
    }, true);

});
