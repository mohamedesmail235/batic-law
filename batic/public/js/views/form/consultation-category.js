baticApp.forms['consultation-category'] = {
    form: [
        {
            type: 'row',
            fields: [
                {
                    col: 6,
                    field: {
                        name: 'name1',
                        title: baticApp.app.__lang('Name'),
                        type: 'Data',
                        required: true
                    }
                },
                {
                    col: 3,
                    field: {
                        name: 'old_parent',
                        title: baticApp.app.__lang('Old Parent'),
                        type: 'Link',
                        link: {
                            txt: '',
                            doctype: 'Consultation Category',
                            reference_doctype: 'Consultation Category',
                            ignore_user_permissions: 0,
                            page_length: 10
                        },
                        required: false
                    }
                },
                {
                    col: 3,
                    field: {
                        name: 'parent_consultation_category',
                        title: baticApp.app.__lang('Parent Consultation Category'),
                        type: 'Link',
                        link: {
                            txt: '',
                            doctype: 'Consultation Category',
                            reference_doctype: 'Consultation Category',
                            ignore_user_permissions: 0,
                            page_length: 10
                        },
                        required: false
                    }
                },
                {
                    col: 3,
                    field: {
                        name: 'is_group',
                        title: baticApp.app.__lang('Is Group'),
                        type: 'Check',
                    }
                }
            ]
        }
    ]
}
