baticApp.list_view['pos-closing-shift'] = {
    columns: [
        {
            name: 'name',
            label: baticApp.app.__lang('Name'),
            template: `<a class="docname-link" ui-sref="app.form({parent:current_route_params.parent,doctype:current_route_params.doctype,type:'view',docname:row.name})">{{row.name}}</a>`
        },
        {
            name: 'docstatus',
            label: baticApp.app.__lang('Status'),
            template: '<span class="indicator-pill" ng-class="listView.list.indicator(row.docstatus).color">{{listView.list.indicator(row.docstatus).label}}</span>'
        },
        {
            name: 'pos_profile',
            label: baticApp.app.__lang('POS Profile'),
            template: '{{row.pos_profile}}'
        },
        {
            name: 'period_start_date',
            label: baticApp.app.__lang('Period Start Date'),
            template: "{{parse_date(row.period_start_date,'dd-MM-yyyy [hh:mm a]')}}"
        },
        {
            name: 'period_end_date',
            label: baticApp.app.__lang('Period End Date'),
            template: "{{parse_date(row.period_end_date,'dd-MM-yyyy [hh:mm a]')}}"
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
