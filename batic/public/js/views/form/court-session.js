baticApp.forms['court-session'] = {
    form: [
        {
            type: 'row',
            title: baticApp.app.__lang('Session Details'),
            fields: [
                {
                    col: 6,
                    field: {
                        name: 'session_no',
                        title: baticApp.app.__lang('Session No'),
                        type: 'Data',
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'subject',
                        title: baticApp.app.__lang('Session Subject'),
                        type: 'Data',
                        required: false,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'session_link_url',
                        title: baticApp.app.__lang('Session Link URL'),
                        type: 'Data',
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'previous_session',
                        title: baticApp.app.__lang('Previous Session'),
                        type: 'Link',
                        link: {
                            txt: '',
                            doctype: 'Court Session',
                            reference_doctype: 'Court Session',
                            ignore_user_permissions: 0,
                            page_length: 10
                        },
                        required: false,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'date_in_hirji',
                        title: baticApp.app.__lang('Session Date In Hijri'),
                        type: 'Data',
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'next_session_hijri_date',
                        title: baticApp.app.__lang('Next Session Hijri Date'),
                        type: 'Data',
                        required: false,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'session_time',
                        title: baticApp.app.__lang('Session Time'),
                        type: 'Time',
                        required: false,
                    }
                },
            ]
        },
        {
            type: 'row',
            title: baticApp.app.__lang('Case Details'),
            fields: [
                {
                    col: 6,
                    field: {
                        name: 'case_session',
                        title: baticApp.app.__lang('Case'),
                        type: 'Link',
                        link: {
                            txt: '',
                            doctype: 'Case',
                            reference_doctype: 'Court Session',
                            ignore_user_permissions: 0,
                            filters: {"case_status_workflow": ["in", ["Processing", "In Appeal", "Motion for Review"]]},
                            page_length: 10
                        },
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'poa',
                        title: baticApp.app.__lang('POA'),
                        type: 'Link',
                        link: {
                            txt: '',
                            doctype: 'Power of Attorney',
                            reference_doctype: 'Court Session',
                            ignore_user_permissions: 0,
                            page_length: 10
                        },
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'case_status',
                        title: baticApp.app.__lang('Case Status'),
                        type: 'Select',
                        required: false,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'agent',
                        title: baticApp.app.__lang('Agent'),
                        type: 'Link',
                        link: {
                            txt: '',
                            doctype: 'Employee',
                            reference_doctype: 'Court Session',
                            ignore_user_permissions: 0,
                            page_length: 10
                        },
                        required: true,
                    }
                },
                {
                    col: 12,
                    field: {
                        name: 'contenders',
                        title: baticApp.app.__lang('Contenders'),
                        type: 'Table',
                        doctype: 'Court Session',
                        addButtonTitle: baticApp.app.__lang('Add Contender'),
                        fields: [
                            {
                                name: 'name1',
                                title: baticApp.app.__lang('Name'),
                                type: 'Data',
                                required: true
                            },
                            {
                                name: 'id_number',
                                title: baticApp.app.__lang('ID Number'),
                                type: 'Data',
                                required: true
                            }
                        ]
                    }
                }
            ]
        },
        {
            type: 'row',
            title: baticApp.app.__lang('Report and Requirements'),
            fields: [
                {
                    col: 12,
                    field: {
                        name: 'report',
                        title: baticApp.app.__lang('Report'),
                        type: 'Editor Text',
                        required: false,
                    }
                },
                {
                    col: 12,
                    field: {
                        name: 'attendees',
                        title: baticApp.app.__lang('Attendees'),
                        type: 'Table',
                        doctype: 'Court Session',
                        addButtonTitle: baticApp.app.__lang('Add Contender'),
                        fields: [
                            {
                                name: 'name1',
                                title: baticApp.app.__lang('Name'),
                                type: 'Data',
                                required: false
                            },
                            {
                                name: 'position',
                                title: baticApp.app.__lang('Position'),
                                type: 'Data',
                                required: false
                            }
                        ]
                    }
                },
                {
                    col: 12,
                    field: {
                        name: 'session_requirements',
                        title: baticApp.app.__lang('Session Requirements'),
                        type: 'Table',
                        doctype: 'Court Session',
                        addButtonTitle: baticApp.app.__lang('Add Contender'),
                        fields: [
                            {
                                name: 'requirement_details',
                                title: baticApp.app.__lang('Requirement Details'),
                                type: 'Data',
                                required: false
                            },
                            {
                                name: 'assign_to',
                                title: baticApp.app.__lang('Assign To'),
                                type: 'Link',
                                link: {
                                    txt: '',
                                    doctype: 'Employee',
                                    reference_doctype: 'Session Requirements',
                                    ignore_user_permissions: 0,
                                    page_length: 10
                                },
                                required: false
                            }
                        ]
                    }
                }
            ]
        }
    ]
}
