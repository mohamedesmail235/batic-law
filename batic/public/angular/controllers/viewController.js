/*
 *  View Doctype Controller
 */

angular.module('baticNgApp', []).controller("viewController", function ($scope, $rootScope, $http, $state, toastr, Doctype) {

    let Ctrl = this;
    Ctrl.formView = baticApp.forms[$scope.$resolve.workspace][$scope.$resolve.doctype].form;
    $rootScope.getDoctype = $scope.$resolve.api.doctype.data.docs[0];

    $rootScope.formView = {
        workspace: $scope.$resolve.workspace,
        doctype: $scope.$resolve.doctype,
        form_type: $scope.$resolve.form_type,
        toolbar: {
            save: function () {

            },
            refresh: function () {

            }
        },
        form: {
            view: Ctrl.formView,
            data: {}
        },
    };

    $rootScope.fieldTable = {
        is_select_all: false,
        selected_rows: {},
        selected_ids: [],
        scanned_code: '',
        select_id: function () {
            const $this = this;
            let length = $('.child-datatable .table-child tbody tr').length;
            angular.forEach($this.selected_rows, function (value, id) {
                if (value == true) {
                    if (!$this.selected_ids.includes(id))
                        $this.selected_ids.push(id);
                } else {
                    $this.selected_ids.removeItem(id);
                }
            });
            if ($this.selected_ids.length >= length) {
                $this.is_select_all = true;
            } else if ($this.selected_ids.length < length) {
                $this.is_select_all = false;
            }
        },
        select_all: function () {
            if (!this.is_select_all) {
                this.is_select_all = true;
                $('.child-datatable .table-child').each(function () {
                    let table = $(this);
                    $('tbody tr', table).each(function () {
                        $('td:first', this).find('input[type="checkbox"]').prop('checked', false).trigger('click');
                    });
                });
            } else {
                this.is_select_all = false;
                $('.child-datatable .table-child').each(function () {
                    let table = $(this);
                    $('tbody tr', table).each(function () {
                        $('td:first', this).find('input[type="checkbox"]').prop('checked', true).trigger('click');
                    });
                });
            }
        },
        add_row: function (items) {
            items.push({
                uid: new Date().getTime(),
                name: '',
                debit: '',
                credit: '',
                cost_center: '',
                comment: ''
            });
        },
        delete_row: function (items) {
            const $this = this;
            let ids = $this.selected_ids;
            let rows = $this.selected_rows;
            if (ids.length) {
                ids.map((id) => {
                    const index = ids.indexOf(id);
                    delete $this.selected_rows[id];
                    this.is_select_all = false;
                });
                let items_list = items.filter((item) => !ids.includes(String(item.uid)));
                $scope.accounting.form.data.accounting_list = items_list;
            }
            $this.selected_ids = [];
        }
    };

    $rootScope.fieldLink = function (link, txt = '', callback) {
        Doctype.search_link(link.doctype, link.reference_doctype, link.filters, txt).then(function (response) {
            callback(response);
        });
    }

});
