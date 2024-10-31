baticApp.list_view['item-price'] = {
    columns: [
        {
            name: 'name',
            label: baticApp.app.__lang('Item Name'),
            template: `<a class="docname-link" ui-sref="app.form({parent:current_route_params.parent,doctype:'item-price',type:'view',docname:row.name})">{{row.item_name}}</a>`
        },
        {
            name: 'item_code',
            label: baticApp.app.__lang('Item Code'),
            template: '{{row.item_code}}'
        },
        {
            name: 'price_list_rate',
            label: baticApp.app.__lang('Rate'),
            template: '{{row.price_list_rate | number:2}} {{row.currency}}'
        }
    ]
};
