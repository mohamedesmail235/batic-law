baticApp.list_view['cost-center'] = {
    columns: [
        {
            name: 'name',
            label: baticApp.app.__lang('Name'),
            template: `<a class="docname-link" ui-sref="app.form({doctype:'cost-center',type:'view',docname:row.name})">{{row.name}}</a>`
        },
        {
            name: 'disabled',
            label: baticApp.app.__lang('Status'),
            template: '<span class="indicator-pill" ng-class="listView.list.indicator(row.disabled).color">{{listView.list.indicator(row.disabled).label}}</span>'
        },
        {
            name: 'cost_center_name',
            label: baticApp.app.__lang('Cost Center Name'),
            template: '{{row.cost_center_name}}'
        },
        {
            name: 'parent_cost_center',
            label: baticApp.app.__lang('Cost Center Parent'),
            template: '{{row.parent_cost_center}}'
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
