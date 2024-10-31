baticApp.list_view['pos-profile'] = {
    columns: [
        {
            name: 'pos_name',
            label: baticApp.app.__lang('Name'),
            template: `<a class="docname-link" ui-sref="app.form({parent:current_route_params.parent,doctype:'pos-profile',type:'view',docname:row.name})">{{row.name}}</a>`
        },
        {
            name: 'disabled',
            label: baticApp.app.__lang('Status'),
            template: '<span class="indicator-pill" ng-class="listView.list.indicator(row.disabled).color">{{listView.list.indicator(row.disabled).label}}</span>'
        },
        {
            name: 'company',
            label: baticApp.app.__lang('Company'),
            template: '{{row.company}}'
        },
        {
            name: 'currency',
            label: baticApp.app.__lang('Currency'),
            template: '{{row.currency}}'
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
