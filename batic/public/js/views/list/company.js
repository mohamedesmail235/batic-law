baticApp.list_view['company'] = {
    columns: [
        {
            name: 'name',
            label: baticApp.app.__lang('Name'),
            template: `<a class="docname-link" ui-sref="app.form({doctype:'company',type:'view',docname:row.name})">{{row.company_name}}</a>`
        },
        {
            name: 'parent_company',
            label: baticApp.app.__lang('Parent Company'),
            template: '{{row.parent_company}}'
        },
        {
            name: 'country',
            label: baticApp.app.__lang('Country'),
            template: '{{row.country}}'
        }
    ]
};
