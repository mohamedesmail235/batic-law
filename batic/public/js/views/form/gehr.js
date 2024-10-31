baticApp.forms['gehr'] = {
    form: [
        {
            type: 'row',
            fields: [
                {
                    col: 6,
                    field: {
                        name: 'parther',
                        title: baticApp.app.__lang('Parther'),
                        type: 'Currency',
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'consultant',
                        title: baticApp.app.__lang('Consultant'),
                        type: 'Currency',
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'senior_lawyer',
                        title: baticApp.app.__lang('Senior Lawyer'),
                        type: 'Currency',
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'lawyer',
                        title: baticApp.app.__lang('Lawyer'),
                        type: 'Currency',
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'attorney_assistant',
                        title: baticApp.app.__lang('Attorney Assistant'),
                        type: 'Currency',
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'legal_secretary',
                        title: baticApp.app.__lang('Legal Secretary'),
                        type: 'Currency',
                        required: true,
                    }
                },
            ]
        }
    ]
}
