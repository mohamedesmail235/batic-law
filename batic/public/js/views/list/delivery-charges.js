baticApp.list_view['delivery-charges'] = {
    columns: [
        {
            name: 'name',
            label: baticApp.app.__lang('ID'),
            template: `<a class="docname-link" ui-sref="app.form({parent:current_route_params.parent,doctype:current_route_params.doctype,type:'view',docname:row.name})">{{row.name}}</a>`
        },
        {
            name: 'disabled',
            label: baticApp.app.__lang('Status'),
            template: '<span class="indicator-pill" ng-class="listView.list.indicator(row.disabled).color">{{listView.list.indicator(row.disabled).label}}</span>'
        },
        {
            name: 'default_rate',
            label: baticApp.app.__lang('Default Rate'),
            template: '{{row.default_rate}} {{app.defaults.currency}}'
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
