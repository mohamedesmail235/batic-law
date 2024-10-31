baticApp.list_view['sales-partner'] = {
    columns: [
        {
            name: 'name',
            label: baticApp.app.__lang('Name'),
            template: `<a class="docname-link" ui-sref="app.form({parent:current_route_params.parent,doctype:'sales-partner',type:'view',docname:row.partner_name})">{{row.partner_name}}</a>`
        },
        {
            name: 'partner_type',
            label: baticApp.app.__lang('Partner Type'),
            template: '{{row.partner_type}}'
        },
        {
            name: 'territory',
            label: baticApp.app.__lang('Territory'),
            template: '{{row.territory}}'
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
