/*
 *  Tree Controller
 */

angular.module('baticNgApp', []).controller("treeController", function ($scope, $rootScope, $http, $state, $timeout, Doctype) {

    let Ctrl = this;
    let widget = $('.card.card-page');

    Ctrl.companies = ($scope.$resolve.api.companies && $scope.$resolve.api.companies.data && $scope.$resolve.api.companies.data.message) ? $scope.$resolve.api.companies.data.message : [];

    $rootScope.treeView = {
        workspace: $scope.$resolve.workspace,
        doctype: $scope.$resolve.doctype,
        toolbar: {
            is_expanded: false,
            new: function () {
                $state.transitionTo('app.form', {workspace: $scope.$resolve.workspace, doctype: $scope.$resolve.doctype, type: 'new', docname: ('new-' + $scope.$resolve.doctype + '-1')});
            },
            refresh: function () {
                let widget = $('.card.card-page');
                widget.addClass('loading');
                NProgress.start();
                $state.reload();
            },
            expand_all: function () {
                this.is_expanded = true;
                $('.tree-view').jstree("open_all");
            },
            collapse_all: function () {
                this.is_expanded = false;
                $('.tree-view').jstree("close_all");
            }
        },
        filters: {
            company: baticApp.app.defaults.company
        },
        tree: {
            data: [],
            view: function () {
                const $this = this;
                let tree_list = [];
                let result = groupBy($this.data, account => account.parent_account);
                angular.forEach(result, (row, key) => {
                    row.map(item => {
                        if (!item.parent_account) {
                            item['child'] = result[item.name] || [];
                            tree_list.push(item);
                        }
                    });
                });
                $this.get_view_child(tree_list, result);
                $this.get_view_child(tree_list, result);
                return tree_list;
            },
            get_view_child: function (tree_list, result) {
                const $this = this;
                let child_list = [];
                if (tree_list && tree_list.length) {
                    tree_list.map(item => {
                        if (item.child && item.child.length) {
                            item.child.map(child => {
                                if (child.child && child.child.length) {
                                    child.child.map(sub_child => {
                                        if (sub_child.child && sub_child.child.length) {
                                            $this.get_view_child(sub_child);
                                        } else {
                                            sub_child['child'] = result[sub_child.name] || [];
                                            child_list.push(sub_child);
                                        }
                                    });
                                } else {
                                    child['child'] = result[child.name] || [];
                                    child_list.push(child);
                                }
                            })
                        }
                    });
                }
            }
        },
        modal: {
            form: {
                is_loading: false,
                data: {},
                submit: function ($event) {
                    $event.preventDefault();
                    frappe.call({
                        method: 'erpnext.accounts.utils.add_ac',
                        args: {
                            doctype: 'Account',
                            company: $rootScope.treeView.modal.form.data.company,
                            account_name: $rootScope.treeView.modal.form.data.account_name,
                            is_group: $rootScope.treeView.modal.form.data.is_group,
                            parent: $rootScope.treeView.modal.form.data.parent_account,
                            is_root: false
                        },
                        callback: ({message}) => {
                            frappe.show_alert({message: baticApp.app.__lang("Account has been created"), indicator: 'green'});
                            $('#newAccountModal').modal('hide');
                            $rootScope.view_doctype($state, $scope.$resolve.workspace, $scope.$resolve.doctype, {
                                name: message
                            });
                        },
                        error: ({message}) => {
                            console.log('add_ac==Error', message)
                        },
                    })
                }
            }
        }
    };

    // let groupBy = function (xs, key) {
    //     return xs.reduce(function (rv, x) {
    //         (rv[x[key]] = rv[x[key]] || []).push(x);
    //         return rv;
    //     }, {});
    // };

    // function groupBy(list, keyGetter) {
    //     const map = new Map();
    //     list.forEach((item) => {
    //         const key = keyGetter(item) || 'no_parent';
    //         const collection = map.get(key);
    //         if (!collection) {
    //             map.set(key, [item]);
    //         } else {
    //             collection.push(item);
    //         }
    //     });
    //     return map;
    // }

    const groupBy = function (array, key = '') {
        return _.mapValues(_.groupBy(array, key), list => list.map(item => _.omit(item, key)))
    }

    function render_tree_view(list) {
        let li = '<ul>';
        if (list) {
            list.map(item => {
                if (item.is_group == 1) {
                    li += `<li data-jstree='{"type":"folder"}' data-item-type="folder" data-item-name="${item.name}">
                                ${item.name}
                                ${render_tree_view(item.child)}
                            </li>`;
                } else {
                    li += `<li data-jstree='{"type":"file"}' data-item-type="file" data-item-name="${item.name}">
                            ${item.name}
                            </li>`;
                }
            });
        }
        li += '</ul>';
        return li;
    }


    $scope.$watch('treeView.filters.company', function (company) {
        NProgress.start();
        Doctype.get_list(capitalizeText($scope.$resolve.doctype.replace(/-/g, ' ')), {company: company}, ['*'], 'name asc').then(function (response) {
            NProgress.done();
            $rootScope.treeView.tree.data = response.data.message;
            $('.tree-view').empty();
            $timeout(() => {
                $('.tree-view').jstree('destroy').html(render_tree_view($rootScope.treeView.tree.view()));
                $('.tree-view').jstree({
                    core: {
                        expand_selected_onload: true,
                        dblclick_toggle: true,
                    },
                    types: {
                        folder: {
                            icon: "far fa-folder"
                        },
                        file: {
                            icon: "far fa-file-alt"
                        },
                    },
                    plugins: ["types", "search"]
                });
                widget.removeClass('loading');
            }, 500);
        });
    }, true);

    $('.tree-view').on('select_node.jstree', function ($event, data) {
        $(".tree-view").jstree('toggle_node', data.node);
        $(".tree-view").jstree('deselect_node', data.node);
        $('.tree-view .jstree-node').each(function () {
            let add_btn = '';
            if ($(this).data('item-type') == 'folder') {
                add_btn = `<button class="btn btn-sm btn-light btn-add">${__('Add Child')}</button>`;
            }
            $('.jstree-anchor', this).next('.tree-edit-buttons').remove();
            $('.jstree-anchor', this).after(` <div class="tree-edit-buttons">
                                                        <button class="btn btn-sm btn-light btn-edit">${__('Edit')}</button>
                                                        ${add_btn}
                                                     </div>`);
        });
    });

    $('.tree-view').on('click', '.jstree-anchor', function ($event) {
        let link = $(this);
        let li = link.parent();
        $('.jstree-anchor', '.tree-view').removeClass('jstree-has-clicked');
        setTimeout(function () {
            link.addClass('jstree-has-clicked');
            if (!$('.jstree-icon', link).hasClass('fa-file-alt')) {
                if (li.hasClass('jstree-open')) {
                    $('.jstree-icon', link).removeClass('fa-folder').addClass('fa-folder-open');
                } else {
                    $('.jstree-icon', link).removeClass('fa-folder-open').addClass('fa-folder');
                }
            }
        }, 1);
    });


    let to = false;
    $(document).on('input', '.input-tree-search', function () {
        if (to) {
            clearTimeout(to);
        }
        to = setTimeout(() => {
            $('.tree-view').jstree(true).search($(this).val());
        }, 250);
    });

    $(document).on('click', '.tree-edit-buttons .btn-edit', function ($event) {
        let account_id = $(this).parents('.jstree-node').data('item-name');
        $rootScope.view_doctype($state, $scope.$resolve.workspace, $scope.$resolve.doctype, {
            name: account_id
        });
    })

    $(document).on('click', '.tree-edit-buttons .btn-add', function ($event) {
        let account_id = $(this).parents('.jstree-node').data('item-name');
        $('#newAccountModal').modal('show');
        $rootScope.treeView.modal.form.data.account_name = '';
        $rootScope.treeView.modal.form.data.is_group = 0;
        $rootScope.treeView.modal.form.data.company = $rootScope.app.defaults.company;
        $rootScope.treeView.modal.form.data.parent_account = account_id;
    })

});
