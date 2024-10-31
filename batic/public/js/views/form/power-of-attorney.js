baticApp.forms['power-of-attorney'] = {
    form: [
        {
            type: 'row',
            fields: [
                {
                    col: 6,
                    field: {
                        name: 'poa_no',
                        title: baticApp.app.__lang('POA No'),
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
                        link: {
                            txt: '',
                            doctype: 'Customer',
                            reference_doctype: 'Power of Attorney',
                            ignore_user_permissions: 0,
                            page_length: 10
                        },
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'issue_date_in_hijri',
                        title: baticApp.app.__lang('Issue Date in Hijri'),
                        type: 'Data',
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'expire_date_in_hijri',
                        title: baticApp.app.__lang('Expire Date in Hijri'),
                        type: 'Data',
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'legal_document',
                        title: baticApp.app.__lang('Legal Document'),
                        type: 'Attach File',
                        required: false,
                    }
                },
                {
                    col: 12,
                    field: {
                        name: 'agent',
                        title: baticApp.app.__lang('Agent'),
                        type: 'Table',
                        doctype: 'PoaAgentTable',
                        addButtonTitle: baticApp.app.__lang('Add Agent'),
                        fields: [
                            {
                                name: 'employee',
                                title: baticApp.app.__lang('Employee'),
                                type: 'Link',
                                link: {
                                    txt: '',
                                    doctype: 'Employee',
                                    reference_doctype: 'PoaAgentTable',
                                    ignore_user_permissions: 0,
                                    page_length: 10
                                },
                                required: true
                            },
                        ]
                    }
                },
                {
                    col: 12,
                    field: {
                        name: 'description',
                        title: baticApp.app.__lang('Description'),
                        type: 'Small Text',
                        required: false,
                    }
                },
            ]
        }
    ]
}
