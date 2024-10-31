baticApp.list_view['product-bundle'] = {
    columns: [
        {
            name: 'name',
            label: baticApp.app.__lang('Name'),
            template: `<a class="docname-link" ui-sref="app.form({parent:current_route_params.parent,doctype:'product-bundle',type:'view',docname:row.name})">{{row.name}}</a>`
        },
        {
            name: 'description',
            label: baticApp.app.__lang('Description'),
            template: '{{row.description}}'
        }
    ],
    status: {}
};
