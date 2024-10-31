baticApp.list_view['purchase-invoice'] = {
    columns: [
        {
            name: 'name',
            label: baticApp.app.__lang('Name'),
            template: `<a class="docname-link" ui-sref="app.form({parent:current_route_params.parent,doctype:'purchase-invoice',type:'view',docname:row.name})">{{row.name}}</a>`
        },
        {
            name: 'docstatus',
            label: baticApp.app.__lang('Status'),
            template: '<span class="indicator-pill" ng-class="listView.list.indicator(row.status).color">{{listView.list.indicator(row.status).label}}</span>'
        },
        {
            name: 'supplier_name',
            label: baticApp.app.__lang('Supplier'),
            template: '{{row.supplier_name}}'
        },
        {
            name: 'grand_total',
            label: baticApp.app.__lang('Grand Total'),
            template: '{{row.grand_total | number:2}} {{app.defaults.currency}}'
        },
        {
            name: 'posting_date',
            label: baticApp.app.__lang('Posting Date'),
            template: '<div style="width:100px;"><i class="far fa-calendar-alt"></i> {{row.posting_date}}</div>'
        }
    ],
    status: {
        'Draft': {
            label: baticApp.app.__lang('Draft'),
            color: 'gray'
        },
        'Return': {
            label: baticApp.app.__lang('Return'),
            color: 'dark-gray'
        },
        'Credit Note Issued': {
            label: baticApp.app.__lang('Credit Note Issued'),
            color: 'dark'
        },
        'Internal Transfer': {
            label: baticApp.app.__lang('Internal Transfer'),
            color: 'gray'
        },
        'Paid': {
            label: baticApp.app.__lang('Paid'),
            color: 'green'
        },
        'Partly Paid': {
            label: baticApp.app.__lang('Paid'),
            color: 'green'
        },
        'Partly Paid and Discounted': {
            label: baticApp.app.__lang('Partly Paid and Discounted'),
            color: 'green'
        },
        'Unpaid': {
            label: baticApp.app.__lang('Unpaid'),
            color: 'yellow'
        },
        'Unpaid and Discounted': {
            label: baticApp.app.__lang('Unpaid and Discounted'),
            color: 'yellow'
        },
        'Overdue': {
            label: baticApp.app.__lang('Overdue'),
            color: 'orange'
        },
        'Overdue and Discounted': {
            label: baticApp.app.__lang('Overdue and Discounted'),
            color: 'orange'
        },
        'Cancelled': {
            label: baticApp.app.__lang('Cancelled'),
            color: 'red'
        }
    }
};
