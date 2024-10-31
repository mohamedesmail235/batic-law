baticApp.list_view['pos-closing-entry'] = {
    columns: [
        {
            name: 'name',
            label: baticApp.app.__lang('Name'),
            template: `<a class="docname-link" ui-sref="app.form({parent:current_route_params.parent,doctype:'pos-closing-entry',type:'view',docname:row.name})">{{row.name}}</a>`
        },
        {
            name: 'docstatus',
            label: baticApp.app.__lang('Status'),
            template: '<span class="indicator-pill" ng-class="listView.list.indicator(row.docstatus).color">{{listView.list.indicator(row.docstatus).label}}</span>'
        },
        {
            name: 'period_start_date',
            label: baticApp.app.__lang('Period Start Date'),
            template: '{{row.period_start_date}}'
        },
        {
            name: 'pos_profile',
            label: baticApp.app.__lang('POS Profile'),
            template: '{{row.pos_profile}}'
        },
        {
            name: 'posting_date',
            label: baticApp.app.__lang('Posting Date'),
            template: '<div style="width:100px;"><i class="far fa-calendar-alt"></i> {{row.posting_date}}</div>'
        }
    ],
    status: {
        '0': {
            label: baticApp.app.__lang('Draft'),
            color: 'gray'
        },
        '1': {
            label: baticApp.app.__lang('Open'),
            color: 'blue'
        },
        'Closed': {
            label: baticApp.app.__lang('Closed'),
            color: 'orange'
        },
        '2': {
            label: baticApp.app.__lang('Cancelled'),
            color: 'red'
        }
    }
};
