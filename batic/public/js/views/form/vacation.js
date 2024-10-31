baticApp.forms['vacation'] = {
    form: [
        {
            type: 'row',
            fields: [
                {
                    col: 6,
                    field: {
                        name: 'employee',
                        title: baticApp.app.__lang('Employee'),
                        type: 'Link',
                        link: {
                            txt: '',
                            doctype: 'Employee',
                            reference_doctype: 'Vacation',
                            ignore_user_permissions: 0,
                            page_length: 10
                        },
                        required: true
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'reason',
                        title: baticApp.app.__lang('Reason'),
                        type: 'Select',
                        required: true
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'start_date',
                        title: baticApp.app.__lang('Start Date'),
                        type: 'Date',
                        required: true
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'end_date',
                        title: baticApp.app.__lang('End Date'),
                        type: 'Date',
                        required: true
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'status',
                        title: baticApp.app.__lang('Status'),
                        type: 'Select',
                        required: true
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'description',
                        title: baticApp.app.__lang('Description'),
                        type: 'Small Text',
                        required: true
                    }
                }
            ]
        }
    ]
}
