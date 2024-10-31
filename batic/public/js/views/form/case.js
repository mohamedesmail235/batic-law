baticApp.forms['case'] = {
    _actions: (Ctrl, $scope, $rootScope, $http, $timeout) => {
        return {
            // condition: "doc.name==1",
            list: [
                {
                    name: 'Appeal',
                    label: baticApp.app.__lang('Appeal'),
                    action: () => {
                        console.log('Appeal-doctype', $scope.$resolve.doctype)
                        console.log('Appeal-docname', $scope.$resolve.docname)
                    }
                },
                {
                    name: 'Processing',
                    label: baticApp.app.__lang('Processing'),
                    action: () => {
                        console.log('Processing-doctype', $scope.$resolve.doctype)
                        console.log('Processing-docname', $scope.$resolve.docname)
                    }
                }
            ]
        }
    },
    form: [
        {
            type: 'row',
            fields: [
                {
                    col: 6,
                    field: {
                        name: 'case_title',
                        title: baticApp.app.__lang('Case Title'),
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
                            reference_doctype: 'Case',
                            ignore_user_permissions: 0,
                            page_length: 10
                        },
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'client_status',
                        title: baticApp.app.__lang('Client Status'),
                        type: 'Select',
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
                            reference_doctype: 'Case',
                            ignore_user_permissions: 0,
                            filters: {"docstatus": 1},
                            page_length: 10
                        },
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'claim_type',
                        title: baticApp.app.__lang('Claim Type'),
                        type: 'Select',
                        required: false,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'case_no',
                        title: baticApp.app.__lang('Case No'),
                        type: 'Data',
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'case_category',
                        title: baticApp.app.__lang('Case No'),
                        type: 'Link',
                        link: {
                            txt: '',
                            doctype: 'Case Category',
                            reference_doctype: 'Case',
                            ignore_user_permissions: 0,
                            page_length: 10
                        },
                        required: true,
                    }
                },
                {
                    col: 3,
                    field: {
                        name: 'start_date_in_hijri',
                        title: baticApp.app.__lang('Start Date in Hijri'),
                        type: 'Date Hijri',
                        required: true,
                    }
                },
                {
                    col: 3,
                    field: {
                        name: 'close_date_in_hijri',
                        title: baticApp.app.__lang('Close Date in Hijri'),
                        type: 'Date Hijri',
                        required: true,
                    }
                },
                {
                    col: 3,
                    field: {
                        name: 'judge',
                        title: baticApp.app.__lang('Judge'),
                        type: 'Link',
                        link: {
                            txt: '',
                            doctype: 'Judge',
                            reference_doctype: 'Case',
                            ignore_user_permissions: 0,
                            page_length: 10
                        },
                        required: true,
                    }
                },
                {
                    col: 3,
                    field: {
                        name: 'court',
                        title: baticApp.app.__lang('Court'),
                        type: 'Link',
                        link: {
                            txt: '',
                            doctype: 'Court',
                            reference_doctype: 'Case',
                            ignore_user_permissions: 0,
                            page_length: 10
                        },
                        required: true,
                    }
                },
                {
                    col: 3,
                    field: {
                        name: 'start_date',
                        title: baticApp.app.__lang('Start Date'),
                        type: 'Date',
                        readonly: true,
                        depends_on: ("form.start_date_in_hijri")
                    }
                },
                {
                    col: 3,
                    field: {
                        name: 'close_date',
                        title: baticApp.app.__lang('Close Date'),
                        type: 'Date',
                        readonly: true,
                        depends_on: ("form.close_date_in_hijri")
                    }
                },
                {
                    col: 3,
                    field: {
                        name: 'section',
                        title: baticApp.app.__lang('Section'),
                        type: 'Link',
                        link: {
                            txt: '',
                            doctype: 'Section',
                            reference_doctype: 'Case',
                            ignore_user_permissions: 0,
                            page_length: 10
                        },
                        required: true,
                    }
                },
                {
                    col: 3,
                    field: {
                        name: 'legal_case_result',
                        title: baticApp.app.__lang('Legal Case Result'),
                        type: 'Select',
                        required: false,
                    }
                },
            ]
        },
        {
            type: 'row',
            fields: [
                {
                    col: 6,
                    field: {
                        name: 'agent',
                        title: baticApp.app.__lang('Team Head Lawyer Agents'),
                        type: 'Table',
                        doctype: 'Task',
                        addButtonTitle: baticApp.app.__lang('Add Agent'),
                        fields: [
                            {
                                name: 'employee',
                                title: baticApp.app.__lang('Employee'),
                                type: 'Link',
                                link: {
                                    txt: '',
                                    doctype: 'Employee',
                                    reference_doctype: 'Case Agents',
                                    ignore_user_permissions: 0,
                                    filters: {"type_of_job": ["in", ["Team Head Lawyer"]]},
                                    page_length: 10
                                },
                                required: true
                            }
                        ]
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'contender',
                        title: baticApp.app.__lang('Contender'),
                        type: 'Table',
                        doctype: 'Task',
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
            title: baticApp.app.__lang('Details'),
            fields: [
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
