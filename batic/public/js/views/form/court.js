baticApp.forms['court'] = {
    form: [
        {
            type: 'row',
            fields: [
                {
                    col: 6,
                    field: {
                        name: 'court_name',
                        title: baticApp.app.__lang('Court Name'),
                        type: 'Data',
                        required: true
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'country',
                        title: baticApp.app.__lang('Country'),
                        type: 'Data',
                        required: false
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'city',
                        title: baticApp.app.__lang('City'),
                        type: 'Data',
                        required: false
                    }
                }
            ]
        }
    ]
}
