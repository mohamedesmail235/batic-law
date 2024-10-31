baticApp.list_view['pos-devices-accessories'] = {
    columns: [
        {
            name: 'device_name',
            label: baticApp.app.__lang('Name'),
            template: `<a class="docname-link" ui-sref="app.form({parent:current_route_params.parent,doctype:'pos-devices-accessories',type:'view',docname:row.name})">{{row.device_name}}</a>`
        },
        {
            name: 'device',
            label: baticApp.app.__lang('Device'),
            template: '{{row.device}}'
        },
        {
            name: 'ip',
            label: baticApp.app.__lang('IP'),
            template: '{{row.ip}}'
        },
        {
            name: 'device_type',
            label: baticApp.app.__lang('Device Type'),
            template: '<span class="indicator-pill gray">{{row.device_type}}</span>'
        }
    ]
};
