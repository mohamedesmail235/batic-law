baticApp.list_view['customer'] = {
    columns: [
        {
            name: 'customer_name',
            label: baticApp.app.__lang('Full Name'),
            template: `<a class="docname-link d-flex align-items-center" ui-sref="app.form({parent:current_route_params.parent,doctype:'customer',type:'view',docname:row.name})">
                        <div class="list-thumbnail"><div class="centered"><img ng-src="{{(row.image)?row.image:'/assets/batic/images/user.png'}}"></div> </div>  {{row.customer_name}}
                       </a>`
        },
        {
            name: 'disabled',
            label: baticApp.app.__lang('Status'),
            template: '<span class="indicator-pill" ng-class="listView.list.indicator(row.disabled).color">{{listView.list.indicator(row.disabled).label}}</span>'
        },
        {
            name: 'customer_group',
            label: baticApp.app.__lang('Customer Group'),
            template: '{{row.customer_group}}'
        },
        {
            name: 'territory',
            label: baticApp.app.__lang('Territory'),
            template: '{{row.territory}}'
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
