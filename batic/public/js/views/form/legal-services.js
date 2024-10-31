baticApp.forms['legal-services'] = {
    form: [
        {
            type: 'row',
            fields: [
                {
                    col: 6,
                    field: {
                        name: 'service_type',
                        title: baticApp.app.__lang('Service Type'),
                        type: 'Select',
                        required: true
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'date',
                        title: baticApp.app.__lang('Date'),
                        type: 'Date',
                        required: true
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'contarct',
                        title: baticApp.app.__lang('Contract'),
                        type: 'Link',
                        link: {
                            txt: '',
                            doctype: 'Contract',
                            reference_doctype: 'Consultations',
                            ignore_user_permissions: 0,
                            filters: {"is_signed": 1},
                            page_length: 10
                        },
                        required: false,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'quotation',
                        title: baticApp.app.__lang('Quotation'),
                        type: 'Link',
                        link: {
                            txt: '',
                            doctype: 'Quotation',
                            reference_doctype: 'Consultations',
                            ignore_user_permissions: 0,
                            filters: {"status": "Open"},
                            page_length: 10
                        },
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'client',
                        title: baticApp.app.__lang('Client'),
                        type: 'Link',
                        link: {
                            txt: '',
                            doctype: 'Customer',
                            reference_doctype: 'Consultations',
                            ignore_user_permissions: 0,
                            page_length: 10
                        },
                        required: true,
                    }
                },
                {
                    col: 12,
                    field: {
                        name: 'agents',
                        title: baticApp.app.__lang('Agents'),
                        type: 'Table',
                        doctype: 'Contract-Agents',
                        addButtonTitle: baticApp.app.__lang('Add Agent'),
                        fields: [
                            {
                                name: 'employee',
                                title: baticApp.app.__lang('Employee'),
                                type: 'Link',
                                link: {
                                    txt: '',
                                    doctype: 'Employee',
                                    reference_doctype: 'EmpOrders',
                                    ignore_user_permissions: 0,
                                    page_length: 10
                                },
                                required: true
                            }
                        ]
                    }
                },
                {
                    col: 12,
                    field: {
                        name: 'service_result',
                        title: baticApp.app.__lang('Service Result'),
                        type: 'Editor Text',
                        required: false
                    }
                },
            ]
        }
    ]
}
