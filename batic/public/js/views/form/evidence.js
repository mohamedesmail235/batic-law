baticApp.forms['evidence'] = {
    form: [
        {
            type: 'row',
            fields: [
                {
                    col: 6,
                    field: {
                        name: 'case',
                        title: baticApp.app.__lang('Case'),
                        type: 'Link',
                        link: {
                            txt: '',
                            doctype: 'Case',
                            reference_doctype: 'Evidence',
                            ignore_user_permissions: 0,
                            page_length: 10
                        },
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'attach_document',
                        title: baticApp.app.__lang('Attach Document'),
                        type: 'Attach File',
                        required: false,
                    }
                },
                {
                    col: 12,
                    field: {
                        name: 'description',
                        title: baticApp.app.__lang('Description'),
                        type: 'Editor Text',
                        required: true
                    }
                }
            ]
        }
    ]
}
