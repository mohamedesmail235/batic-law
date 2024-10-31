baticApp.list_view['supplier'] = {
    columns: [
        {
            name: 'supplier_name',
            label: baticApp.app.__lang('Supplier Name'),
            template: `<a class="docname-link d-flex align-items-center" ui-sref="app.form({parent:current_route_params.parent,doctype:'supplier',type:'view',docname:row.name})"> 
                        <div class="list-thumbnail"><div class="centered"><img ng-src="{{(row.image)?row.image:'/assets/batic/images/user.png'}}"></div> </div>  {{row.supplier_name}}
                       </a>`
        },
        {
            name: 'disabled',
            label: baticApp.app.__lang('Status'),
            template: '<span class="indicator-pill" ng-class="listView.list.indicator(row.disabled).color">{{listView.list.indicator(row.disabled).label}}</span>'
        },
        {
            name: 'supplier_group',
            label: baticApp.app.__lang('Supplier Group'),
            template: '{{row.supplier_group}}'
        },
        {
            name: 'country',
            label: baticApp.app.__lang('Country'),
            template: '{{row.country}}'
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
