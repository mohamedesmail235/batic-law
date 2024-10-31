baticApp.list_view['item'] = {
    columns: [
        {
            name: 'item_name',
            label: baticApp.app.__lang('Item Name'),
            template: `<a class="docname-link d-flex align-items-center" ui-sref="app.form({parent:current_route_params.parent,doctype:'item',type:'view',docname:row.name})"> 
                             <div class="list-thumbnail"><div class="centered"><img ng-src="{{(row.image)?row.image:'/assets/batic/images/null.png'}}"></div></div>
                             <div> 
                                {{row.item_name}}
                                <span class="d-block text-secondary font-s-13 font-w-500 text-decoration-none mt-5px"><i class="far fa-barcode"></i> {{row.item_code}}</span>
                             </div>
                           </a>`,
            width: '50%'
        },
        {
            name: 'disabled',
            label: baticApp.app.__lang('Status'),
            template: '<span class="indicator-pill" ng-class="listView.list.indicator(row.disabled).color">{{listView.list.indicator(row.disabled).label}}</span>'
        },
        {
            name: 'item_group',
            label: baticApp.app.__lang('Item Group'),
            template: '{{row.item_group}}'
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
