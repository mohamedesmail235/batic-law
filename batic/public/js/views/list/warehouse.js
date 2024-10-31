baticApp.list_view['warehouse'] = {
    columns: [
        {
            name: 'warehouse_name',
            label: baticApp.app.__lang('Warehouse Name'),
            template: `<a class="docname-link" ui-sref="app.form({parent:current_route_params.parent,doctype:'warehouse',type:'view',docname:row.name})">{{row.warehouse_name}}</a>`
        },
        {
            name: 'disabled',
            label: baticApp.app.__lang('Status'),
            template: '<span class="indicator-pill" ng-class="listView.list.indicator(row.disabled).color">{{listView.list.indicator(row.disabled).label}}</span>'
        },
        {
            name: 'is_group',
            label: baticApp.app.__lang('Is Group'),
            template: `<i class="far" ng-class="(row.is_group)?'fa-check-square text-success':'fa-square text-secondary'"></i>`
        },
        {
            name: 'company',
            label: baticApp.app.__lang('Company'),
            template: '{{row.company}}'
        }
    ],
    status: {
        '0': {
            label: baticApp.app.__lang('Enabled'),
            color: 'blue'
        },
        '1': {
            label: baticApp.app.__lang('Disabled'),
            color: 'gray'
        }
    }
};
