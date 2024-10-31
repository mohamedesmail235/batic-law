baticApp.forms['project'] = {
    form: [
        {
            type: 'row',
            fields: [
                {
                    col: 6,
                    field: {
                        name: 'naming_series',
                        title: baticApp.app.__lang('Series'),
                        type: 'Select',
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'project_name',
                        title: baticApp.app.__lang('Project Name'),
                        type: 'Data',
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'customer',
                        title: baticApp.app.__lang('Customer'),
                        type: 'Link',
                        doctype: 'Customer',
                        link: {
                            txt: '',
                            doctype: 'Customer',
                            reference_doctype: 'Project',
                            ignore_user_permissions: 0,
                            page_length: 10
                        },
                    }
                },
                {
                    col: 2,
                    field: {
                        name: 'status',
                        title: baticApp.app.__lang('Status'),
                        type: 'Select',
                    }
                },
                {
                    col: 2,
                    field: {
                        name: 'priority',
                        title: baticApp.app.__lang('Priority'),
                        type: 'Select',
                    }
                },
                {
                    col: 2,
                    field: {
                        name: 'is_active',
                        title: baticApp.app.__lang('Is Active'),
                        type: 'Select',
                    }
                },
            ]
        },
        {
            type: 'row',
            fields: [
                {
                    col: 3,
                    field: {
                        name: 'expected_start_date',
                        title: baticApp.app.__lang('Expected Start Date'),
                        type: 'Date',
                    }
                },
                {
                    col: 3,
                    field: {
                        name: 'expected_end_date',
                        title: baticApp.app.__lang('Expected End Date'),
                        type: 'Date',
                    }
                },
            ]
        },
        {
            type: 'row',
            title: baticApp.app.__lang('Notes'),
            fields: [
                {
                    col: 12,
                    field: {
                        name: 'notes',
                        title: baticApp.app.__lang('Notes'),
                        type: 'Small Text'
                    }
                }
            ]
        },
    ]
}
