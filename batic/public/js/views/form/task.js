baticApp.forms['task'] = {
    form: [
        {
            type: 'row',
            fields: [
                {
                    col: 6,
                    field: {
                        name: 'subject',
                        title: baticApp.app.__lang('Title'),
                        type: 'Data',
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'task_status',
                        title: baticApp.app.__lang('Task Status'),
                        type: 'Select',
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'linked_document_type_',
                        title: baticApp.app.__lang('Linked Document Type'),
                        type: 'Select',
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'priority',
                        title: baticApp.app.__lang('Priority'),
                        type: 'Select',
                        required: false,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'linked_document',
                        title: baticApp.app.__lang('Linked Document'),
                        type: 'Link',
                        required: true,
                    }
                },
                {
                    col: 3,
                    field: {
                        name: 'task_weight',
                        title: baticApp.app.__lang('Weight'),
                        type: 'Float',
                        required: false,
                    }
                },
                {
                    col: 3,
                    field: {
                        name: 'duration',
                        title: baticApp.app.__lang('Duration Time'),
                        type: 'Float',
                        required: false,
                    }
                },
                {
                    col: 3,
                    field: {
                        name: 'due_date',
                        title: baticApp.app.__lang('Due Date'),
                        type: 'Date',
                        required: false,
                    }
                },
                {
                    col: 3,
                    field: {
                        name: 'attachments',
                        title: baticApp.app.__lang('Attachments'),
                        type: 'Attach File',
                        required: false,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'task_supervisor_',
                        title: baticApp.app.__lang('Task Supervisor'),
                        type: 'Link',
                        link: {
                            txt: '',
                            doctype: 'Employee',
                            reference_doctype: 'Task',
                            ignore_user_permissions: 0
                        },
                        required: false,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'is_group',
                        title: baticApp.app.__lang('Is Parent Task'),
                        type: 'Check',
                        required: false,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'parent_task',
                        title: baticApp.app.__lang('Parent Task'),
                        type: 'Link',
                        link: {
                            txt: '',
                            doctype: 'Task',
                            reference_doctype: 'Task',
                            ignore_user_permissions: 0
                        },
                        required: false,
                    }
                },
            ]
        },
        {
            type: 'row',
            fields: [
                {
                    col: 12,
                    field: {
                        name: 'assign_to',
                        title: baticApp.app.__lang('Assign To'),
                        type: 'Table',
                        doctype: 'Task',
                        addButtonTitle: baticApp.app.__lang('Add Employee'),
                        fields: [
                            {
                                name: 'user',
                                title: baticApp.app.__lang('Employee'),
                                type: 'Link',
                                link: {
                                    txt: '',
                                    doctype: 'Employee',
                                    reference_doctype: 'UserChildTable',
                                    ignore_user_permissions: 0,
                                    page_length: 10
                                },
                                required: true
                            },
                            {
                                name: 'work_status',
                                title: baticApp.app.__lang('Work Status'),
                                type: 'Select',
                                doctype: 'UserChildTable',
                                required: true
                            }
                        ]
                    }
                },
            ]
        },
        {
            type: 'row',
            title: baticApp.app.__lang('Details'),
            fields: [
                {
                    col: 12,
                    field: {
                        name: 'description',
                        title: baticApp.app.__lang('Task Description'),
                        type: 'Editor Text',
                        required: false
                    }
                }
            ]
        }
    ]
}
