baticApp.list_view['customer-group'] = {
    columns: [
        {
            name: 'name',
            label: baticApp.app.__lang('Name'),
            template: `<a class="docname-link" ui-sref="app.form({parent:current_route_params.parent,doctype:'customer-group',type:'view',docname:row.name})">{{row.customer_group_name}}</a>`
        },
        {
            name: 'parent_customer_group',
            label: baticApp.app.__lang('Parent Group'),
            template: '{{row.parent_customer_group}}'
        },
        {
            name: 'is_group',
            label: baticApp.app.__lang('Is Group'),
            template: `<i class="far" ng-class="(row.is_group)?'fa-check-square text-success':'fa-square text-secondary'"></i>`
        }
    ]
};
