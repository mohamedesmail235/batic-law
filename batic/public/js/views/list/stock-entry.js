baticApp.list_view['stock-entry'] = {
    columns: [
        {
            name: 'name',
            label: baticApp.app.__lang('Title'),
            template: `<a class="docname-link" ui-sref="app.form({parent:current_route_params.parent,doctype:'stock-entry',type:'view',docname:row.name})">{{row.name}}</a>`
        },
        {
            name: 'docstatus',
            label: baticApp.app.__lang('Status'),
            template: '<span class="indicator-pill" ng-class="listView.list.indicator(row.docstatus).color">{{listView.list.indicator(row.docstatus).label}}</span>'
        },
        {
            name: 'stock_entry_type',
            label: baticApp.app.__lang('Stock Entry Type'),
            template: '{{row.stock_entry_type}}'
        },
        {
            name: 'company',
            label: baticApp.app.__lang('Company'),
            template: '{{row.company}}'
        },
        {
            name: 'posting_date',
            label: baticApp.app.__lang('Posting Date'),
            template: '<div style="width:100px;"><i class="far fa-calendar-alt"></i> {{row.posting_date}}</div>'
        },
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
