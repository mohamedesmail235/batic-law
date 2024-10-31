baticApp.list_view['pos-offer'] = {
    columns: [
        {
            name: 'name',
            label: baticApp.app.__lang('Name'),
            template: `<a class="docname-link" ui-sref="app.form({parent:current_route_params.parent,doctype:current_route_params.doctype,type:'view',docname:row.name})">{{row.name}}</a>`
        },
        {
            name: 'disable',
            label: baticApp.app.__lang('Status'),
            template: '<span class="indicator-pill" ng-class="listView.list.indicator(row.disable).color">{{listView.list.indicator(row.disable).label}}</span>'
        },
        {
            name: 'offer',
            label: baticApp.app.__lang('Offer Type'),
            template: '{{row.offer}}'
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
