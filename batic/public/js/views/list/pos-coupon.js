baticApp.list_view['pos-coupon'] = {
    columns: [
        {
            name: 'coupon_code',
            label: baticApp.app.__lang('Coupon Code'),
            template: `<a class="docname-link" ui-sref="app.form({parent:current_route_params.parent,doctype:current_route_params.doctype,type:'view',docname:row.name})">{{row.coupon_code}}</a>`
        },
        {
            name: 'coupon_type',
            label: baticApp.app.__lang('Coupon Type'),
            template: '{{row.coupon_type}}'
        },
        {
            name: 'valid_from',
            label: baticApp.app.__lang('Valid From'),
            template: '{{row.valid_from}}'
        },
        {
            name: 'valid_upto',
            label: baticApp.app.__lang('Valid Upto'),
            template: '{{row.valid_upto}}'
        },
        {
            name: 'used',
            label: baticApp.app.__lang('Used'),
            template: '{{row.used}}'
        }
    ]
};
