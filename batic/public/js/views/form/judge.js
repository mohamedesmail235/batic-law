baticApp.forms['judge'] = {
    form: [
        {
            type: 'row',
            fields: [
                {
                    col: 6,
                    field: {
                        name: 'judge_name',
                        title: baticApp.app.__lang('Judge Name'),
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
                            reference_doctype: 'Judge',
                            ignore_user_permissions: 0,
                            page_length: 10
                        },
                        required: false
                    }
                }
            ]
        }
    ]
}
