baticApp.list_view['journal-entry'] = {
    columns: [
        {
            name: 'title',
            label: baticApp.app.__lang('Title'),
            template: `<a class="docname-link" ui-sref="app.form({doctype:'journal-entry',type:'view',docname:row.name})">{{row.title}}</a>`
        },
        {
            name: 'docstatus',
            label: baticApp.app.__lang('Status'),
            template: '<span class="indicator-pill" ng-class="listView.list.indicator(row.docstatus).color">{{listView.list.indicator(row.docstatus).label}}</span>'
        },
        {
            name: 'total_debit',
            label: baticApp.app.__lang('Total Debit'),
            template: '{{row.total_debit}}'
        },
        {
            name: 'posting_date',
            label: baticApp.app.__lang('Posting Date'),
            template: '<div style="width:100px;"><i class="far fa-calendar-alt"></i> {{row.posting_date}}</div>',
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
}
