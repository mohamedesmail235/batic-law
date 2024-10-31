baticApp.list_view['mode-of-payment'] = {
    columns: [
        {
            name: 'name',
            label: baticApp.app.__lang('Name'),
            template: `<a class="docname-link" ui-sref="app.form({doctype:'mode-of-payment',type:'view',docname:row.name})">{{row.name}}</a>`
        },
        {
            name: 'disabled',
            label: baticApp.app.__lang('Status'),
            template: '<span class="indicator-pill" ng-class="listView.list.indicator(row.enabled).color">{{listView.list.indicator(row.enabled).label}}</span>'
        },
        {
            name: 'type',
            label: baticApp.app.__lang('Type'),
            template: '{{row.type}}'
        }
    ],
    status: {
        '1': {
            label: baticApp.app.__lang('Enabled'),
            color: 'blue'
        },
        '0': {
            label: baticApp.app.__lang('Disabled'),
            color: 'gray'
        }
    }
};
