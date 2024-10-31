/*
* Side Menu
*/


baticApp.workspace = {};

baticApp.sideMenu = [
    {
        name: 'core-data',
        label: 'Core Data',
        type: 'group',
        icon: '',
        list: [
            {
                label: 'Customers',
                link_to: 'Customer',
                is_single: false,
                type: 'link',
                icon: 'far fa-id-card-alt',
            },
            {
                label: 'Projects',
                link_to: 'Project',
                is_single: false,
                type: 'link',
                icon: 'far fa-sim-card',
            },
            {
                label: 'Employees',
                link_to: 'Employee',
                is_single: false,
                type: 'link',
                icon: 'far fa-user-tie',
            },
            {
                label: 'Orders',
                link_to: 'Order',
                is_single: false,
                type: 'link',
                icon: 'far fa-money-check',
            },
            {
                label: 'Quotations',
                link_to: 'Quotation',
                is_single: false,
                type: 'link',
                icon: 'far fa-file-alt',
            },
            {
                label: 'Contracts',
                link_to: 'Contract',
                is_single: false,
                type: 'link',
                icon: 'far fa-file-signature',
            },
            {
                label: 'Tasks',
                type: 'dropdown',
                icon: 'far fa-tasks',
                links: [
                    {link_to: 'Task', label: 'Tasks', is_single: false},
                    {link_to: 'timesheet', label: 'Work Time Sheet', is_single: false, link_type: 'page'}
                ]
            },
            {
                label: 'Cases',
                type: 'dropdown',
                icon: 'far fa-tasks',
                links: [
                    {link_to: 'Case', label: 'Cases', is_single: false},
                    {link_to: 'Court Session', label: 'Court Session', is_single: false},
                    {link_to: 'Evidence', label: 'Evidence', is_single: false},
                    {link_to: 'Power of Attorney', label: 'Power of Attorney', is_single: false}
                ]
            },
            {
                label: 'Consultations',
                link_to: 'Consultations',
                is_single: false,
                type: 'link',
                icon: 'far fa-user-chart',
            },
            {
                label: 'Legal Services',
                link_to: 'Legal Services',
                is_single: false,
                type: 'link',
                icon: 'far fa-balance-scale',
            },
            // {
            //     label: 'Requests',
            //     link_to: 'Request',
            //     is_single: false,
            //     type: 'link',
            //     icon: 'far fa-comment-alt-lines',
            // },
            // {
            //     label: 'Vacations',
            //     link_to: 'Vacation',
            //     is_single: false,
            //     type: 'link',
            //     icon: 'far fa-calendar-check',
            // },
            {
                label: 'Vacation Request',
                link_to: 'vacation-request',
                link_type: 'page',
                is_single: false,
                type: 'link',
                icon: 'far fa-calendar-check',
            },
            {
                label: 'Annual Calender',
                link_to: 'annual-calender',
                link_type: 'page',
                is_single: false,
                type: 'link',
                icon: 'far fa-calendar-alt',
            },
        ],
    },
    {
        name: 'static',
        label: 'Static',
        type: 'group',
        icon: '',
        list: [
            {
                label: 'Master Data',
                type: 'dropdown',
                icon: 'far fa-sliders-h',
                links: [
                    {link_to: 'Judge', label: 'Judge', is_single: false},
                    {link_to: 'Court', label: 'Courts', is_single: false},
                    {link_to: 'Section', label: 'Sections', is_single: false},
                    {link_to: 'Case Category', label: 'Case Categories', is_single: false},
                    {link_to: 'Consultation Category', label: 'Consultation Categories', is_single: false},
                    {link_to: 'Contract Template', label: 'Contract Template', is_single: false},
                    {link_to: 'GEHR', label: 'GEHR', is_single: true}
                ],
            }
        ]
    }
];
