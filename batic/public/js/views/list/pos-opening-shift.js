baticApp.list_view['pos-opening-shift'] = {
    columns: [
        {
            name: 'name',
            label: baticApp.app.__lang('Name'),
            template: `<a class="docname-link" ui-sref="app.form({parent:current_route_params.parent,doctype:current_route_params.doctype,type:'view',docname:row.name})">{{row.name}}</a>`
        },
        {
            name: 'status',
            label: baticApp.app.__lang('Status'),
            template: '<span class="indicator-pill" ng-class="listView.list.indicator(row.status).color">{{listView.list.indicator(row.status).label}}</span>'
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
            name: 'posting_date',
            label: baticApp.app.__lang('Posting Date'),
            template: '<div style="width:100px;"><i class="far fa-calendar-alt"></i> {{row.posting_date}}</div>'
        },
    ],
    status: {
        'Draft': {
            label: baticApp.app.__lang('Draft'),
            color: 'gray'
        },
        'Open': {
            label: baticApp.app.__lang('Open'),
            color: 'orange'
        },
        'Closed': {
            label: baticApp.app.__lang('Closed'),
            color: 'green'
        },
        'Cancelled': {
            label: baticApp.app.__lang('Cancelled'),
            color: 'red'
        }
    }
};
