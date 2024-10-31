baticApp.list_view['item-tax-template'] = {
    columns: [
        {
            name: 'title',
            label: baticApp.app.__lang('Title'),
            template: `<a class="docname-link" ui-sref="app.form({parent:current_route_params.parent,doctype:current_route_params.doctype,type:'view',docname:row.name})">{{row.title}}</a>`
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
