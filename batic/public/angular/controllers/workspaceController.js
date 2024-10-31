/*
 * Workspace Controller
*/

angular.module('baticNgApp', []).controller("workspaceController", function ($scope, $rootScope, $http, $timeout, $state, toastr) {

    let Ctrl = this;
    Ctrl.workspace = baticApp.workspace[$scope.$resolve.workspace];
    Ctrl.view = 'view';

    $scope.doctype_link = function (workspace, doctype, is_single = false, docname = '', form_type = 'view') {
        if (is_single) {
            return $state.transitionTo('app.form', {workspace: workspace, doctype: doctype, type: form_type, docname: docname});
        } else {
            return $state.transitionTo('app.list', {workspace: workspace, doctype: doctype});
        }
    }

    $scope.check_setup_count = function (shortcuts) {
        return shortcuts.filter(shortcut => shortcut.is_setup == 1).length;
    }

    $scope.workspace = {
        name: $scope.$resolve.workspace,
        shortcuts: ($scope.$resolve.api.get_workspace && $scope.$resolve.api.get_workspace.data && $scope.$resolve.api.get_workspace.data.message.shortcuts) ? $scope.$resolve.api.get_workspace.data.message.shortcuts : [],
        charts: ($scope.$resolve.api.get_workspace && $scope.$resolve.api.get_workspace.data && $scope.$resolve.api.get_workspace.data.message.charts) ? $scope.$resolve.api.get_workspace.data.message.charts : [],
        reports: ($scope.$resolve.api.get_workspace && $scope.$resolve.api.get_workspace.data && $scope.$resolve.api.get_workspace.data.message.reports) ? $scope.$resolve.api.get_workspace.data.message.reports : [],
    };

    //
    // $timeout(function () {
    //     console.log('$scope.workspace.links', $scope.workspace.links)
    //     new frappe.widget.WidgetGroup({
    //         container: $('.dashboard-layout .charts-container'),
    //         type: "links",
    //         columns: 3,
    //         class_name: "widget-cards",
    //         options: {
    //             allow_sorting: false,
    //             allow_create: false,
    //             allow_delete: false,
    //             allow_hiding: false,
    //             allow_edit: false,
    //         },
    //         widgets: $scope.workspace.links
    //     })
    // }, 3000);

});
