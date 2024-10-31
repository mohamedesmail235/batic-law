baticApp.list_view['price-list'] = {
    columns: [
        {
            name: 'price_list_name',
            label: baticApp.app.__lang('Item Name'),
            template: `<a class="docname-link" ui-sref="app.form({parent:current_route_params.parent,doctype:'price-list',type:'view',docname:row.name})">{{row.price_list_name}}</a>`
        },
        {
            name: 'enabled',
            label: baticApp.app.__lang('Status'),
            template: '<span class="indicator-pill" ng-class="listView.list.indicator(row.enabled).color">{{listView.list.indicator(row.enabled).label}}</span>'
        },
        {
            name: 'currency',
            label: baticApp.app.__lang('Currency'),
            template: '{{row.currency}}'
        },
        {
            name: 'buying',
            label: baticApp.app.__lang('Buying'),
            template: `<i class="far" ng-class="(row.buying)?'fa-check-square text-success':'fa-square text-secondary'"></i>`
        },
        {
            name: 'selling',
            label: baticApp.app.__lang('Selling'),
            template: `<i class="far" ng-class="(row.selling)?'fa-check-square text-success':'fa-square text-secondary'"></i>`
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
