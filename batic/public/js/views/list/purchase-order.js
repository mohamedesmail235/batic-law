baticApp.list_view['purchase-order'] = {
    columns: [
        {
            name: 'name',
            label: baticApp.app.__lang('Supplier Name'),
            template: `<a class="docname-link" ui-sref="app.form({parent:current_route_params.parent,doctype:'purchase-order',type:'view',docname:row.name})">{{row.supplier_name}}</a>`
        },
        {
            name: 'docstatus',
            label: baticApp.app.__lang('Status'),
            template: '<span class="indicator-pill" ng-class="listView.list.indicator(row.docstatus).color">{{listView.list.indicator(row.docstatus).label}}</span>'
        },
        {
            name: 'transaction_date',
            label: baticApp.app.__lang('Date'),
            template: '{{row.transaction_date}}'
        },
        {
            name: 'grand_total',
            label: baticApp.app.__lang('Grand Total'),
            template: '{{row.grand_total | number:2}} {{app.defaults.currency}}'
        }
    ],
    status: {
        '0': {
            label: baticApp.app.__lang('Draft'),
            color: 'gray'
        },
        '1': {
            label: baticApp.app.__lang('Submitted'),
            color: 'blue'
        },
        '2': {
            label: baticApp.app.__lang('Cancelled'),
            color: 'red'
        }
    }
};
