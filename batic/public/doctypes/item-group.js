baticApp.doctypes['item-group'] = {
    load: function (form, scope) {

    },
    data: function ($rootScope) {
        return {
            "image": stringVal($rootScope.formView.form.data.image),
            "item_group_name": stringVal($rootScope.formView.form.data.item_group_name),
            "parent_item_group": stringVal($rootScope.formView.form.data.parent_item_group),
            "is_group": ($rootScope.formView.form.data.is_group == 1) ? 1 : 0
        };
    },
    events: function (form_data, $rootScope, $scope, $http, $timeout) {

    }
}
