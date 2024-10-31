baticApp.forms['employee'] = {
    form: [
        {
            type: 'row',
            fields: [
                {
                    col: 4,
                    field: {
                        name: 'image',
                        title: baticApp.app.__lang('Employee Photo'),
                        type: 'Attach Image',
                    }
                },
            ]
        },
        {
            type: 'row',
            fields: [
                {
                    col: 4,
                    field: {
                        name: 'naming_series',
                        title: baticApp.app.__lang('Series'),
                        type: 'Select',
                        required: true,
                    }
                },
                {
                    col: 2,
                    field: {
                        name: 'gender',
                        title: baticApp.app.__lang('Gender'),
                        type: 'Link',
                        doctype: 'Gender',
                        link: {
                            txt: '',
                            doctype: 'Gender',
                            reference_doctype: 'Employee',
                            ignore_user_permissions: 0,
                            page_length: 10
                        },
                        required: true,
                    }
                },
                {
                    col: 3,
                    field: {
                        name: 'date_of_joining',
                        title: baticApp.app.__lang('Date of Joining'),
                        type: 'Date',
                        required: true,
                    }
                },
                {
                    col: 3,
                    field: {
                        name: 'date_of_birth',
                        title: baticApp.app.__lang('Date of Birth'),
                        type: 'Date',
                        required: true,
                    }
                },
                {
                    col: 4,
                    field: {
                        name: 'first_name',
                        title: baticApp.app.__lang('First Name'),
                        type: 'Data',
                        required: true,
                    }
                },
                {
                    col: 4,
                    field: {
                        name: 'middle_name',
                        title: baticApp.app.__lang('Middle Name'),
                        type: 'Data',
                        required: false,
                    }
                },
                {
                    col: 4,
                    field: {
                        name: 'last_name',
                        title: baticApp.app.__lang('Last Name'),
                        type: 'Data',
                        required: false,
                    }
                },
                {
                    col: 4,
                    field: {
                        name: 'status',
                        title: baticApp.app.__lang('Status'),
                        type: 'Select',
                        required: true,
                    }
                },
                {
                    col: 4,
                    field: {
                        name: 'technical_position',
                        title: baticApp.app.__lang('Technical Position'),
                        type: 'Select',
                        required: true,
                    }
                },
                {
                    col: 4,
                    field: {
                        name: 'type_of_job',
                        title: baticApp.app.__lang('Type of Role'),
                        type: 'Select',
                        required: true,
                    }
                },
            ]
        },

        {
            type: 'row',
            title: baticApp.app.__lang('Address & Contacts'),
            fields: [
                {
                    col: 6,
                    field: {
                        name: 'prefered_contact_email',
                        title: baticApp.app.__lang('Prefered Contact Email'),
                        type: 'Select',
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'personal_email',
                        title: baticApp.app.__lang('Personal Email'),
                        type: 'Data',
                        required: false,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'company_email',
                        title: baticApp.app.__lang('Company Email'),
                        type: 'Data',
                        description: baticApp.app.__lang('Provide Email Address registered in company'),
                        required: false,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'cell_number',
                        title: baticApp.app.__lang('Mobile'),
                        type: 'Data',
                        required: false,
                    }
                },
            ]
        },
    ]
}
