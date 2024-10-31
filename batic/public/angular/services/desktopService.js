/*
* Desktop Service
*/

angular.module('services.api.desktop', []).service('Desktop', function ($http) {
    return {
        get_desktop_page: function (module) {
            return $http.post(frappe_api_url('frappe.desk.desktop.get_desktop_page'), {page: module});
        },
        get_workspaces: function () {
            return $http.post(api_url('get_workspaces'));
        },
        get_workspace: function (workspace) {
            return $http.post(api_url('get_workspace'), {workspace: workspace});
        },
        get_workspace_reports: function (workspace) {
            return $http.post(api_url('get_workspace_reports'), {workspace: workspace});
        },
        get_workspace_setup: function (workspace) {
            return $http.post(api_url('get_workspace_setup'), {workspace: workspace});
        }
    }
});
