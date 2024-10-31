baticApp.forms['consultations'] = {
    form: [
        {
            type: 'row',
            fields: [
                {
                    col: 6,
                    field: {
                        name: 'date',
                        title: baticApp.app.__lang('Date'),
                        type: 'Date',
                        default_value: baticApp.app.datetime._date('YYYY-MM-DD'),
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'consultation_category',
                        title: baticApp.app.__lang('Consultation Category'),
                        type: 'Link',
                        link: {
                            txt: '',
                            doctype: 'Consultation Category',
                            reference_doctype: 'Consultations',
                            ignore_user_permissions: 0,
                            page_length: 10
                        },
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'contract',
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
                        name: 'consultation_type',
                        title: baticApp.app.__lang('Consultation Type'),
                        type: 'Select',
                        set_only_once: true,
                        required: true
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
                        name: 'customer',
                        title: baticApp.app.__lang('Customer'),
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
                    col: 6,
                    field: {
                        name: 'due_date',
                        title: baticApp.app.__lang('Due Date'),
                        type: 'Date',
                        required: true,
                    }
                },
                {
                    col: 12,
                    field: {
                        name: 'agents',
                        title: baticApp.app.__lang('Team Head Lawyer Agents'),
                        type: 'Table',
                        doctype: 'Contract-Agents',
                        addButtonTitle: baticApp.app.__lang('Add Agent'),
                        fields: [
                            {
                                name: 'agent',
                                title: baticApp.app.__lang('Agent'),
                                type: 'Link',
                                link: {
                                    txt: '',
                                    doctype: 'Employee',
                                    reference_doctype: 'Contract-Agents',
                                    ignore_user_permissions: 0,
                                    page_length: 10,
                                    filters: {"type_of_job": ["in", ["Team Head Lawyer"]]}
                                },
                                required: true
                            },
                            {
                                name: 'role',
                                title: baticApp.app.__lang('Role'),
                                type: 'Select',
                                doctype: 'Contract-Agents',
                                required: true
                            },
                        ]
                    }
                },
                {
                    col: 12,
                    field: {
                        name: 'consultation_description',
                        title: baticApp.app.__lang('Consultation Description'),
                        type: 'Editor Text',
                        required: true,
                    }
                },
            ]
        },
        {
            type: 'row',
            title: baticApp.app.__lang('Result & Advice'),
            fields: [
                {
                    col: 12,
                    field: {
                        name: 'consultation_result',
                        title: baticApp.app.__lang('Consultation Result'),
                        type: 'Editor Text',
                        required: false,
                    }
                },
                {
                    col: 12,
                    field: {
                        name: 'agents_advice',
                        title: baticApp.app.__lang('Agents Advice'),
                        type: 'Editor Text',
                        required: false,
                    }
                },
                {
                    col: 12,
                    field: {
                        name: 'notemore_information',
                        title: baticApp.app.__lang('Notes/More Information'),
                        type: 'Editor Text',
                        required: false,
                    }
                }
            ]
        }
    ]
}
