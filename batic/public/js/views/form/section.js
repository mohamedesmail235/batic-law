baticApp.forms['section'] = {
    form: [
        {
            type: 'row',
            fields: [
                {
                    col: 6,
                    field: {
                        name: 'name1',
                        title: baticApp.app.__lang('Court Name'),
                        type: 'Data',
                        required: true
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'court',
                        title: baticApp.app.__lang('Court'),
                        type: 'Link',
                        link: {
                            txt: '',
                            doctype: 'Court',
                            reference_doctype: 'Section',
                            ignore_user_permissions: 0,
                            page_length: 10
                        },
                        required: true
                    }
                }
            ]
        }
    ]
}
