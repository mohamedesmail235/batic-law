/*
* Form View
*/

baticApp.forms = {};
baticApp.doctypes = {};

baticApp.forms = {
    /*
    * Accounting Forms
    */
    'journal-entry': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'naming_series',
                            title: baticApp.app.__lang('Series'),
                            type: 'Select',
                            required: true,
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'company',
                            title: baticApp.app.__lang('Company'),
                            type: 'Link',
                            doctype: 'Journal Entry',
                            required: true,
                            link: {
                                txt: '',
                                doctype: 'Company',
                                reference_doctype: 'Journal Entry',
                                filters: {}
                            },
                            default_value: baticApp.app.defaults.company
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'posting_date',
                            title: baticApp.app.__lang('Date'),
                            type: 'Date',
                            required: true,
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'cheque_no',
                            title: baticApp.app.__lang('Reference Number'),
                            type: 'Data'
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'cheque_date',
                            title: baticApp.app.__lang('Reference Date'),
                            type: 'Date'
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'accounts',
                            title: baticApp.app.__lang('Accounting Entries'),
                            type: 'Table',
                            doctype: 'Journal Entry Account',
                            addButtonTitle: baticApp.app.__lang('Add Account'),
                            fields: [
                                {
                                    name: 'account',
                                    title: baticApp.app.__lang('Account'),
                                    type: 'Link',
                                    width: '25%',
                                    link: {
                                        txt: '',
                                        doctype: 'Account',
                                        reference_doctype: 'Journal Entry Account'
                                    }
                                },
                                {
                                    name: 'party_type',
                                    title: baticApp.app.__lang('Party Type'),
                                    type: 'Link',
                                    link: {
                                        txt: '',
                                        doctype: 'DocType',
                                        reference_doctype: 'Journal Entry Account',
                                        query: 'erpnext.setup.doctype.party_type.party_type.get_party_type',
                                        ignore_user_permissions: 0
                                    }
                                },
                                {
                                    name: 'party',
                                    title: baticApp.app.__lang('Party'),
                                    type: 'Link',
                                    link: {
                                        txt: '',
                                        reference_doctype: 'Journal Entry Account',
                                        ignore_user_permissions: 0
                                    },
                                    readonly_depends_on: ("true")
                                },
                                {
                                    name: 'debit_in_account_currency',
                                    title: baticApp.app.__lang('Debit'),
                                    type: 'Currency'
                                },
                                {
                                    name: 'credit_in_account_currency',
                                    title: baticApp.app.__lang('Credit'),
                                    type: 'Currency'
                                },
                                {
                                    name: 'cost_center',
                                    title: baticApp.app.__lang('Cost Center'),
                                    type: 'Link',
                                    doctype: 'Cost Center',
                                    link: {
                                        txt: '',
                                        doctype: 'Cost Center',
                                        ignore_user_permissions: 0,
                                        reference_doctype: 'Journal Entry Account',
                                        filters: {"company": baticApp.app.defaults.company}
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    },
    'payment-entry': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'naming_series',
                            title: baticApp.app.__lang('Series'),
                            type: 'Select',
                            required: true,
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'company',
                            title: baticApp.app.__lang('Company'),
                            type: 'Link',
                            doctype: 'Payment Entry',
                            required: true,
                            link: {
                                txt: '',
                                doctype: 'Company',
                                reference_doctype: 'Payment Entry',
                                filters: {}
                            },
                            default_value: baticApp.app.defaults.company,
                            disabled: true
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'mode_of_payment',
                            title: baticApp.app.__lang('Mode Of Payment'),
                            type: 'Link',
                            doctype: 'Payment Entry',
                            link: {
                                txt: '',
                                doctype: 'Mode of Payment',
                                reference_doctype: 'Payment Entry',
                                ignore_user_permissions: 0
                            }
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'payment_type',
                            title: baticApp.app.__lang('Payment Type'),
                            type: 'Select',
                            required: true,
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'posting_date',
                            title: baticApp.app.__lang('Posting Date'),
                            type: 'Date',
                            default_value: baticApp.app.datetime._date('YYYY-MM-DD'),
                            required: true
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'party_type',
                            title: baticApp.app.__lang('Party Type'),
                            type: 'Link',
                            required: true,
                            doctype: 'Payment Entry',
                            link: {
                                txt: '',
                                doctype: 'DocType',
                                reference_doctype: 'Payment Entry',
                                filters: JSON.stringify({"name": ["in", ["Customer", "Supplier"]]})
                            },
                            depends_on: ('baticApp.app.in_list(["Receive", "Pay"], form.payment_type)')
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'party',
                            title: baticApp.app.__lang('Party'),
                            type: 'Link',
                            doctype: 'Payment Entry',
                            required: true,
                            depends_on: ('baticApp.app.in_list(["Receive", "Pay"], form.payment_type) && form.party_type')
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'party_name',
                            title: baticApp.app.__lang('Party Name'),
                            type: 'Data',
                            depends_on: ('form.party')
                        }
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('Accounts'),
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'paid_from',
                            title: baticApp.app.__lang('Account Paid From'),
                            type: 'Link',
                            doctype: 'Payment Entry',
                            required: true,
                            link: {
                                txt: '',
                                doctype: 'Account',
                                reference_doctype: 'Payment Entry',
                                filters: JSON.stringify({"account_type": ["in", ["Bank", "Cash"]], "is_group": 0, "company": baticApp.app.defaults.company})
                            },
                            depends_on: ('baticApp.app.in_list(["Internal Transfer", "Pay"], form.payment_type) || form.party')
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'paid_to',
                            title: baticApp.app.__lang('Account Paid To'),
                            type: 'Link',
                            required: true,
                            doctype: 'Payment Entry',
                            link: {
                                txt: '',
                                doctype: 'Account',
                                reference_doctype: 'Payment Entry',
                                filters: {"account_type": ["in", ["Bank", "Cash"]], "is_group": 0, "company": baticApp.app.defaults.company}
                            },
                            depends_on: ('baticApp.app.in_list(["Internal Transfer", "Receive"], form.payment_type) || form.party')
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'paid_from_account_currency',
                            title: baticApp.app.__lang('Account Currency'),
                            type: 'Data',
                            disabled: true,
                            depends_on: ('form.paid_from')
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'paid_from_account_balance',
                            title: baticApp.app.__lang('Account Balance'),
                            type: 'Currency',
                            disabled: true,
                            depends_on: ('form.paid_from')
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'paid_to_account_currency',
                            title: baticApp.app.__lang('Account Currency'),
                            type: 'Data',
                            disabled: true,
                            depends_on: ('form.paid_to')
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'paid_to_account_balance',
                            title: baticApp.app.__lang('Account Balance'),
                            type: 'Currency',
                            disabled: true,
                            depends_on: ('form.paid_to')
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'paid_amount',
                            title: baticApp.app.__lang('Paid Amount'),
                            type: 'Currency',
                            depends_on: ('form.paid_from && form.paid_to')
                        },
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'references',
                            title: baticApp.app.__lang('References'),
                            type: 'Table',
                            doctype: 'Payment Entry',
                            addButtonTitle: baticApp.app.__lang('Add References'),
                            fields: [
                                {
                                    name: 'reference_doctype',
                                    title: baticApp.app.__lang('Type'),
                                    type: 'Link',
                                    doctype: 'Payment Entry',
                                    link: {
                                        txt: '',
                                        doctype: 'DocType',
                                        reference_doctype: 'Payment Entry Reference',
                                        ignore_user_permissions: 0,
                                        filters: {name: ["in", ["Sales Invoice", "Purchase Invoice"]]}
                                    }
                                },
                                {
                                    name: 'reference_name',
                                    title: baticApp.app.__lang('Name'),
                                    type: 'Link',
                                    doctype: 'Payment Entry',
                                    disabled: true
                                },
                                {
                                    name: 'total_amount',
                                    title: baticApp.app.__lang('Grand Total (SAR)'),
                                    type: 'Float',
                                    readonly_on: true
                                },
                                {
                                    name: 'outstanding_amount',
                                    title: baticApp.app.__lang('Outstanding (SAR)'),
                                    type: 'Float',
                                    readonly_on: true
                                },
                                {
                                    name: 'allocated_amount',
                                    title: baticApp.app.__lang('Allocated (SAR)'),
                                    type: 'Float',
                                    default_value: 0
                                }
                            ],
                            depends_on: ('form.party && form.paid_from && form.paid_to && form.paid_amount')
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'reference_no',
                            title: baticApp.app.__lang('Cheque/Reference No'),
                            type: 'Data'
                        },
                    },
                    {
                        col: 6,
                        field: {
                            name: 'reference_date',
                            title: baticApp.app.__lang('Cheque/Reference Date'),
                            type: 'Date'
                        }
                    }
                ]
            }
        ]
    },
    'account': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'account_name',
                            title: baticApp.app.__lang('New Account Name'),
                            type: 'Data',
                            required: true
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'parent_account',
                            title: baticApp.app.__lang('Parent Account'),
                            type: 'Link',
                            doctype: 'Account',
                            link: {
                                txt: '',
                                doctype: 'Account',
                                ignore_user_permissions: 1,
                                reference_doctype: 'Account',
                                filters: {"is_group": 1, "company": baticApp.app.defaults.company}
                            }
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 3,
                        field: {
                            name: 'account_type',
                            title: baticApp.app.__lang('Account Type'),
                            type: 'Select',
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'company',
                            title: baticApp.app.__lang('Company'),
                            type: 'Data',
                            doctype: 'Company',
                            default_value: baticApp.app.defaults.company,
                            readonly_depends_on: ("true")
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'account_currency',
                            title: baticApp.app.__lang('Currency'),
                            type: 'Link',
                            doctype: 'Account',
                            required: true,
                            default_value: baticApp.app.defaults.currency,
                            link: {
                                txt: '',
                                doctype: 'Currency',
                                ignore_user_permissions: 0,
                                reference_doctype: 'Account'
                            }
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 3,
                        field: {
                            name: 'balance_must_be',
                            title: baticApp.app.__lang('Balance must be'),
                            type: 'Select'
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'tax_rate',
                            title: baticApp.app.__lang('Tax Rate'),
                            type: 'Float',
                            depends_on: ('form.account_type=="Tax"')
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'root_type',
                            title: baticApp.app.__lang('Root Type'),
                            type: 'Data',
                            default_value: '',
                            readonly_depends_on: ("true"),
                            depends_on: ('form.parent_account')
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'report_type',
                            title: baticApp.app.__lang('Report Type'),
                            type: 'Data',
                            default_value: '',
                            readonly_depends_on: ("true"),
                            depends_on: ('form.parent_account')
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 2,
                        field: {
                            name: 'disabled',
                            title: baticApp.app.__lang('Disabled'),
                            type: 'Check',
                            default_value: 0
                        }
                    },
                    {
                        col: 2,
                        field: {
                            name: 'is_group',
                            title: baticApp.app.__lang('Is Group'),
                            type: 'Check',
                            default_value: 0
                        }
                    }
                ]
            }
        ]
    },
    'cost-center': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'cost_center_name',
                            title: baticApp.app.__lang('Cost Center Name'),
                            type: 'Data',
                            required: true
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'parent_cost_center',
                            title: baticApp.app.__lang('Parent Cost Center'),
                            type: 'Link',
                            doctype: 'Cost Center',
                            required: true,
                            link: {
                                txt: '',
                                doctype: 'Cost Center',
                                ignore_user_permissions: 1,
                                reference_doctype: 'Cost Center',
                                filters: {"is_group": 1, "company": baticApp.app.defaults.company}
                            }
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'company',
                            title: baticApp.app.__lang('Company'),
                            type: 'Link',
                            doctype: 'Cost Center',
                            required: true,
                            link: {
                                txt: '',
                                doctype: 'Company',
                                ignore_user_permissions: 1,
                                reference_doctype: 'Cost Center',
                            },
                            default_value: baticApp.app.defaults.company
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'disabled',
                            title: baticApp.app.__lang('Disabled'),
                            type: 'Check',
                            default_value: 0
                        }
                    },
                    {
                        col: 12,
                        field: {
                            name: 'is_group',
                            title: baticApp.app.__lang('Is Group'),
                            type: 'Check',
                            default_value: 0
                        }
                    }
                ]
            }
        ]
    },
    'company': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'company_name',
                            title: baticApp.app.__lang('Company'),
                            type: 'Data',
                            required: true
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'company_name_in_arabic',
                            title: baticApp.app.__lang('Company Name In Arabic'),
                            type: 'Data'
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 3,
                        field: {
                            name: 'abbr',
                            title: baticApp.app.__lang('Abbr'),
                            type: 'Data',
                            required: true
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'domain',
                            title: baticApp.app.__lang('Domain'),
                            type: 'Link',
                            doctype: 'Company',
                            link: {
                                txt: '',
                                doctype: 'Domain',
                                ignore_user_permissions: 0,
                                reference_doctype: 'Company',
                            },
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'parent_company',
                            title: baticApp.app.__lang('Parent Company'),
                            type: 'Link',
                            doctype: 'Company',
                            link: {
                                txt: '',
                                doctype: 'Company',
                                ignore_user_permissions: 1,
                                reference_doctype: 'Company',
                                filters: {"is_group": 1}
                            },
                        }
                    },
                    {
                        col: 12,
                        field: {
                            name: 'is_group',
                            title: baticApp.app.__lang('Is Group'),
                            type: 'Check',
                            default_value: 0
                        }
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('Default Values'),
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'default_currency',
                            title: baticApp.app.__lang('Default Currency'),
                            type: 'Link',
                            required: true,
                            doctype: 'Company',
                            link: {
                                txt: '',
                                doctype: 'Currency',
                                ignore_user_permissions: 1,
                                reference_doctype: 'Company',
                            },
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'country',
                            title: baticApp.app.__lang('Country'),
                            type: 'Link',
                            required: true,
                            doctype: 'Company',
                            link: {
                                txt: '',
                                doctype: 'Country',
                                ignore_user_permissions: 0,
                                reference_doctype: 'Company',
                            },
                            default_value: baticApp.app.defaults.country
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'default_finance_book',
                            title: baticApp.app.__lang('Default Finance Book'),
                            type: 'Link',
                            doctype: 'Company',
                            link: {
                                txt: '',
                                doctype: 'Finance Book',
                                ignore_user_permissions: 0,
                                reference_doctype: 'Company',
                            }
                        }
                    },
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'tax_id',
                                title: baticApp.app.__lang('Tax ID'),
                                type: 'Data'
                            },
                            {
                                name: 'create_chart_of_accounts_based_on',
                                title: baticApp.app.__lang('Create Chart Of Accounts Based On'),
                                type: 'Select'
                            },
                            {
                                name: 'chart_of_accounts',
                                title: baticApp.app.__lang('Chart Of Accounts Template'),
                                type: 'Select',
                                depends_on: ('form.create_chart_of_accounts_based_on=="Standard Template"')
                            },
                            {
                                name: 'existing_company',
                                title: baticApp.app.__lang('Existing Company'),
                                type: 'Link',
                                doctype: 'Company',
                                link: {
                                    txt: '',
                                    doctype: 'Company',
                                    ignore_user_permissions: 1,
                                    reference_doctype: 'Company',
                                },
                                depends_on: ('form.create_chart_of_accounts_based_on=="Existing Company"')
                            }
                        ]
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('Accounts Settings'),
                fields: [
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'default_bank_account',
                                title: baticApp.app.__lang('Default Bank Account'),
                                type: 'Link',
                                doctype: 'Company',
                                link: {
                                    txt: '',
                                    doctype: 'Account',
                                    ignore_user_permissions: 1,
                                    reference_doctype: 'Company',
                                    filters: {"company": baticApp.app.defaults.company, "is_group": 0, "account_type": "Bank"}
                                },
                                depends_on: ('form._form_view_type=="view"')
                            },
                            {
                                name: 'default_cash_account',
                                title: baticApp.app.__lang('Default Cash Account'),
                                type: 'Link',
                                doctype: 'Company',
                                link: {
                                    txt: '',
                                    doctype: 'Account',
                                    ignore_user_permissions: 1,
                                    reference_doctype: 'Company',
                                    filters: {"company": baticApp.app.defaults.company, "is_group": 0, "account_type": "Cash"}
                                },
                                depends_on: ('form._form_view_type=="view"')
                            },
                            {
                                name: 'default_receivable_account',
                                title: baticApp.app.__lang('Default Receivable Account'),
                                type: 'Link',
                                doctype: 'Company',
                                link: {
                                    txt: '',
                                    doctype: 'Account',
                                    ignore_user_permissions: 1,
                                    reference_doctype: 'Company',
                                    filters: {"company": baticApp.app.defaults.company, "is_group": 0, "account_type": "Receivable"}
                                },
                                depends_on: ('form._form_view_type=="view"')
                            },
                            {
                                name: 'round_off_account',
                                title: baticApp.app.__lang('Round Off Account'),
                                type: 'Link',
                                doctype: 'Company',
                                link: {
                                    txt: '',
                                    doctype: 'Account',
                                    ignore_user_permissions: 0,
                                    reference_doctype: 'Company',
                                    filters: {"company": baticApp.app.defaults.company, "is_group": 0, "root_type": "Expense"}
                                }
                            },
                            {
                                name: 'round_off_cost_center',
                                title: baticApp.app.__lang('Round Off Cost Center'),
                                type: 'Link',
                                doctype: 'Company',
                                link: {
                                    txt: '',
                                    doctype: 'Cost Center',
                                    ignore_user_permissions: 0,
                                    reference_doctype: 'Company',
                                    filters: {"company": baticApp.app.defaults.company, "is_group": 0}
                                }
                            },
                            {
                                name: 'write_off_account',
                                title: baticApp.app.__lang('Write Off Account'),
                                type: 'Link',
                                doctype: 'Company',
                                link: {
                                    txt: '',
                                    doctype: 'Cost Center',
                                    ignore_user_permissions: 0,
                                    reference_doctype: 'Company',
                                    filters: {"company": baticApp.app.defaults.company, "is_group": 0, "root_type": "Expense"}
                                }
                            },
                        ]
                    },
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'default_payable_account',
                                title: baticApp.app.__lang('Default Payable Account'),
                                type: 'Link',
                                doctype: 'Company',
                                link: {
                                    txt: '',
                                    doctype: 'Account',
                                    ignore_user_permissions: 1,
                                    reference_doctype: 'Company',
                                    filters: {"company": baticApp.app.defaults.company, "is_group": 0, "account_type": "Payable"}
                                },
                                depends_on: ('form._form_view_type=="view"')
                            },
                            {
                                name: 'default_expense_account',
                                title: baticApp.app.__lang('Default Cost of Goods Sold Account'),
                                type: 'Link',
                                doctype: 'Company',
                                link: {
                                    txt: '',
                                    doctype: 'Account',
                                    ignore_user_permissions: 1,
                                    reference_doctype: 'Company',
                                    filters: {"company": baticApp.app.defaults.company, "is_group": 0, "account_type": "Expense"}
                                },
                                depends_on: ('form._form_view_type=="view"')
                            },
                            {
                                name: 'cost_center',
                                title: baticApp.app.__lang('Default Cost Center'),
                                type: 'Link',
                                doctype: 'Company',
                                link: {
                                    txt: '',
                                    doctype: 'Cost Center',
                                    ignore_user_permissions: 1,
                                    reference_doctype: 'Company',
                                    filters: {"company": baticApp.app.defaults.company, "is_group": 0}
                                },
                                depends_on: ('form._form_view_type=="view"')
                            }
                        ]
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('Stock Settings'),
                fields: [
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'default_inventory_account',
                                title: baticApp.app.__lang('Default Inventory Account'),
                                type: 'Link',
                                doctype: 'Company',
                                link: {
                                    txt: '',
                                    doctype: 'Account',
                                    ignore_user_permissions: 1,
                                    reference_doctype: 'Company',
                                    filters: {"company": baticApp.app.defaults.company, "is_group": 0, "account_type": "Stock"}
                                },
                                depends_on: ('form._form_view_type=="view"')
                            },
                            {
                                name: 'stock_adjustment_account',
                                title: baticApp.app.__lang('Stock Adjustment Account'),
                                type: 'Link',
                                doctype: 'Company',
                                link: {
                                    txt: '',
                                    doctype: 'Account',
                                    ignore_user_permissions: 1,
                                    reference_doctype: 'Company',
                                    filters: {"company": baticApp.app.defaults.company, "is_group": 0, "root_type": "Expense", "account_type": "Stock Adjustment"}
                                },
                                depends_on: ('form._form_view_type=="view"')
                            }
                        ]
                    },
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'enable_perpetual_inventory',
                                title: baticApp.app.__lang('Enable Perpetual Inventory'),
                                type: 'Check',
                                depends_on: ('form._form_view_type=="view"')
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'sales-taxes-and-charges-template': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'title',
                            title: baticApp.app.__lang('Title'),
                            type: 'Data',
                            required: true
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'company',
                            title: baticApp.app.__lang('Company'),
                            type: 'Link',
                            doctype: 'Sales Taxes and Charges Template',
                            required: true,
                            link: {
                                txt: '',
                                doctype: 'Company',
                                ignore_user_permissions: 0,
                                reference_doctype: 'Sales Taxes and Charges Template',
                            },
                            default_value: baticApp.app.defaults.company
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'tax_category',
                            title: baticApp.app.__lang('Tax Category'),
                            type: 'Link',
                            doctype: 'Sales Taxes and Charges Template',
                            link: {
                                txt: '',
                                doctype: 'Tax Category',
                                ignore_user_permissions: 0,
                                reference_doctype: 'Sales Taxes and Charges Template',
                            }
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'is_default',
                            title: baticApp.app.__lang('Is Default'),
                            type: 'Check',
                            default_value: 0
                        }
                    },
                    {
                        col: 12,
                        field: {
                            name: 'disabled',
                            title: baticApp.app.__lang('Disabled'),
                            type: 'Check',
                            default_value: 0
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'taxes',
                            title: baticApp.app.__lang('Sales Taxes and Charges'),
                            type: 'Table',
                            doctype: 'Sales Taxes and Charges',
                            addButtonTitle: baticApp.app.__lang('Add Tax'),
                            fields: [
                                {
                                    name: 'charge_type',
                                    title: baticApp.app.__lang('Type'),
                                    type: 'Select',
                                    doctype: 'Sales Taxes and Charges'
                                },
                                {
                                    name: 'account_head',
                                    title: baticApp.app.__lang('Account Head'),
                                    type: 'Link',
                                    doctype: 'Sales Taxes and Charges',
                                    link: {
                                        txt: '',
                                        doctype: 'Account',
                                        reference_doctype: 'Sales Taxes and Charges',
                                        query: 'erpnext.controllers.queries.tax_account_query',
                                        ignore_user_permissions: 0,
                                        filters: {"account_type": ["Tax", "Chargeable", "Expense Account"], "company": baticApp.app.defaults.company, "disabled": 0}
                                    }
                                },
                                {
                                    name: 'rate',
                                    title: baticApp.app.__lang('Rate'),
                                    type: 'Float',
                                    disabled: true
                                },
                                {
                                    name: 'tax_amount',
                                    title: baticApp.app.__lang('Amount') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Currency',
                                    disabled: true
                                },
                                {
                                    name: 'total',
                                    title: baticApp.app.__lang('Total') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Float',
                                    disabled: true
                                }
                            ]
                        }
                    }
                ]
            },
        ]
    },
    'purchase-taxes-and-charges-template': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'title',
                            title: baticApp.app.__lang('Title'),
                            type: 'Data',
                            required: true
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'company',
                            title: baticApp.app.__lang('Company'),
                            type: 'Link',
                            doctype: 'Purchase Taxes and Charges Template',
                            required: true,
                            link: {
                                txt: '',
                                doctype: 'Company',
                                ignore_user_permissions: 0,
                                reference_doctype: 'Purchase Taxes and Charges Template',
                            },
                            default_value: baticApp.app.defaults.company
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'tax_category',
                            title: baticApp.app.__lang('Tax Category'),
                            type: 'Link',
                            doctype: 'Purchase Taxes and Charges Template',
                            link: {
                                txt: '',
                                doctype: 'Tax Category',
                                ignore_user_permissions: 0,
                                reference_doctype: 'Purchase Taxes and Charges Template',
                            }
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'is_default',
                            title: baticApp.app.__lang('Is Default'),
                            type: 'Check',
                            default_value: 0
                        }
                    },
                    {
                        col: 12,
                        field: {
                            name: 'disabled',
                            title: baticApp.app.__lang('Disabled'),
                            type: 'Check',
                            default_value: 0
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'taxes',
                            title: baticApp.app.__lang('Purchase Taxes and Charges'),
                            type: 'Table',
                            doctype: 'Purchase Taxes and Charges',
                            addButtonTitle: baticApp.app.__lang('Add Tax'),
                            fields: [
                                {
                                    name: 'charge_type',
                                    title: baticApp.app.__lang('Type'),
                                    type: 'Select',
                                    doctype: 'Purchase Taxes and Charges'
                                },
                                {
                                    name: 'account_head',
                                    title: baticApp.app.__lang('Account Head'),
                                    type: 'Link',
                                    doctype: 'Purchase Taxes and Charges',
                                    link: {
                                        txt: '',
                                        doctype: 'Account',
                                        reference_doctype: 'Purchase Taxes and Charges',
                                        query: 'erpnext.controllers.queries.tax_account_query',
                                        ignore_user_permissions: 0,
                                        filters: {"account_type": ["Tax", "Chargeable", "Expense Account"], "company": baticApp.app.defaults.company, "disabled": 0}
                                    }
                                },
                                {
                                    name: 'rate',
                                    title: baticApp.app.__lang('Rate'),
                                    type: 'Float',
                                    disabled: true
                                },
                                {
                                    name: 'tax_amount',
                                    title: baticApp.app.__lang('Amount') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Currency',
                                    disabled: true
                                },
                                {
                                    name: 'total',
                                    title: baticApp.app.__lang('Total') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Float',
                                    disabled: true
                                }
                            ]
                        }
                    }
                ]
            },
        ]
    },
    'mode-of-payment': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'mode_of_payment',
                            title: baticApp.app.__lang('Mode of Payment'),
                            type: 'Data',
                            required: true
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'type',
                            title: baticApp.app.__lang('Type'),
                            type: 'Select'
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'enabled',
                            title: baticApp.app.__lang('Enabled'),
                            type: 'Check',
                            default_value: 1
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'accounts',
                            title: baticApp.app.__lang('Accounts'),
                            type: 'Table',
                            doctype: 'Mode of Payment Account',
                            addButtonTitle: baticApp.app.__lang('Add Account'),
                            fields: [
                                {
                                    name: 'company',
                                    title: baticApp.app.__lang('Company'),
                                    type: 'Link',
                                    doctype: 'Company',
                                    link: {
                                        txt: '',
                                        doctype: 'Company',
                                        reference_doctype: 'Mode of Payment Account',
                                        ignore_user_permissions: 0
                                    },
                                    default_value: baticApp.app.defaults.company
                                },
                                {
                                    name: 'default_account',
                                    title: baticApp.app.__lang('Account'),
                                    type: 'Link',
                                    doctype: 'Account',
                                    link: {
                                        txt: '',
                                        doctype: 'Account',
                                        ignore_user_permissions: 0,
                                        reference_doctype: 'Mode of Payment Account',
                                        filters: [["Account", "account_type", "in", "Bank, Cash, Receivable"], ["Account", "is_group", "=", 0], ["Account", "company", "=", baticApp.app.defaults.company]]
                                    }
                                }
                            ]
                        }
                    }
                ]
            },
        ]
    },
    'item-tax-template': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'title',
                            title: baticApp.app.__lang('Title'),
                            type: 'Data',
                            required: true
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'company',
                            title: baticApp.app.__lang('Company'),
                            type: 'Link',
                            link: {
                                txt: '',
                                doctype: 'Company',
                                ignore_user_permissions: 0,
                                reference_doctype: 'Item Tax Template'
                            },
                            default_value: baticApp.app.defaults.company,
                            required: true
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'disabled',
                            title: baticApp.app.__lang('Disabled'),
                            type: 'Check',
                            required: false,
                            default_value: 0
                        }
                    },
                    {
                        col: 12,
                        field: {
                            name: 'taxes',
                            title: baticApp.app.__lang('Tax Rates'),
                            type: 'Table',
                            doctype: 'Item Tax Template',
                            addButtonTitle: baticApp.app.__lang('Add Tax'),
                            fields: [
                                {
                                    name: 'tax_type',
                                    title: baticApp.app.__lang('Tax'),
                                    type: 'Link',
                                    width: '80%',
                                    link: {
                                        txt: '',
                                        doctype: 'Account',
                                        ignore_user_permissions: 0,
                                        reference_doctype: 'Item Tax Template Detail',
                                        filters: JSON.stringify([["Account", "company", "=", baticApp.app.defaults.company], ["Account", "is_group", "=", 0], ["Account", "account_type", "in", ["Tax", "Chargeable", "Income Account", "Expense Account", "Expenses Included In Valuation"]]])
                                    },
                                    required: true
                                },
                                {
                                    name: 'tax_rate',
                                    title: baticApp.app.__lang('Tax Rate'),
                                    type: 'Float',
                                    width: '20%',
                                    required: true,
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    },

    /*
    * Stock Forms
    */
    'item': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 3,
                        field: {
                            name: 'image',
                            title: baticApp.app.__lang('Item Image'),
                            type: 'Attach Image',
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'item_code',
                            title: baticApp.app.__lang('Item Code'),
                            type: 'Data',
                            required: true,
                            disabled_on_edit: true
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'item_name',
                            title: baticApp.app.__lang('Item Name'),
                            type: 'Data'
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'item_group',
                            title: baticApp.app.__lang('Item Group'),
                            type: 'Link',
                            required: true,
                            doctype: 'Item',
                            link: {
                                txt: '',
                                doctype: 'Item Group',
                                ignore_user_permissions: 0,
                                reference_doctype: 'Item',
                                filters: '[["Item Group", "docstatus", "!=", 2]]'
                            }
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'stock_uom',
                            title: baticApp.app.__lang('Default Unit of Measure'),
                            type: 'Link',
                            required: true,
                            doctype: 'Item',
                            link: {
                                txt: '',
                                doctype: 'UOM',
                                ignore_user_permissions: 1,
                                reference_doctype: 'Item',
                                filters: {}
                            }
                        }
                    },
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 3,
                        field: {
                            name: 'opening_stock',
                            title: baticApp.app.__lang('Opening Stock'),
                            type: 'Float',
                            required: false,
                            readonly_depends_on: ("form._form_view_type=='view'")
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'valuation_rate',
                            title: baticApp.app.__lang('Valuation Rate'),
                            type: 'Currency',
                            required: false
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'standard_rate',
                            title: baticApp.app.__lang('Standard Selling Rate'),
                            type: 'Currency',
                            required: false,
                            readonly_depends_on: ("form._form_view_type=='view'")
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'standard_buying_rate',
                            title: baticApp.app.__lang('Standard Buying Rate'),
                            type: 'Currency',
                            required: false,
                            readonly_depends_on: ("form._form_view_type=='view'")
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'disabled',
                            title: baticApp.app.__lang('Disabled'),
                            type: 'Check',
                            required: false,
                            default_value: 0
                        }
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('Description'),
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'description',
                            title: baticApp.app.__lang('Item Description'),
                            type: 'Small Text',
                        }
                    }
                ]
            }
        ]
    },
    'item-group': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 3,
                        field: {
                            name: 'image',
                            title: baticApp.app.__lang('Item Image'),
                            type: 'Attach Image',
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'item_group_name',
                            title: baticApp.app.__lang('Item Group Name'),
                            type: 'Data',
                            required: true,
                            disabled_on_edit: true
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'parent_item_group',
                            title: baticApp.app.__lang('Parent Item Group'),
                            type: 'Link',
                            doctype: 'Item Group',
                            link: {
                                txt: '',
                                doctype: 'Item Group',
                                ignore_user_permissions: 1,
                                reference_doctype: 'Item Group',
                                filters: JSON.stringify([["Item Group", "is_group", "=", 1], ["Item Group", "name", "!=", null]])
                            }
                        }
                    },
                    {
                        col: 12,
                        field: {
                            name: 'is_group',
                            title: baticApp.app.__lang('Is Group'),
                            type: 'Check',
                            default_value: 0
                        }
                    }
                ]
            }
        ]
    },
    'item-price': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'item_code',
                            title: baticApp.app.__lang('Item Code'),
                            type: 'Link',
                            doctype: 'Item Price',
                            link: {
                                txt: '',
                                doctype: 'Item',
                                ignore_user_permissions: 0,
                                reference_doctype: 'Item Price'
                            },
                            required: true,
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'price_list',
                            title: baticApp.app.__lang('Price List'),
                            type: 'Link',
                            doctype: 'Item Price',
                            link: {
                                txt: '',
                                doctype: 'Price List',
                                ignore_user_permissions: 1,
                                reference_doctype: 'Item Price'
                            },
                            required: true
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'price_list_rate',
                            title: baticApp.app.__lang('Rate'),
                            type: 'Currency',
                            required: true
                        }
                    }
                ]
            }
        ]
    },
    'price-list': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'price_list_name',
                            title: baticApp.app.__lang('Price List Name'),
                            type: 'Data',
                            required: true
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'currency',
                            title: baticApp.app.__lang('Price List Name'),
                            type: 'Link',
                            doctype: 'Item Price',
                            link: {
                                txt: '',
                                doctype: 'Currency',
                                ignore_user_permissions: 0,
                                reference_doctype: 'Price List'
                            },
                            default_value: baticApp.app.defaults.currency,
                            required: true
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'enabled',
                            title: baticApp.app.__lang('Enabled'),
                            type: 'Check',
                            default_value: 1
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'buying',
                            title: baticApp.app.__lang('Buying'),
                            type: 'Check',
                            default_value: 0
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'selling',
                            title: baticApp.app.__lang('Selling'),
                            type: 'Check',
                            default_value: 0
                        }
                    },
                ]
            }
        ]
    },
    'warehouse': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'warehouse_name',
                            title: baticApp.app.__lang('Warehouse Name'),
                            type: 'Data',
                            required: true
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'company',
                            title: baticApp.app.__lang('Company'),
                            type: 'Link',
                            doctype: 'Warehouse',
                            link: {
                                txt: '',
                                doctype: 'Company',
                                ignore_user_permissions: 0,
                                reference_doctype: 'Warehouse'
                            },
                            default_value: baticApp.app.defaults.company,
                            required: true
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'disabled',
                            title: baticApp.app.__lang('Disabled'),
                            type: 'Check',
                            default_value: 0
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'is_group',
                            title: baticApp.app.__lang('Is Group'),
                            type: 'Check',
                            default_value: 0
                        }
                    }
                ]
            }
        ]
    },
    'stock-entry': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'naming_series',
                            title: baticApp.app.__lang('Series'),
                            type: 'Select',
                            required: true,
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'company',
                            title: baticApp.app.__lang('Company'),
                            type: 'Link',
                            doctype: 'Stock Entry',
                            required: true,
                            link: {
                                txt: '',
                                doctype: 'Company',
                                reference_doctype: 'Stock Entry',
                                filters: {}
                            },
                            default_value: baticApp.app.defaults.company
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'stock_entry_type',
                            title: baticApp.app.__lang('Stock Entry Type'),
                            type: 'Link',
                            doctype: 'Stock Entry',
                            required: true,
                            link: {
                                txt: '',
                                doctype: 'Stock Entry Type',
                                reference_doctype: 'Stock Entry',
                                filters: {}
                            }
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'posting_date',
                            title: baticApp.app.__lang('Posting Date'),
                            type: 'Date',
                            default_value: baticApp.app.datetime._date('YYYY-MM-DD'),
                            required: true
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'posting_time',
                            title: baticApp.app.__lang('Posting Time'),
                            type: 'Time',
                            default_value: baticApp.app.datetime._date('HH:mm:ss'),
                            required: true
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'from_warehouse',
                            title: baticApp.app.__lang('Default Source Warehouse'),
                            type: 'Link',
                            doctype: 'Stock Entry',
                            required: true,
                            link: {
                                txt: '',
                                doctype: 'Warehouse',
                                ignore_user_permissions: 0,
                                reference_doctype: 'Stock Entry',
                                filters: JSON.stringify([["Warehouse", "company", "in", ["", baticApp.app.defaults.company]], ["Warehouse", "is_group", "=", 0]])
                            }
                        }
                    },
                    {
                        col: 12,
                        field: {
                            name: 'items',
                            title: baticApp.app.__lang('Items'),
                            type: 'Table',
                            doctype: 'Stock Entry',
                            addButtonTitle: baticApp.app.__lang('Add Item'),
                            fields: [
                                {
                                    name: 's_warehouse',
                                    title: baticApp.app.__lang('Source Warehouse'),
                                    type: 'Link',
                                    doctype: 'Stock Entry Detail',
                                    link: {
                                        txt: '',
                                        doctype: 'Warehouse',
                                        reference_doctype: 'Stock Entry Detail',
                                        ignore_user_permissions: 0,
                                        filters: JSON.stringify([["Warehouse", "company", "in", ["", baticApp.app.defaults.company]], ["Warehouse", "is_group", "=", 0]])
                                    }
                                },
                                {
                                    name: 't_warehouse',
                                    title: baticApp.app.__lang('Target Warehouse'),
                                    type: 'Link',
                                    doctype: 'Stock Entry Detail',
                                    link: {
                                        txt: '',
                                        doctype: 'Warehouse',
                                        reference_doctype: 'Stock Entry Detail',
                                        ignore_user_permissions: 0,
                                        filters: JSON.stringify([["Warehouse", "company", "in", ["", baticApp.app.defaults.company]], ["Warehouse", "is_group", "=", 0]])
                                    }
                                },
                                {
                                    name: 'item_code',
                                    title: baticApp.app.__lang('Item Code'),
                                    type: 'Link',
                                    doctype: 'Stock Entry Detail',
                                    link: {
                                        txt: '',
                                        doctype: 'Item',
                                        reference_doctype: 'Stock Entry Detail',
                                        ignore_user_permissions: 0,
                                        filters: JSON.stringify({"is_stock_item": 1})
                                    }
                                },
                                {
                                    name: 'qty',
                                    title: baticApp.app.__lang('QTY'),
                                    type: 'Float'
                                },
                                {
                                    name: 'basic_rate',
                                    title: baticApp.app.__lang('Basic Rate (as per Stock UOM)'),
                                    type: 'Currency'
                                }
                            ]
                        }
                    }
                ]
            },
        ]
    },
    'stock-reconciliation': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'naming_series',
                            title: baticApp.app.__lang('Series'),
                            type: 'Select',
                            required: true,
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'company',
                            title: baticApp.app.__lang('Company'),
                            type: 'Link',
                            doctype: 'Stock Reconciliation',
                            required: true,
                            link: {
                                txt: '',
                                doctype: 'Company',
                                reference_doctype: 'Stock Reconciliation',
                            },
                            default_value: baticApp.app.defaults.company
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'purpose',
                            title: baticApp.app.__lang('Purpose'),
                            type: 'Select',
                            required: true
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'posting_date',
                            title: baticApp.app.__lang('Posting Date'),
                            type: 'Date',
                            default_value: baticApp.app.datetime._date('YYYY-MM-DD'),
                            required: true
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'posting_time',
                            title: baticApp.app.__lang('Posting Time'),
                            type: 'Time',
                            default_value: baticApp.app.datetime._date('HH:mm:ss'),
                            required: true
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'expense_account',
                            title: baticApp.app.__lang('Difference Account'),
                            type: 'Link',
                            doctype: 'Stock Reconciliation',
                            link: {
                                txt: '',
                                doctype: 'Account',
                                ignore_user_permissions: 0,
                                reference_doctype: 'Stock Reconciliation',
                                filters: JSON.stringify({"company": baticApp.app.defaults.company, "is_group": 0})
                            },
                            default_value: ' '
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'cost_center',
                            title: baticApp.app.__lang('Cost Center'),
                            type: 'Link',
                            doctype: 'Stock Reconciliation',
                            link: {
                                txt: '',
                                doctype: 'Cost Center',
                                ignore_user_permissions: 0,
                                reference_doctype: 'Stock Reconciliation',
                                query: 'erpnext.controllers.queries.get_filtered_dimensions',
                                filters: JSON.stringify({"dimension": "cost_center", "account": "", "company": baticApp.app.defaults.company})
                            },
                            default_value: ' '
                        }
                    },
                    {
                        col: 12,
                        field: {
                            name: 'items',
                            title: baticApp.app.__lang('Items'),
                            type: 'Table',
                            doctype: 'Stock Entry',
                            addButtonTitle: baticApp.app.__lang('Add Item'),
                            fields: [
                                {
                                    name: 'item_code',
                                    title: baticApp.app.__lang('Item Code'),
                                    type: 'Link',
                                    doctype: 'Stock Reconciliation Item',
                                    link: {
                                        txt: '',
                                        doctype: 'Item',
                                        reference_doctype: 'Stock Reconciliation Item',
                                        ignore_user_permissions: 0,
                                        filters: JSON.stringify({"is_stock_item": 1})
                                    }
                                },
                                {
                                    name: 'warehouse',
                                    title: baticApp.app.__lang('Warehouse'),
                                    type: 'Link',
                                    doctype: 'Stock Reconciliation Item',
                                    link: {
                                        txt: '',
                                        doctype: 'Warehouse',
                                        reference_doctype: 'Stock Reconciliation Item',
                                        ignore_user_permissions: 0,
                                        filters: JSON.stringify([["Warehouse", "company", "in", ["", baticApp.app.defaults.company]], ["Warehouse", "is_group", "=", 0]])
                                    }
                                },
                                {
                                    name: 'qty',
                                    title: baticApp.app.__lang('Quantity'),
                                    type: 'Float'
                                },
                                {
                                    name: 'valuation_rate',
                                    title: baticApp.app.__lang('Valuation Rate'),
                                    type: 'Currency'
                                }
                            ]
                        }
                    }
                ]
            },
        ]
    },
    'product-bundle': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'new_item_code',
                            title: baticApp.app.__lang('Parent Item'),
                            type: 'Link',
                            required: true,
                            doctype: 'Product Bundle',
                            link: {
                                txt: '',
                                doctype: 'Item',
                                reference_doctype: 'Product Bundle',
                                ignore_user_permissions: 0,
                                query: 'erpnext.selling.doctype.product_bundle.product_bundle.get_new_item_code'
                            },
                            allow_new: true,
                            newButtonText: baticApp.app.__lang('Create New Item'),
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'description',
                            title: baticApp.app.__lang('Description'),
                            type: 'Data'
                        }
                    },
                    {
                        col: 12,
                        field: {
                            name: 'items',
                            title: baticApp.app.__lang('Items'),
                            type: 'Table',
                            doctype: 'Product Bundle',
                            addButtonTitle: baticApp.app.__lang('Add Item'),
                            fields: [
                                {
                                    name: 'item_code',
                                    title: baticApp.app.__lang('Item Code'),
                                    type: 'Link',
                                    doctype: 'Product Bundle',
                                    link: {
                                        txt: '',
                                        doctype: 'Item',
                                        reference_doctype: 'Product Bundle Item',
                                        ignore_user_permissions: 0
                                    }
                                },
                                {
                                    name: 'qty',
                                    title: baticApp.app.__lang('Qty'),
                                    type: 'Float'
                                },
                                {
                                    name: 'description',
                                    title: baticApp.app.__lang('Description'),
                                    type: 'Data'
                                },
                                {
                                    name: 'uom',
                                    title: baticApp.app.__lang('UOM'),
                                    type: 'Data',
                                    disabled: true
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    },

    /*
    * Selling Forms
    */
    'customer': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 4,
                        field: {
                            name: 'image',
                            title: baticApp.app.__lang('Item Image'),
                            type: 'Attach Image',
                        }
                    },
                    {
                        col: 4,
                        field: {
                            name: 'customer_name',
                            title: baticApp.app.__lang('Full Name'),
                            type: 'Data',
                            required: true,
                        }
                    },
                    {
                        col: 4,
                        field: {
                            name: 'customer_name_in_arabic',
                            title: baticApp.app.__lang('Customer Name in Arabic'),
                            type: 'Data'
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'customer_group',
                            title: baticApp.app.__lang('Customer Group'),
                            type: 'Link',
                            doctype: 'Customer',
                            link: {
                                txt: '',
                                doctype: 'Customer Group',
                                reference_doctype: 'Customer',
                                ignore_user_permissions: 0,
                                filters: JSON.stringify({"is_group": 0})
                            },
                            required: true,
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'territory',
                            title: baticApp.app.__lang('Territory'),
                            type: 'Link',
                            doctype: 'Customer',
                            link: {
                                txt: '',
                                doctype: 'Territory',
                                reference_doctype: 'Customer',
                                ignore_user_permissions: 0,
                                filters: {}
                            },
                            required: true,
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
                            name: 'customer_type',
                            title: baticApp.app.__lang('Type'),
                            type: 'Select'
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'tax_id',
                            title: baticApp.app.__lang('Tax ID'),
                            type: 'Data'
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'address',
                            title: baticApp.app.__lang('Address'),
                            type: 'Data'
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'default_mobile',
                            title: baticApp.app.__lang('Phone'),
                            type: 'Data'
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'default_mobile',
                            title: baticApp.app.__lang('Email'),
                            type: 'Data'
                        }
                    }
                ]
            }
        ]
    },
    'customer-group': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'customer_group_name',
                            title: baticApp.app.__lang('Customer Group Name'),
                            type: 'Data',
                            required: true,
                            disabled_on_edit: true
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'parent_customer_group',
                            title: baticApp.app.__lang('Parent Customer Group'),
                            type: 'Link',
                            doctype: 'Customer Group',
                            link: {
                                txt: '',
                                doctype: 'Customer Group',
                                reference_doctype: 'Customer Group',
                                ignore_user_permissions: 1,
                                filters: JSON.stringify({"is_group": 1, "name": ["!=", null]})
                            },
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 3,
                        field: {
                            name: 'is_group',
                            title: baticApp.app.__lang('Is Group'),
                            type: 'Check',
                            default_value: 0
                        }
                    }
                ]
            }
        ]
    },
    'sales-partner': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'partner_name',
                            title: baticApp.app.__lang('Sales Partner Name'),
                            type: 'Data',
                            required: true
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'commission_rate',
                            title: baticApp.app.__lang('Commission Rate'),
                            type: 'Float',
                            default_value: '0',
                            required: true
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'partner_type',
                            title: baticApp.app.__lang('Partner Type'),
                            type: 'Link',
                            doctype: 'Sales Partner Type',
                            link: {
                                txt: '',
                                doctype: 'Sales Partner Type',
                                reference_doctype: 'Sales Partner',
                                gnore_user_permissions: 0
                            }
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'territory',
                            title: baticApp.app.__lang('Territory'),
                            type: 'Link',
                            doctype: 'Territory',
                            link: {
                                txt: '',
                                doctype: 'Territory',
                                reference_doctype: 'Sales Partner',
                                gnore_user_permissions: 0,
                            },
                            required: true
                        }
                    }
                ]
            }
        ]
    },
    'sales-order': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'naming_series',
                            title: baticApp.app.__lang('Series'),
                            type: 'Select',
                            required: true,
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'company',
                            title: baticApp.app.__lang('Company'),
                            type: 'Link',
                            doctype: 'Company',
                            link: {
                                txt: '',
                                doctype: 'Company',
                                reference_doctype: 'Sales Order',
                                filters: {}
                            },
                            required: true,
                            default_value: baticApp.app.defaults.company,
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'customer',
                            title: baticApp.app.__lang('Customer'),
                            type: 'Link',
                            doctype: 'Sales Order',
                            link: {
                                txt: '',
                                doctype: 'Customer',
                                ignore_user_permissions: 0,
                                query: 'erpnext.controllers.queries.customer_query',
                                reference_doctype: 'Sales Order'
                            },
                            required: true
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'transaction_date',
                            title: baticApp.app.__lang('Date'),
                            type: 'Date',
                            default_value: baticApp.app.datetime._date('YYYY-MM-DD'),
                            required: true
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'delivery_date',
                            title: baticApp.app.__lang('Delivery Date'),
                            type: 'Date'
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'items',
                            title: baticApp.app.__lang('Items'),
                            type: 'Table',
                            doctype: 'Sales Order',
                            addButtonTitle: baticApp.app.__lang('Add Item'),
                            fields: [
                                {
                                    name: 'item_code',
                                    title: baticApp.app.__lang('Item'),
                                    type: 'Link',
                                    link: {
                                        txt: '',
                                        doctype: 'Item',
                                        ignore_user_permissions: 0,
                                        reference_doctype: 'Purchase Order Item',
                                        query: 'erpnext.controllers.queries.item_query',
                                        filters: JSON.stringify({"is_purchase_item": 1, "has_variants": 0})
                                    }
                                },
                                {
                                    name: 'delivery_date',
                                    title: baticApp.app.__lang('Delivery Date'),
                                    type: 'Date'
                                },
                                {
                                    name: 'uom',
                                    title: baticApp.app.__lang('UOM'),
                                    type: 'Link',
                                    link: {
                                        txt: '',
                                        doctype: 'UOM',
                                        ignore_user_permissions: 0,
                                        reference_doctype: 'Purchase Order Item'
                                    }
                                },
                                {
                                    name: 'qty',
                                    title: baticApp.app.__lang('Quantity'),
                                    type: 'Float'
                                },
                                {
                                    name: 'rate',
                                    title: baticApp.app.__lang('Rate') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Currency'
                                },
                                {
                                    name: 'amount',
                                    title: baticApp.app.__lang('Amount') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Currency',
                                    value: ('form.update_stock'),
                                    disabled: true
                                }
                            ]
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'taxes_and_charges',
                            title: baticApp.app.__lang('Sales Taxes and Charges Template'),
                            type: 'Link',
                            doctype: 'Sales Order',
                            link: {
                                txt: '',
                                doctype: 'Sales Taxes and Charges Template',
                                reference_doctype: 'Sales Order',
                                ignore_user_permissions: 0,
                                filters: JSON.stringify([["company", "=", baticApp.app.defaults.company], ["docstatus", "!=", 2]])
                            }
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'taxes',
                            title: baticApp.app.__lang('Taxes and Charges'),
                            type: 'Table',
                            doctype: 'Sales Invoice',
                            addButtonTitle: baticApp.app.__lang('Add Tax'),
                            fields: [
                                {
                                    name: 'charge_type',
                                    title: baticApp.app.__lang('Type'),
                                    type: 'Select',
                                    doctype: 'Sales Taxes and Charges'
                                },
                                {
                                    name: 'account_head',
                                    title: baticApp.app.__lang('Account Head'),
                                    type: 'Link',
                                    link: {
                                        txt: '',
                                        doctype: 'Account',
                                        reference_doctype: 'Purchase Taxes and Charges',
                                        query: 'erpnext.controllers.queries.tax_account_query',
                                        ignore_user_permissions: 0,
                                        filters: {"account_type": ["Tax", "Chargeable", "Income Account", "Expenses Included In Valuation"], "company": baticApp.app.defaults.company}
                                    }
                                },
                                {
                                    name: 'rate',
                                    title: baticApp.app.__lang('Rate'),
                                    type: 'Float',
                                    disabled: true
                                },
                                {
                                    name: 'tax_amount',
                                    title: baticApp.app.__lang('Amount') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Currency',
                                    disabled: true
                                },
                                {
                                    name: 'total',
                                    title: baticApp.app.__lang('Total') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Float',
                                    disabled: true
                                }
                            ]
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 4,
                        offset: 8,
                        field: {
                            name: 'total',
                            title: baticApp.app.__lang('Total') + ` (${baticApp.app.defaults.currency})`,
                            type: 'Currency',
                            disabled: true
                        }
                    },
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 4,
                        offset: 8,
                        field: {
                            name: 'total_taxes_and_charges',
                            title: baticApp.app.__lang('Total Taxes and Charges') + ` (${baticApp.app.defaults.currency})`,
                            type: 'Currency',
                            disabled: true
                        }
                    },
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 4,
                        offset: 8,
                        field: {
                            name: 'grand_total',
                            title: baticApp.app.__lang('Grand Total') + ` (${baticApp.app.defaults.currency})`,
                            type: 'Currency',
                            disabled: true
                        }
                    },
                ]
            }
        ]
    },
    'sales-invoice': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'naming_series',
                            title: baticApp.app.__lang('Series'),
                            type: 'Select',
                            required: true,
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'company',
                            title: baticApp.app.__lang('Company'),
                            type: 'Link',
                            doctype: 'Sales Invoice',
                            link: {
                                txt: '',
                                doctype: 'Company',
                                reference_doctype: 'Sales Invoice',
                                filters: {}
                            },
                            required: true,
                            default_value: baticApp.app.defaults.company,
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'customer',
                            title: baticApp.app.__lang('Customer'),
                            type: 'Link',
                            doctype: 'Sales Invoice',
                            link: {
                                txt: '',
                                doctype: 'Customer',
                                reference_doctype: 'Sales Invoice',
                                filters: JSON.stringify({"disabled": 0})
                            },
                            required: true
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'posting_date',
                            title: baticApp.app.__lang('Date'),
                            type: 'Date',
                            default_value: baticApp.app.datetime._date('YYYY-MM-DD'),
                            required: true
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'posting_time',
                            title: baticApp.app.__lang('Posting Time'),
                            type: 'Time',
                            default_value: baticApp.app.datetime._date('HH:mm:ss'),
                            required: true
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'set_warehouse',
                            title: baticApp.app.__lang('Warehouse'),
                            type: 'Link',
                            doctype: 'Sales Invoice',
                            link: {
                                txt: '',
                                doctype: 'Warehouse',
                                reference_doctype: 'Sales Invoice',
                                filters: {}
                            },
                            required: false,
                            depends_on: ('form.update_stock==1')
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'due_date',
                            title: baticApp.app.__lang('Payment Due Date'),
                            type: 'Date',
                            required: true,
                            default_value: baticApp.app.datetime._date('YYYY-MM-DD')
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'is_return',
                            title: baticApp.app.__lang('Is Return (Credit Note)'),
                            type: 'Check',
                            default_value: 0,
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'currency',
                            title: baticApp.app.__lang('Currency'),
                            type: 'Link',
                            doctype: 'Currency',
                            link: {
                                txt: '',
                                doctype: 'Currency',
                                reference_doctype: 'Sales Invoice',
                                ignore_user_permissions: 0
                            },
                            default_value: baticApp.app.defaults.currency,
                            required: true,
                            disabled: true
                        }
                    },
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'selling_price_list',
                                title: baticApp.app.__lang('Price List'),
                                type: 'Link',
                                doctype: 'Price List',
                                link: {
                                    txt: '',
                                    doctype: 'Price List',
                                    reference_doctype: 'Sales Invoice',
                                    filters: {"selling": 1},
                                    ignore_user_permissions: 0
                                },
                                required: true
                            },
                            {
                                name: 'ignore_pricing_rule',
                                title: baticApp.app.__lang('Ignore Pricing Rule'),
                                type: 'Check',
                                default_value: 0,
                            }
                        ]
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('Items'),
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'update_stock',
                            title: baticApp.app.__lang('Update Stock'),
                            type: 'Check',
                            default_value: 1,
                        }
                    },
                    {
                        col: 12,
                        field: {
                            name: 'items',
                            title: baticApp.app.__lang('Items'),
                            type: 'Table',
                            doctype: 'Sales Invoice',
                            addButtonTitle: baticApp.app.__lang('Add Item'),
                            fields: [
                                {
                                    name: 'item_code',
                                    title: baticApp.app.__lang('Item'),
                                    type: 'Link',
                                    doctype: 'Sales Invoice Item',
                                    link: {
                                        txt: '',
                                        doctype: 'Item',
                                        reference_doctype: 'Sales Invoice Item',
                                        query: 'erpnext.controllers.queries.item_query',
                                        ignore_user_permissions: 0,
                                        filters: JSON.stringify({"is_sales_item": 1})
                                    }
                                },
                                {
                                    name: 'uom',
                                    title: baticApp.app.__lang('UOM'),
                                    type: 'Link',
                                    doctype: 'Sales Invoice Item',
                                    link: {
                                        txt: '',
                                        doctype: 'UOM',
                                        reference_doctype: 'Sales Invoice Item'
                                    }
                                },
                                {
                                    name: 'qty',
                                    title: baticApp.app.__lang('Quantity'),
                                    type: 'Float'
                                },
                                {
                                    name: 'rate',
                                    title: baticApp.app.__lang('Rate') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Currency'
                                },
                                {
                                    name: 'amount',
                                    title: baticApp.app.__lang('Amount') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Currency',
                                    value: ('form.update_stock'),
                                    disabled: true
                                }
                            ]
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'taxes_and_charges',
                            title: baticApp.app.__lang('Sales Taxes and Charges Template'),
                            type: 'Link',
                            doctype: 'Sales Invoice',
                            link: {
                                txt: '',
                                doctype: 'Sales Taxes and Charges Template',
                                reference_doctype: 'Sales Invoice',
                                ignore_user_permissions: 0,
                                filters: JSON.stringify([["company", "=", baticApp.app.defaults.company], ["docstatus", "!=", 2]])
                            },
                            required: false
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'taxes',
                            title: baticApp.app.__lang('Taxes and Charges'),
                            type: 'Table',
                            doctype: 'Sales Invoice',
                            addButtonTitle: baticApp.app.__lang('Add Tax'),
                            fields: [
                                {
                                    name: 'charge_type',
                                    title: baticApp.app.__lang('Type'),
                                    type: 'Select',
                                    doctype: 'Sales Taxes and Charges'
                                },
                                {
                                    name: 'account_head',
                                    title: baticApp.app.__lang('Account Head'),
                                    type: 'Link',
                                    doctype: 'Sales Taxes and Charges',
                                    link: {
                                        txt: '',
                                        doctype: 'Account',
                                        reference_doctype: 'Sales Taxes and Charges',
                                        query: 'erpnext.controllers.queries.tax_account_query',
                                        ignore_user_permissions: 0,
                                        filters: {"account_type": ["Tax", "Chargeable", "Expense Account"], "company": baticApp.app.defaults.company}
                                    }
                                },
                                {
                                    name: 'rate',
                                    title: baticApp.app.__lang('Rate'),
                                    type: 'Float',
                                    disabled: true
                                },
                                {
                                    name: 'tax_amount',
                                    title: baticApp.app.__lang('Amount') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Currency',
                                    disabled: true
                                },
                                {
                                    name: 'total',
                                    title: baticApp.app.__lang('Total') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Float',
                                    disabled: true
                                }
                            ]
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 4,
                        offset: 8,
                        field: {
                            name: 'total',
                            title: baticApp.app.__lang('Total') + ` (${baticApp.app.defaults.currency})`,
                            type: 'Currency',
                            disabled: true
                        }
                    },
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 4,
                        offset: 8,
                        field: {
                            name: 'total_taxes_and_charges',
                            title: baticApp.app.__lang('Total Taxes and Charges') + ` (${baticApp.app.defaults.currency})`,
                            type: 'Currency',
                            disabled: true
                        }
                    },
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 4,
                        offset: 8,
                        field: {
                            name: 'grand_total',
                            title: baticApp.app.__lang('Grand Total') + ` (${baticApp.app.defaults.currency})`,
                            type: 'Currency',
                            disabled: true
                        }
                    },
                ]
            }
        ]
    },
    'quotation': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'naming_series',
                            title: baticApp.app.__lang('Series'),
                            type: 'Select',
                            required: true,
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'company',
                            title: baticApp.app.__lang('Company'),
                            type: 'Link',
                            doctype: 'Quotation',
                            link: {
                                txt: '',
                                doctype: 'Company',
                                reference_doctype: 'Quotation',
                                filters: {}
                            },
                            required: true,
                            default_value: baticApp.app.defaults.company,
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'quotation_to',
                            title: baticApp.app.__lang('Quotation To'),
                            type: 'Link',
                            doctype: 'Quotation',
                            link: {
                                txt: '',
                                doctype: 'DocType',
                                reference_doctype: 'Quotation',
                                filters: JSON.stringify({"name": ["in", ["Customer", "Lead"]]})
                            },
                            required: false,
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'transaction_date',
                            title: baticApp.app.__lang('Date'),
                            type: 'Date',
                            default_value: baticApp.app.datetime._date('YYYY-MM-DD'),
                            required: true
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'valid_till',
                            title: baticApp.app.__lang('Valid Till'),
                            type: 'Date',
                            default_value: baticApp.app.datetime._date('YYYY-MM-DD', false, 1),
                            required: true
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'party_name',
                                title: baticApp.app.__lang('Customer'),
                                type: 'Link',
                                doctype: 'Quotation',
                                link: {
                                    txt: '',
                                    doctype: 'Customer',
                                    ignore_user_permissions: 0,
                                    reference_doctype: 'Quotation'
                                },
                                required: true,
                                depends_on: ("form.quotation_to=='Customer'")
                            },
                            {
                                name: 'party_name',
                                title: baticApp.app.__lang('Lead'),
                                type: 'Link',
                                doctype: 'Quotation',
                                link: {
                                    txt: '',
                                    doctype: 'Lead',
                                    ignore_user_permissions: 0,
                                    reference_doctype: 'Quotation',
                                    query: 'erpnext.controllers.queries.lead_query'
                                },
                                required: true,
                                depends_on: ("form.quotation_to=='Lead'")
                            }
                        ]
                    },
                    {
                        col: 6,
                        field: {
                            name: 'order_type',
                            title: baticApp.app.__lang('Order Type'),
                            type: 'Select',
                            required: true,
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'items',
                            title: baticApp.app.__lang('Items'),
                            type: 'Table',
                            doctype: 'Sales Invoice',
                            addButtonTitle: baticApp.app.__lang('Add Item'),
                            fields: [
                                {
                                    name: 'item_code',
                                    title: baticApp.app.__lang('Item'),
                                    type: 'Link',
                                    link: {
                                        txt: '',
                                        doctype: 'Item',
                                        reference_doctype: 'Sales Invoice Item',
                                        query: 'erpnext.controllers.queries.item_query',
                                        ignore_user_permissions: 0,
                                        filters: JSON.stringify({"is_sales_item": 1})
                                    }
                                },
                                {
                                    name: 'uom',
                                    title: baticApp.app.__lang('UOM'),
                                    type: 'Link',
                                    link: {
                                        txt: '',
                                        doctype: 'UOM',
                                        reference_doctype: 'Sales Invoice Item'
                                    }
                                },
                                {
                                    name: 'qty',
                                    title: baticApp.app.__lang('Quantity'),
                                    type: 'Float',
                                    default_value: 0
                                },
                                {
                                    name: 'rate',
                                    title: baticApp.app.__lang('Rate') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Currency',
                                    default_value: 0
                                },
                                {
                                    name: 'amount',
                                    title: baticApp.app.__lang('Amount') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Currency',
                                    value: ('form.update_stock'),
                                    disabled: true,
                                    default_value: 0
                                }
                            ]
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'taxes_and_charges',
                            title: baticApp.app.__lang('Sales Taxes and Charges Template'),
                            type: 'Link',
                            doctype: 'Sales Taxes and Charges Template',
                            link: {
                                txt: '',
                                doctype: 'Sales Taxes and Charges Template',
                                reference_doctype: 'Sales Invoice',
                                ignore_user_permissions: 0,
                                filters: JSON.stringify([["company", "=", baticApp.app.defaults.company], ["docstatus", "!=", 2]])
                            },
                            required: false
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'taxes',
                            title: baticApp.app.__lang('Taxes and Charges'),
                            type: 'Table',
                            doctype: 'Sales Invoice',
                            addButtonTitle: baticApp.app.__lang('Add Tax'),
                            fields: [
                                {
                                    name: 'charge_type',
                                    title: baticApp.app.__lang('Type'),
                                    type: 'Select',
                                    doctype: 'Sales Taxes and Charges'
                                },
                                {
                                    name: 'account_head',
                                    title: baticApp.app.__lang('Account Head'),
                                    type: 'Link',
                                    link: {
                                        txt: '',
                                        doctype: 'Account',
                                        reference_doctype: 'Sales Taxes and Charges',
                                        query: 'erpnext.controllers.queries.tax_account_query',
                                        ignore_user_permissions: 0,
                                        filters: {"account_type": ["Tax", "Chargeable", "Expense Account"], "company": baticApp.app.defaults.company}
                                    }
                                },
                                {
                                    name: 'rate',
                                    title: baticApp.app.__lang('Rate'),
                                    type: 'Float',
                                    disabled: true
                                },
                                {
                                    name: 'tax_amount',
                                    title: baticApp.app.__lang('Amount') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Currency',
                                    disabled: true
                                },
                                {
                                    name: 'total',
                                    title: baticApp.app.__lang('Total') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Float',
                                    disabled: true
                                }
                            ]
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 4,
                        offset: 8,
                        field: {
                            name: 'total',
                            title: baticApp.app.__lang('Total') + ` (${baticApp.app.defaults.currency})`,
                            type: 'Currency',
                            disabled: true
                        }
                    },
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 4,
                        offset: 8,
                        field: {
                            name: 'total_taxes_and_charges',
                            title: baticApp.app.__lang('Total Taxes and Charges') + ` (${baticApp.app.defaults.currency})`,
                            type: 'Currency',
                            disabled: true
                        }
                    },
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 4,
                        offset: 8,
                        field: {
                            name: 'grand_total',
                            title: baticApp.app.__lang('Grand Total') + ` (${baticApp.app.defaults.currency})`,
                            type: 'Currency',
                            disabled: true
                        }
                    },
                ]
            }
        ]
    },
    'selling-settings': {
        form: [
            {
                type: 'row',
                title: baticApp.app.__lang('Customer Defaults'),
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'cust_master_name',
                            title: baticApp.app.__lang('Customer Naming By'),
                            type: 'Select'
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'territory',
                            title: baticApp.app.__lang('Default Territory'),
                            type: 'Link',
                            doctype: 'Territory',
                            link: {
                                txt: '',
                                doctype: 'Territory',
                                reference_doctype: 'Selling Settings',
                                ignore_user_permissions: 0
                            }
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'customer_group',
                            title: baticApp.app.__lang('Default Customer Group'),
                            type: 'Link',
                            doctype: 'Customer Group',
                            link: {
                                txt: '',
                                doctype: 'Customer Group',
                                reference_doctype: 'Selling Settings',
                                ignore_user_permissions: 0
                            }
                        }
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('Item Price Settings'),
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'selling_price_list',
                            title: baticApp.app.__lang('Default Price List'),
                            type: 'Link',
                            doctype: 'Price List',
                            link: {
                                txt: '',
                                doctype: 'Price List',
                                reference_doctype: 'Selling Settings',
                                ignore_user_permissions: 0
                            }
                        }
                    },
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'maintain_same_sales_rate',
                                title: baticApp.app.__lang('Maintain Same Rate Throughout Sales Cycle'),
                                type: 'Check',
                                default_value: 0
                            },
                            {
                                name: 'editable_price_list_rate',
                                title: baticApp.app.__lang('Allow User to Edit Price List Rate in Transactions'),
                                type: 'Check',
                                default_value: 0
                            },
                            {
                                name: 'validate_selling_price',
                                title: baticApp.app.__lang('Validate Selling Price for Item Against Purchase Rate or Valuation Rate'),
                                type: 'Check',
                                default_value: 0
                            },
                            {
                                name: 'editable_bundle_item_rates',
                                title: baticApp.app.__lang('Calculate Product Bundle Price based on Child Items\' Rates'),
                                type: 'Check',
                                default_value: 0
                            }
                        ]
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('Transaction Settings'),
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'so_required',
                            title: baticApp.app.__lang('Is Sales Order Required for Sales Invoice & Delivery Note Creation?'),
                            type: 'Select'
                        }
                    },
                    {
                        col: 12,
                        field: {
                            name: 'dn_required',
                            title: baticApp.app.__lang('Is Delivery Note Required for Sales Invoice Creation?'),
                            type: 'Select'
                        }
                    },
                    {
                        col: 12,
                        field: {
                            name: 'sales_update_frequency',
                            title: baticApp.app.__lang('Sales Update Frequency'),
                            description: baticApp.app.__lang('How often should Project and Company be updated based on Sales Transactions?'),
                            type: 'Select',
                            required: true
                        }
                    },
                    {
                        col: 12,
                        field: {
                            name: 'allow_multiple_items',
                            title: baticApp.app.__lang('Allow Item to Be Added Multiple Times in a Transaction'),
                            type: 'Check',
                            default_value: 0
                        }
                    },
                    {
                        col: 12,
                        field: {
                            name: 'allow_against_multiple_purchase_orders',
                            title: baticApp.app.__lang("Allow Multiple Sales Orders Against a Customer's Purchase Order"),
                            type: 'Check',
                            default_value: 0
                        }
                    },
                    {
                        col: 12,
                        field: {
                            name: 'hide_tax_id',
                            title: baticApp.app.__lang("Hide Customer's Tax ID from Sales Transactions"),
                            type: 'Check',
                            default_value: 0
                        }
                    }
                ]
            },
        ]
    },
    'pos-profile': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        fields: [
                            {
                                name: '__newname',
                                title: baticApp.app.__lang('Name'),
                                type: 'Data',
                                required: true,
                                depends_on: ('form._form_view_type=="new"')

                            },
                            {
                                name: 'company',
                                title: baticApp.app.__lang('Company'),
                                type: 'Link',
                                doctype: 'POS Profile',
                                link: {
                                    txt: '',
                                    doctype: 'Company',
                                    reference_doctype: 'POS Profile',
                                    ignore_user_permissions: 0
                                },
                                default_value: baticApp.app.defaults.company,
                                required: true
                            },
                            {
                                name: 'customer',
                                title: baticApp.app.__lang('Customer'),
                                type: 'Link',
                                doctype: 'POS Profile',
                                link: {
                                    txt: '',
                                    doctype: 'Customer',
                                    reference_doctype: 'POS Profile',
                                    ignore_user_permissions: 0
                                }
                            },
                            {
                                name: 'country',
                                title: baticApp.app.__lang('Country'),
                                type: 'Data',
                                readonly_on: true,
                                depends_on: ('form.company')
                            },
                            {
                                name: 'location',
                                title: baticApp.app.__lang('Location'),
                                type: 'Link',
                                doctype: 'POS Profile',
                                link: {
                                    txt: '',
                                    doctype: 'Location',
                                    reference_doctype: 'POS Profile',
                                    ignore_user_permissions: 0
                                }
                            },
                            {
                                name: 'disabled',
                                title: baticApp.app.__lang('Disabled'),
                                type: 'Check'
                            }
                        ]
                    },
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'warehouse',
                                title: baticApp.app.__lang('Warehouse'),
                                type: 'Link',
                                doctype: 'POS Profile',
                                link: {
                                    txt: '',
                                    doctype: 'Warehouse',
                                    reference_doctype: 'POS Profile',
                                    ignore_user_permissions: 0
                                },
                                required: true,
                                depends_on: ('form._form_view_type=="new"')
                            },
                            {
                                name: 'campaign',
                                title: baticApp.app.__lang('Campaign'),
                                type: 'Link',
                                doctype: 'POS Profile',
                                link: {
                                    txt: '',
                                    doctype: 'Campaign',
                                    reference_doctype: 'POS Profile',
                                    ignore_user_permissions: 0
                                }
                            },
                            {
                                name: 'company_address',
                                title: baticApp.app.__lang('Company Address'),
                                type: 'Link',
                                doctype: 'POS Profile',
                                link: {
                                    txt: '',
                                    doctype: 'Campaign',
                                    reference_doctype: 'POS Profile',
                                    ignore_user_permissions: 0,
                                    query: 'frappe.contacts.doctype.address.address.address_query'
                                }
                            },
                            {
                                name: 'address',
                                title: baticApp.app.__lang('Address'),
                                type: 'Data'
                            },
                            {
                                name: 'tax_id',
                                title: baticApp.app.__lang('Tax ID'),
                                type: 'Data',
                                readonly_on: true,
                                depends_on: ('form.company')
                            }
                        ]
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('POS Awesome Settings'),
                fields: [
                    {
                        col: 4,
                        fields: [
                            {
                                name: 'posa_cash_mode_of_payment',
                                title: baticApp.app.__lang('Cash Mode of Payment'),
                                description: baticApp.app.__lang('For POS Closing Shift Payment Reconciliation'),
                                type: 'Link',
                                link: {
                                    txt: '',
                                    doctype: 'Mode of Payment',
                                    reference_doctype: 'POS Profile',
                                    filters: {"type": "Cash"},
                                    ignore_user_permissions: 0
                                }
                            },
                            {
                                name: 'posa_allow_delete',
                                title: baticApp.app.__lang('Auto Delete Draft Invoice'),
                                type: 'Check'
                            },
                            {
                                name: 'posa_allow_user_to_edit_rate',
                                title: baticApp.app.__lang('Allow user to edit Rate'),
                                type: 'Check'
                            },
                            {
                                name: 'posa_allow_user_to_edit_additional_discount',
                                title: baticApp.app.__lang('Allow user to edit Additional Discount'),
                                type: 'Check'
                            },
                            {
                                name: 'posa_max_discount_allowed',
                                title: baticApp.app.__lang('Write Off Limit'),
                                type: 'Float',
                                default_value: 0
                            },
                            {
                                name: 'posa_scale_barcode_start',
                                title: baticApp.app.__lang('Scale Barcode Start With'),
                                description: baticApp.app.__lang('It is best not to use more than four numbers'),
                                type: 'Float',
                                default_value: 0
                            },
                        ]
                    },
                    {
                        col: 4,
                        fields: [
                            {
                                name: 'posa_allow_user_to_edit_item_discount',
                                title: baticApp.app.__lang('Allow User to Edit Item Discount'),
                                type: 'Check'
                            },
                            {
                                name: 'posa_display_items_in_stock',
                                title: baticApp.app.__lang('Hide Unavailable Items'),
                                type: 'Check'
                            },
                            {
                                name: 'posa_allow_partial_payment',
                                title: baticApp.app.__lang('Allow Partial Payment'),
                                type: 'Check'
                            },
                            {
                                name: 'posa_allow_credit_sale',
                                title: baticApp.app.__lang('Allow Credit Sale'),
                                type: 'Check'
                            },
                            {
                                name: 'posa_allow_return',
                                title: baticApp.app.__lang('Allow Return'),
                                type: 'Check'
                            },
                            {
                                name: 'posa_apply_customer_discount',
                                title: baticApp.app.__lang('Apply Customer Discount'),
                                type: 'Check'
                            },
                            {
                                name: 'use_cashback',
                                title: baticApp.app.__lang('Use Cashback'),
                                type: 'Check'
                            },
                            {
                                name: 'use_customer_credit',
                                title: baticApp.app.__lang('Use Customer Credit'),
                                type: 'Check'
                            },
                            {
                                name: 'posa_hide_closing_shift',
                                title: baticApp.app.__lang('Hide Close Shift'),
                                type: 'Check'
                            },
                            {
                                name: 'posa_auto_set_batch',
                                title: baticApp.app.__lang('Auto Set Batch'),
                                type: 'Check'
                            },
                            {
                                name: 'posa_display_item_code',
                                title: baticApp.app.__lang('Display Item Code'),
                                type: 'Check'
                            },
                            {
                                name: 'posa_allow_zero_rated_items',
                                title: baticApp.app.__lang('Allow Zero Rated Items'),
                                type: 'Check'
                            }
                        ]
                    },
                    {
                        col: 4,
                        fields: [
                            {
                                name: 'posa_allow_sales_order',
                                title: baticApp.app.__lang('Allow Create Sales Order'),
                                type: 'Check'
                            },
                            {
                                name: 'posa_show_template_items',
                                title: baticApp.app.__lang('Show Template Items'),
                                type: 'Check'
                            },
                            {
                                name: 'posa_fetch_coupon',
                                title: baticApp.app.__lang('Auto Fetch Coupon Gifts'),
                                type: 'Check'
                            },
                            {
                                name: 'posa_allow_customer_purchase_order',
                                title: baticApp.app.__lang('Allow Customer Purchase Order'),
                                type: 'Check'
                            },
                            {
                                name: 'posa_allow_print_last_invoice',
                                title: baticApp.app.__lang('Allow Print Last Invoice'),
                                type: 'Check'
                            },
                            {
                                name: 'posa_display_additional_notes',
                                title: baticApp.app.__lang('Display Additional Notes'),
                                type: 'Check'
                            },
                            {
                                name: 'posa_allow_write_off_change',
                                title: baticApp.app.__lang('Allow Write Off Change'),
                                type: 'Check'
                            },
                            {
                                name: 'posa_new_line',
                                title: baticApp.app.__lang('Allow add New Items on New Line'),
                                type: 'Check'
                            },
                            {
                                name: 'posa_input_qty',
                                title: baticApp.app.__lang('Use QTY Input'),
                                type: 'Check'
                            },
                            {
                                name: 'posa_allow_print_draft_invoices',
                                title: baticApp.app.__lang('Allow Print Draft Invoices'),
                                type: 'Check'
                            },
                            {
                                name: 'posa_use_delivery_charges',
                                title: baticApp.app.__lang('Use Delivery Charges'),
                                type: 'Check'
                            },
                            {
                                name: 'posa_auto_set_delivery_charges',
                                title: baticApp.app.__lang('Auto Set Delivery Charges'),
                                type: 'Check'
                            }
                        ]
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('Users & Payment Methods'),
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'applicable_for_users',
                            title: baticApp.app.__lang('Applicable for Users'),
                            type: 'Table',
                            doctype: 'POS Profile',
                            addButtonTitle: baticApp.app.__lang('Add User'),
                            fields: [
                                {
                                    name: 'default',
                                    title: baticApp.app.__lang('Default'),
                                    type: 'Check',
                                    hide_label: true,
                                    align_center: true,
                                    width: '120px'
                                },
                                {
                                    name: 'user',
                                    title: baticApp.app.__lang('User'),
                                    type: 'Link',
                                    link: {
                                        txt: '',
                                        doctype: 'User',
                                        reference_doctype: 'POS Profile',
                                        ignore_user_permissions: 0
                                    }
                                }
                            ]
                        }
                    },
                    {
                        col: 12,
                        field: {
                            name: 'payments',
                            title: baticApp.app.__lang('Payment Methods'),
                            type: 'Table',
                            doctype: 'POS Profile',
                            addButtonTitle: baticApp.app.__lang('Add User'),
                            fields: [
                                {
                                    name: 'default',
                                    title: baticApp.app.__lang('Default'),
                                    type: 'Check',
                                    hide_label: true,
                                    align_center: true,
                                    width: '120px'
                                },
                                {
                                    name: 'allow_in_returns',
                                    title: baticApp.app.__lang('Allow In Returns'),
                                    type: 'Check',
                                    hide_label: true,
                                    align_center: true,
                                    width: '200px'
                                },
                                {
                                    name: 'mode_of_payment',
                                    title: baticApp.app.__lang('Mode of Payment'),
                                    type: 'Link',
                                    link: {
                                        txt: '',
                                        doctype: 'Mode of Payment',
                                        reference_doctype: 'POS Payment Method',
                                        ignore_user_permissions: 0
                                    }
                                }
                            ]
                        }
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('Configuration'),
                fields: [
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'hide_images',
                                title: baticApp.app.__lang('Hide Images'),
                                type: 'Check'
                            },
                            {
                                name: 'hide_unavailable_items',
                                title: baticApp.app.__lang('Hide Unavailable Items'),
                                type: 'Check'
                            },
                            {
                                name: 'auto_add_item_to_cart',
                                title: baticApp.app.__lang('Automatically Add Filtered Item To Cart'),
                                type: 'Check'
                            },
                            {
                                name: 'validate_stock_on_save',
                                title: baticApp.app.__lang('Validate Stock on Save'),
                                type: 'Check'
                            }
                        ]
                    },
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'ignore_pricing_rule',
                                title: baticApp.app.__lang('Ignore Pricing Rule'),
                                type: 'Check'
                            },
                            {
                                name: 'allow_rate_change',
                                title: baticApp.app.__lang('Allow User to Edit Rate'),
                                type: 'Check'
                            },
                            {
                                name: 'allow_discount_change',
                                title: baticApp.app.__lang('Allow User to Edit Discount'),
                                type: 'Check'
                            }
                        ]
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('Filters'),
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'item_groups',
                            title: baticApp.app.__lang('Item Groups'),
                            description: baticApp.app.__lang('Only show Items from these Item Groups'),
                            type: 'Table',
                            doctype: 'POS Profile',
                            addButtonTitle: baticApp.app.__lang('Add Group'),
                            fields: [
                                {
                                    name: 'item_group',
                                    title: baticApp.app.__lang('Item Group'),
                                    type: 'Link',
                                    link: {
                                        txt: '',
                                        doctype: 'Item Group',
                                        reference_doctype: 'POS Item Group',
                                        ignore_user_permissions: 0
                                    }
                                }
                            ]
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'customer_groups',
                            title: baticApp.app.__lang('Customer Groups'),
                            description: baticApp.app.__lang('Only show Customer of these Customer Groups'),
                            type: 'Table',
                            doctype: 'POS Profile',
                            addButtonTitle: baticApp.app.__lang('Add Group'),
                            fields: [
                                {
                                    name: 'customer_group',
                                    title: baticApp.app.__lang('Customer Group'),
                                    type: 'Link',
                                    link: {
                                        txt: '',
                                        doctype: 'Customer Group',
                                        reference_doctype: 'POS Customer Group',
                                        ignore_user_permissions: 0
                                    }
                                }
                            ]
                        }
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('Print Settings'),
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'print_format',
                            title: baticApp.app.__lang('Print Format'),
                            type: 'Link',
                            link: {
                                txt: '',
                                doctype: 'Print Format',
                                reference_doctype: 'POS Customer Group',
                                ignore_user_permissions: 0,
                                filters: [["Print Format", "doc_type", "=", "POS Invoice"]]
                            }
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'tc_name',
                            title: baticApp.app.__lang('Terms and Conditions'),
                            type: 'Link',
                            link: {
                                txt: '',
                                doctype: 'Terms and Conditions',
                                reference_doctype: 'POS Customer Group',
                                ignore_user_permissions: 0,
                                filters: {"selling": 1}
                            }
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'letter_head',
                            title: baticApp.app.__lang('Letter Head'),
                            type: 'Link',
                            link: {
                                txt: '',
                                doctype: 'Letter Head',
                                reference_doctype: 'POS Profile',
                                ignore_user_permissions: 0
                            }
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'select_print_heading',
                            title: baticApp.app.__lang('Print Heading'),
                            type: 'Link',
                            link: {
                                txt: '',
                                doctype: 'Print Heading',
                                reference_doctype: 'POS Customer Group',
                                ignore_user_permissions: 0,
                                filters: [["Print Heading", "docstatus", "!=", 2]]
                            }
                        }
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('Accounting'),
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'selling_price_list',
                            title: baticApp.app.__lang('Price List'),
                            type: 'Link',
                            link: {
                                txt: '',
                                doctype: 'Price List',
                                reference_doctype: 'POS Profile',
                                ignore_user_permissions: 0,
                                filters: {"selling": 1}
                            }
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'income_account',
                            title: baticApp.app.__lang('Income Account'),
                            type: 'Link',
                            link: {
                                txt: '',
                                doctype: 'Account',
                                reference_doctype: 'POS Profile',
                                ignore_user_permissions: 0
                            }
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'currency',
                            title: baticApp.app.__lang('Currency'),
                            type: 'Link',
                            link: {
                                txt: '',
                                doctype: 'Currency',
                                reference_doctype: 'POS Profile',
                                ignore_user_permissions: 0
                            },
                            required: true,
                            default_value: baticApp.app.defaults.currency
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'expense_account',
                            title: baticApp.app.__lang('Expense Account'),
                            type: 'Link',
                            link: {
                                txt: '',
                                doctype: 'Account',
                                reference_doctype: 'POS Profile',
                                ignore_user_permissions: 0
                            }
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'write_off_account',
                            title: baticApp.app.__lang('Write Off Account'),
                            type: 'Link',
                            link: {
                                txt: '',
                                doctype: 'Account',
                                reference_doctype: 'POS Profile',
                                ignore_user_permissions: 0
                            },
                            required: true
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'taxes_and_charges',
                            title: baticApp.app.__lang('Taxes and Charges'),
                            type: 'Link',
                            link: {
                                txt: '',
                                doctype: 'Sales Taxes and Charges Template',
                                reference_doctype: 'POS Profile',
                                ignore_user_permissions: 0
                            }
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'write_off_cost_center',
                            title: baticApp.app.__lang('Write Off Cost Center'),
                            type: 'Link',
                            link: {
                                txt: '',
                                doctype: 'Cost Center',
                                reference_doctype: 'POS Profile',
                                ignore_user_permissions: 0
                            },
                            required: true
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'tax_category',
                            title: baticApp.app.__lang('Tax Category'),
                            type: 'Link',
                            link: {
                                txt: '',
                                doctype: 'Tax Category',
                                reference_doctype: 'POS Profile',
                                ignore_user_permissions: 0
                            }
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'account_for_change_amount',
                            title: baticApp.app.__lang('Account for Change Amount'),
                            type: 'Link',
                            link: {
                                txt: '',
                                doctype: 'Account',
                                reference_doctype: 'POS Profile',
                                ignore_user_permissions: 0
                            }
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'apply_discount_on',
                            title: baticApp.app.__lang('Apply Discount On'),
                            type: 'Select'
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'write_off_limit',
                            title: baticApp.app.__lang('Write Off Limit'),
                            type: 'Currency',
                            required: true,
                            default_value: 1
                        }
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('Accounting Dimensions'),
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'cost_center',
                            title: baticApp.app.__lang('Cost Center'),
                            type: 'Link',
                            link: {
                                txt: '',
                                doctype: 'Cost Center',
                                reference_doctype: 'POS Profile',
                                query: 'erpnext.controllers.queries.get_filtered_dimensions',
                                ignore_user_permissions: 0
                            }
                        }
                    }
                ]
            }
        ]
    },
    'pos-devices-accessories': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'naming_series',
                                title: baticApp.app.__lang('Series'),
                                type: 'Select',
                                depends_on: ('form._form_view_type=="new"')

                            },
                            {
                                name: 'device',
                                title: baticApp.app.__lang('Device'),
                                type: 'Link',
                                doctype: 'POS Devices Accessories',
                                link: {
                                    txt: '',
                                    doctype: 'POS Devices',
                                    reference_doctype: 'POS Devices Accessories',
                                    ignore_user_permissions: 0
                                },
                                required: true
                            },
                            {
                                name: 'device_name',
                                title: baticApp.app.__lang('Name'),
                                type: 'Data',
                                required: true

                            },
                            {
                                name: 'ip',
                                title: baticApp.app.__lang('IP'),
                                type: 'Data',
                                required: true

                            },
                            {
                                name: 'paper_size',
                                title: baticApp.app.__lang('Paper Size'),
                                type: 'Select'
                            }
                        ]
                    },
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'device_type',
                                title: baticApp.app.__lang('Device Type'),
                                type: 'Select',
                                required: true
                            },
                            {
                                name: 'connection',
                                title: baticApp.app.__lang('Connection'),
                                type: 'Select',
                                required: true
                            },
                            {
                                name: 'device_for',
                                title: baticApp.app.__lang('Device For'),
                                type: 'Select',
                                required: true
                            },
                            {
                                name: 'device_brand',
                                title: baticApp.app.__lang('Device Brand'),
                                type: 'Select',
                                required: true
                            }
                        ]
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'item_groups',
                            title: baticApp.app.__lang('Item Groups'),
                            type: 'Table',
                            doctype: 'POS Devices Accessories',
                            addButtonTitle: baticApp.app.__lang('Add Group'),
                            fields: [
                                {
                                    name: 'item_group',
                                    title: baticApp.app.__lang('Item Group'),
                                    type: 'Link',
                                    link: {
                                        txt: '',
                                        doctype: 'Item Group',
                                        reference_doctype: 'POS Devices Accessories Item',
                                        ignore_user_permissions: 0
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    },
    'pos-opening-entry': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'period_start_date',
                                title: baticApp.app.__lang('Period Start Date'),
                                type: 'Datetime',
                                required: true,
                                default_value: baticApp.app.datetime._date('YYYY-MM-DD HH:mm:ss')
                            },
                            {
                                name: 'company',
                                title: baticApp.app.__lang('Company'),
                                type: 'Link',
                                doctype: 'POS Opening Entry',
                                link: {
                                    txt: '',
                                    doctype: 'Company',
                                    reference_doctype: 'POS Opening Entry',
                                    ignore_user_permissions: 0
                                },
                                required: true,
                                default_value: baticApp.app.defaults.company,
                            },
                            {
                                name: 'pos_profile',
                                title: baticApp.app.__lang('POS Profile'),
                                type: 'Link',
                                doctype: 'POS Opening Entry',
                                link: {
                                    txt: '',
                                    doctype: 'POS Profile',
                                    reference_doctype: 'POS Opening Entry',
                                    ignore_user_permissions: 0
                                },
                                required: true
                            }
                        ]
                    },
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'posting_date',
                                title: baticApp.app.__lang('Posting Date'),
                                type: 'Date',
                                required: true,
                                default_value: baticApp.app.datetime._date('YYYY-MM-DD')
                            },
                            {
                                name: 'user',
                                title: baticApp.app.__lang('Cashier'),
                                type: 'Link',
                                doctype: 'POS Opening Entry',
                                link: {
                                    txt: '',
                                    doctype: 'User',
                                    reference_doctype: 'POS Opening Entry',
                                    query: 'erpnext.accounts.doctype.pos_closing_entry.pos_closing_entry.get_cashiers',
                                    filters: {},
                                    ignore_user_permissions: 0
                                },
                                required: true
                            }
                        ]
                    },
                    {
                        col: 12,
                        field: {
                            name: 'balance_details',
                            title: baticApp.app.__lang('Opening Balance Details'),
                            type: 'Table',
                            doctype: 'POS Opening Entry',
                            addButtonTitle: baticApp.app.__lang('Add Balance'),
                            fields: [
                                {
                                    name: 'mode_of_payment',
                                    title: baticApp.app.__lang('Mode of Payment'),
                                    type: 'Link',
                                    width: '60%',
                                    link: {
                                        txt: '',
                                        doctype: 'Mode of Payment',
                                        reference_doctype: 'POS Opening Entry Detail',
                                        ignore_user_permissions: 0
                                    }
                                },
                                {
                                    name: 'opening_amount',
                                    title: baticApp.app.__lang('Opening Amount'),
                                    type: 'Currency',
                                    width: '200px'
                                }
                            ]
                        }
                    }
                ]
            },
        ]
    },
    'pos-opening-shift': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'period_start_date',
                                title: baticApp.app.__lang('Period Start Date'),
                                type: 'Datetime',
                                required: true,
                                default_value: baticApp.app.datetime._date('YYYY-MM-DD HH:mm:ss')
                            },
                            {
                                name: 'company',
                                title: baticApp.app.__lang('Company'),
                                type: 'Link',
                                link: {
                                    txt: '',
                                    doctype: 'Company',
                                    reference_doctype: 'POS Opening Shift',
                                    ignore_user_permissions: 0
                                },
                                required: true,
                                default_value: baticApp.app.defaults.company,
                            },
                            {
                                name: 'pos_profile',
                                title: baticApp.app.__lang('POS Profile'),
                                type: 'Link',
                                link: {
                                    txt: '',
                                    doctype: 'POS Profile',
                                    reference_doctype: 'POS Opening Shift',
                                    ignore_user_permissions: 0
                                },
                                required: true
                            }
                        ]
                    },
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'posting_date',
                                title: baticApp.app.__lang('Posting Date'),
                                type: 'Date',
                                required: true,
                                default_value: baticApp.app.datetime._date('YYYY-MM-DD')
                            },
                            {
                                name: 'user',
                                title: baticApp.app.__lang('Cashier'),
                                type: 'Link',
                                link: {
                                    txt: '',
                                    doctype: 'User',
                                    reference_doctype: 'POS Opening Shift',
                                    query: 'erpnext.accounts.doctype.pos_closing_entry.pos_closing_entry.get_cashiers',
                                    filters: {},
                                    ignore_user_permissions: 0
                                },
                                required: true
                            }
                        ]
                    },
                    {
                        col: 12,
                        field: {
                            name: 'balance_details',
                            title: baticApp.app.__lang('Opening Balance Details'),
                            type: 'Table',
                            doctype: 'POS Opening Shift',
                            addButtonTitle: baticApp.app.__lang('Add Balance'),
                            fields: [
                                {
                                    name: 'mode_of_payment',
                                    title: baticApp.app.__lang('Mode of Payment'),
                                    type: 'Link',
                                    width: '60%',
                                    link: {
                                        txt: '',
                                        doctype: 'Mode of Payment',
                                        reference_doctype: 'POS Opening Entry Detail',
                                        ignore_user_permissions: 0
                                    }
                                },
                                {
                                    name: 'amount',
                                    title: baticApp.app.__lang('Opening Amount'),
                                    type: 'Currency',
                                    width: '200px'
                                }
                            ]
                        }
                    }
                ]
            },
        ]
    },
    'pos-closing-entry': {
        form: [
            {
                type: 'row',
                title: baticApp.app.__lang('Period Details'),
                fields: [
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'period_start_date',
                                title: baticApp.app.__lang('Period Start Date'),
                                type: 'Datetime',
                                required: true,
                                readonly: true,
                                depends_on: ('form.pos_opening_entry')
                            },
                            {
                                name: 'period_end_date',
                                title: baticApp.app.__lang('Period End Date'),
                                type: 'Datetime',
                                required: true,
                                readonly: true,
                                default_value: baticApp.app.datetime._date('YYYY-MM-DD HH:mm:ss')
                            }
                        ]
                    },
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'posting_date',
                                title: baticApp.app.__lang('Posting Date'),
                                type: 'Date',
                                required: true,
                                default_value: baticApp.app.datetime._date('YYYY-MM-DD')
                            },
                            {
                                name: 'pos_opening_entry',
                                title: baticApp.app.__lang('POS Opening Entry'),
                                type: 'Link',
                                doctype: 'POS Closing Entry',
                                link: {
                                    txt: '',
                                    doctype: 'POS Opening Entry',
                                    reference_doctype: 'POS Closing Entry',
                                    filters: {"status": "Open", "docstatus": 1},
                                    ignore_user_permissions: 0
                                },
                                required: true
                            }
                        ]
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('User Details'),
                fields: [
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'company',
                                title: baticApp.app.__lang('Company'),
                                type: 'Link',
                                doctype: 'POS Opening Entry',
                                link: {
                                    txt: '',
                                    doctype: 'Company',
                                    reference_doctype: 'POS Opening Entry',
                                    ignore_user_permissions: 0
                                },
                                required: true,
                                default_value: baticApp.app.defaults.company,
                            }
                        ]
                    },
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'pos_profile',
                                title: baticApp.app.__lang('POS Profile'),
                                type: 'Link',
                                doctype: 'POS Closing Entry',
                                link: {
                                    txt: '',
                                    doctype: 'Company',
                                    reference_doctype: 'POS Closing Entry',
                                    ignore_user_permissions: 0
                                },
                                required: true
                            },
                            {
                                name: 'user',
                                title: baticApp.app.__lang('Cashier'),
                                type: 'Link',
                                doctype: 'POS Closing Entry',
                                link: {
                                    txt: '',
                                    doctype: 'Company',
                                    reference_doctype: 'POS Closing Entry',
                                    query: 'erpnext.accounts.doctype.pos_closing_entry.pos_closing_entry.get_cashiers',
                                    ignore_user_permissions: 0,
                                    filters: {"parent": ""}
                                },
                                required: true
                            }
                        ]
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('Linked Invoices'),
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'pos_transactions',
                            title: baticApp.app.__lang('POS Transactions'),
                            type: 'Table',
                            doctype: 'POS Closing Entry',
                            addButtonTitle: baticApp.app.__lang('Add Balance'),
                            fields: [
                                {
                                    name: 'pos_invoice',
                                    title: baticApp.app.__lang('POS Invoice'),
                                    type: 'Link',
                                    width: '50%',
                                    link: {
                                        txt: '',
                                        doctype: 'POS Invoice',
                                        reference_doctype: 'POS Invoice Reference',
                                        ignore_user_permissions: 0
                                    }
                                },
                                {
                                    name: 'posting_date',
                                    title: baticApp.app.__lang('Date'),
                                    type: 'Date'
                                },
                                {
                                    name: 'grand_total',
                                    title: baticApp.app.__lang('Amount'),
                                    type: 'Currency'
                                }
                            ]
                        }
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('Modes of Payment'),
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'payment_reconciliation',
                            title: baticApp.app.__lang('Payment Reconciliation'),
                            type: 'Table',
                            doctype: 'POS Closing Entry',
                            addButtonTitle: baticApp.app.__lang('Add Balance'),
                            fields: [
                                {
                                    name: 'mode_of_payment',
                                    title: baticApp.app.__lang('Mode of Payment'),
                                    type: 'Link',
                                    link: {
                                        txt: '',
                                        doctype: 'Mode of Payment',
                                        reference_doctype: 'POS Closing Entry Detail',
                                        ignore_user_permissions: 0
                                    }
                                },
                                {
                                    name: 'opening_amount',
                                    title: baticApp.app.__lang('Opening Amount'),
                                    type: 'Currency',
                                    readonly: true
                                },
                                {
                                    name: 'expected_amount',
                                    title: baticApp.app.__lang('Expected Amount'),
                                    type: 'Currency',
                                    readonly: true
                                },
                                {
                                    name: 'closing_amount',
                                    title: baticApp.app.__lang('Closing Amount'),
                                    type: 'Currency'
                                },
                                {
                                    name: 'difference',
                                    title: baticApp.app.__lang('Difference'),
                                    type: 'Currency',
                                    readonly: true
                                }
                            ]
                        }
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('Totals'),
                fields: [
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'grand_total',
                                title: baticApp.app.__lang('Grand Total'),
                                type: 'Currency',
                                readonly: true
                            },
                            {
                                name: 'net_total',
                                title: baticApp.app.__lang('Net Total'),
                                type: 'Currency',
                                readonly: true
                            },
                            {
                                name: 'total_quantity',
                                title: baticApp.app.__lang('Total Quantity'),
                                type: 'Int',
                                readonly: true
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'pos-closing-shift': {
        form: [
            {
                type: 'row',
                title: baticApp.app.__lang('Period Details'),
                fields: [
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'period_start_date',
                                title: baticApp.app.__lang('Period Start Date'),
                                type: 'Datetime',
                                required: true,
                                readonly: true,
                                depends_on: ('form.pos_opening_entry')
                            },
                            {
                                name: 'period_end_date',
                                title: baticApp.app.__lang('Period End Date'),
                                type: 'Datetime',
                                required: true,
                                readonly: true,
                                default_value: baticApp.app.datetime._date('YYYY-MM-DD HH:mm:ss')
                            }
                        ]
                    },
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'posting_date',
                                title: baticApp.app.__lang('Posting Date'),
                                type: 'Date',
                                required: true,
                                default_value: baticApp.app.datetime._date('YYYY-MM-DD')
                            },
                            {
                                name: 'pos_opening_shift',
                                title: baticApp.app.__lang('POS Opening Shift'),
                                type: 'Link',
                                link: {
                                    txt: '',
                                    doctype: 'POS Opening Shift',
                                    reference_doctype: 'POS Closing Shift',
                                    filters: {"status": "Open", "docstatus": 1},
                                    ignore_user_permissions: 0
                                },
                                required: true
                            }
                        ]
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('User Details'),
                fields: [
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'company',
                                title: baticApp.app.__lang('Company'),
                                type: 'Link',
                                doctype: 'POS Opening Entry',
                                link: {
                                    txt: '',
                                    doctype: 'Company',
                                    reference_doctype: 'POS Opening Shift',
                                    ignore_user_permissions: 0
                                },
                                required: true,
                                default_value: baticApp.app.defaults.company,
                            }
                        ]
                    },
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'pos_profile',
                                title: baticApp.app.__lang('POS Profile'),
                                type: 'Link',
                                link: {
                                    txt: '',
                                    doctype: 'POS Profile',
                                    reference_doctype: 'POS Closing Shift',
                                    ignore_user_permissions: 0
                                },
                                required: true,
                                readonly: true,
                            },
                            {
                                name: 'user',
                                title: baticApp.app.__lang('Cashier'),
                                type: 'Link',
                                link: {
                                    txt: '',
                                    doctype: 'User',
                                    reference_doctype: 'POS Closing Shift',
                                    ignore_user_permissions: 0,
                                },
                                required: true,
                                readonly: true
                            }
                        ]
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('Linked Invoices'),
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'pos_transactions',
                            title: baticApp.app.__lang('POS Transactions'),
                            type: 'Table',
                            doctype: 'POS Closing Entry',
                            addButtonTitle: baticApp.app.__lang('Add Balance'),
                            fields: [
                                {
                                    name: 'sales_invoice',
                                    title: baticApp.app.__lang('Sales Invoice'),
                                    type: 'Link',
                                    width: '50%',
                                    link: {
                                        txt: '',
                                        doctype: 'Sales Invoice',
                                        reference_doctype: 'Sales Invoice Reference',
                                        ignore_user_permissions: 0
                                    }
                                },
                                {
                                    name: 'posting_date',
                                    title: baticApp.app.__lang('Date'),
                                    type: 'Date'
                                },
                                {
                                    name: 'customer',
                                    title: baticApp.app.__lang('Customer'),
                                    type: 'Data',
                                    readonly: true
                                },
                                {
                                    name: 'amount',
                                    title: baticApp.app.__lang('Amount'),
                                    type: 'Currency'
                                }
                            ]
                        }
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('Modes of Payment'),
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'payment_reconciliation',
                            title: baticApp.app.__lang('Payment Reconciliation'),
                            type: 'Table',
                            doctype: 'POS Closing Entry',
                            addButtonTitle: baticApp.app.__lang('Add Balance'),
                            fields: [
                                {
                                    name: 'mode_of_payment',
                                    title: baticApp.app.__lang('Mode of Payment'),
                                    type: 'Link',
                                    link: {
                                        txt: '',
                                        doctype: 'Mode of Payment',
                                        reference_doctype: 'POS Closing Entry Detail',
                                        ignore_user_permissions: 0
                                    }
                                },
                                {
                                    name: 'opening_amount',
                                    title: baticApp.app.__lang('Opening Amount'),
                                    type: 'Currency',
                                    readonly: true
                                },
                                {
                                    name: 'expected_amount',
                                    title: baticApp.app.__lang('Expected Amount'),
                                    type: 'Currency',
                                    readonly: true
                                },
                                {
                                    name: 'closing_amount',
                                    title: baticApp.app.__lang('Closing Amount'),
                                    type: 'Currency'
                                },
                                {
                                    name: 'difference',
                                    title: baticApp.app.__lang('Difference'),
                                    type: 'Currency',
                                    readonly: true
                                }
                            ]
                        }
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('Totals'),
                fields: [
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'grand_total',
                                title: baticApp.app.__lang('Grand Total'),
                                type: 'Currency',
                                readonly: true
                            },
                            {
                                name: 'net_total',
                                title: baticApp.app.__lang('Net Total'),
                                type: 'Currency',
                                readonly: true
                            },
                            {
                                name: 'total_quantity',
                                title: baticApp.app.__lang('Total Quantity'),
                                type: 'Int',
                                readonly: true
                            }
                        ]
                    }
                ]
            }
        ]
    },
    'pos-offer': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'title',
                                title: baticApp.app.__lang('Title'),
                                type: 'Data',
                                required: true,
                            },
                            {
                                name: 'description',
                                title: baticApp.app.__lang('Description'),
                                type: 'Small Text',
                                required: true,
                            },
                            {
                                name: 'disable',
                                title: baticApp.app.__lang('Disable'),
                                type: 'Check'
                            },
                            {
                                name: 'coupon_based',
                                title: baticApp.app.__lang('Coupon Code Based'),
                                type: 'Check'
                            },
                            {
                                name: 'auto',
                                title: baticApp.app.__lang('Auto Apply'),
                                type: 'Check',
                                default_value: 1
                            }
                        ]
                    },
                    {
                        col: 3,
                        fields: [
                            {
                                name: 'apply_on',
                                title: baticApp.app.__lang('Qualifying Transaction / Item'),
                                type: 'Select',
                                required: true,
                            },
                            {
                                name: 'offer',
                                title: baticApp.app.__lang('Promo Type'),
                                type: 'Select',
                                required: true,
                            },
                            {
                                name: 'valid_from',
                                title: baticApp.app.__lang('Valid From'),
                                type: 'Date',
                                required: true,
                                default_value: baticApp.app.datetime._date('YYYY-MM-DD')
                            },
                            {
                                name: 'valid_upto',
                                title: baticApp.app.__lang('Valid Upto'),
                                type: 'Date'
                            },
                        ]
                    },
                    {
                        col: 3,
                        fields: [
                            {
                                name: 'item',
                                title: baticApp.app.__lang('Apply Rule On Item Code'),
                                type: 'Link',
                                link: {
                                    txt: '',
                                    doctype: 'Item',
                                    reference_doctype: 'POS Offer',
                                    ignore_user_permissions: 0
                                },
                                required: true,
                                depends_on: ("form.apply_on=='Item Code'")
                            },
                            {
                                name: 'item_group',
                                title: baticApp.app.__lang('Apply Rule On Item Group'),
                                type: 'Link',
                                link: {
                                    txt: '',
                                    doctype: 'Item Group',
                                    reference_doctype: 'POS Offer',
                                    ignore_user_permissions: 0,
                                    filters: JSON.stringify({"is_group": 0})
                                },
                                required: true,
                                depends_on: ("form.apply_on=='Item Group'")
                            },
                            {
                                name: 'brand',
                                title: baticApp.app.__lang('Apply Rule On Brand'),
                                type: 'Link',
                                link: {
                                    txt: '',
                                    doctype: 'Brand',
                                    reference_doctype: 'POS Offer',
                                    ignore_user_permissions: 0
                                },
                                required: true,
                                depends_on: ("form.apply_on=='Brand'")
                            },
                            {
                                name: 'company',
                                title: baticApp.app.__lang('Company'),
                                type: 'Link',
                                link: {
                                    txt: '',
                                    doctype: 'Company',
                                    reference_doctype: 'POS Offer',
                                },
                                required: true,
                                default_value: baticApp.app.defaults.company,
                            },
                            {
                                name: 'pos_profile',
                                title: baticApp.app.__lang('POS Profile'),
                                type: 'Link',
                                link: {
                                    txt: '',
                                    doctype: 'POS Profile',
                                    reference_doctype: 'POS Offer',
                                }
                            },
                            {
                                name: 'warehouse',
                                title: baticApp.app.__lang('Warehouse'),
                                type: 'Link',
                                link: {
                                    txt: '',
                                    doctype: 'Warehouse',
                                    reference_doctype: 'POS Offer',
                                }
                            },
                        ]
                    }
                ]
            }
        ]
    },
    'pos-coupon': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'coupon_name',
                                title: baticApp.app.__lang('Coupon Name'),
                                description: baticApp.app.__lang('e.g. "Summer Holiday 2019 Offer 20"'),
                                type: 'Data',
                                required: true,
                            },
                            {
                                name: 'coupon_type',
                                title: baticApp.app.__lang('Coupon Type'),
                                type: 'Select',
                                required: true,
                            },
                            {
                                name: 'customer',
                                title: baticApp.app.__lang('Customer'),
                                type: 'Link',
                                link: {
                                    txt: '',
                                    doctype: 'Customer',
                                    reference_doctype: 'POS Coupon',
                                    ignore_user_permissions: 0
                                },
                                depends_on: ("form.coupon_type=='Gift Card'")
                            },
                        ]
                    },
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'coupon_code',
                                title: baticApp.app.__lang('Coupon Code'),
                                description: baticApp.app.__lang('unique e.g. SAVE20 To be used to get discount'),
                                type: 'Data'
                            },
                            {
                                name: 'company',
                                title: baticApp.app.__lang('Company'),
                                type: 'Link',
                                link: {
                                    txt: '',
                                    doctype: 'Company',
                                    reference_doctype: 'POS Coupon',
                                    ignore_user_permissions: 0
                                },
                                required: true,
                                default_value: baticApp.app.defaults.company
                            },
                            {
                                name: 'pos_offer',
                                title: baticApp.app.__lang('POS Offer'),
                                type: 'Link',
                                link: {
                                    txt: '',
                                    doctype: 'POS Offer',
                                    reference_doctype: 'POS Coupon',
                                    ignore_user_permissions: 0,
                                    filters: JSON.stringify({"coupon_based": 1, "disable": 0})
                                },
                                required: true
                            },
                        ]
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('Validity and Usage'),
                fields: [
                    {
                        col: 3,
                        field: {
                            name: 'valid_from',
                            title: baticApp.app.__lang('Valid From'),
                            type: 'Date'
                        },
                    },
                    {
                        col: 3,
                        field: {
                            name: 'valid_upto',
                            title: baticApp.app.__lang('Valid Upto'),
                            type: 'Date'
                        },
                    },
                    {
                        col: 3,
                        field: {
                            name: 'maximum_use',
                            title: baticApp.app.__lang('Maximum Use'),
                            type: 'Int',
                            default_value: '0'
                        },
                    },
                    {
                        col: 3,
                        field: {
                            name: 'used',
                            title: baticApp.app.__lang('Used'),
                            type: 'Data',
                            readonly: true,
                            default_value: '0'
                        },
                    }
                ]
            }
        ]
    },
    'delivery-charges': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'label',
                                title: baticApp.app.__lang('Label'),
                                type: 'Data',
                                required: true,
                            },
                            {
                                name: 'company',
                                title: baticApp.app.__lang('Company'),
                                type: 'Link',
                                required: true,
                                link: {
                                    txt: '',
                                    doctype: 'Company',
                                    reference_doctype: 'Delivery Charges',
                                    ignore_user_permissions: 0
                                },
                                default_value: baticApp.app.defaults.company
                            },
                            {
                                name: 'default_rate',
                                title: baticApp.app.__lang('Default Rate'),
                                type: 'Currency',
                                default_value: '',
                                required: true,
                            },
                            {
                                name: 'disabled',
                                title: baticApp.app.__lang('Disabled'),
                                type: 'Check'
                            }
                        ]
                    },
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'shipping_account',
                                title: baticApp.app.__lang('Shipping Account'),
                                type: 'Link',
                                required: true,
                                link: {
                                    txt: '',
                                    doctype: 'Account',
                                    reference_doctype: 'Delivery Charges',
                                    ignore_user_permissions: 0
                                },
                            },
                            {
                                name: 'cost_center',
                                title: baticApp.app.__lang('Cost Center'),
                                type: 'Link',
                                required: true,
                                link: {
                                    txt: '',
                                    doctype: 'Cost Center',
                                    reference_doctype: 'Delivery Charges',
                                    ignore_user_permissions: 0
                                }
                            },
                        ]
                    }
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('Apply For POS Profiles'),
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'profiles',
                            title: baticApp.app.__lang('POS Profiles'),
                            type: 'Table',
                            doctype: 'Delivery Charges',
                            addButtonTitle: baticApp.app.__lang('Add Profile'),
                            fields: [
                                {
                                    name: 'pos_profile',
                                    title: baticApp.app.__lang('POS Profile'),
                                    type: 'Link',
                                    link: {
                                        txt: '',
                                        doctype: 'POS Profile',
                                        reference_doctype: 'Delivery Charges POS Profile',
                                        ignore_user_permissions: 0
                                    }
                                },
                                {
                                    name: 'rate',
                                    title: baticApp.app.__lang('Rate'),
                                    type: 'Currency',
                                    width: '25%',
                                    required: true,
                                }
                            ]
                        }
                    }
                ]
            }
        ],
    },

    /*
    * Purchase Forms
    */
    'supplier': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 4,
                        field: {
                            name: 'image',
                            title: baticApp.app.__lang('Item Image'),
                            type: 'Attach Image',
                        }
                    },
                    {
                        col: 4,
                        field: {
                            name: 'supplier_name',
                            title: baticApp.app.__lang('Full Name'),
                            type: 'Data',
                            required: true,
                            disabled_on_edit: true
                        }
                    },
                    {
                        col: 4,
                        field: {
                            name: 'supplier_name_in_arabic',
                            title: baticApp.app.__lang('Supplier Name in Arabic'),
                            type: 'Data'
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'supplier_group',
                            title: baticApp.app.__lang('Supplier Group'),
                            type: 'Link',
                            link: {
                                txt: '',
                                doctype: 'Supplier Group',
                                reference_doctype: 'Supplier',
                                ignore_user_permissions: 0,
                                filters: JSON.stringify({"is_group": 0})
                            },
                            required: true,
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'country',
                            title: baticApp.app.__lang('Country'),
                            type: 'Link',
                            link: {
                                txt: '',
                                doctype: 'Country',
                                reference_doctype: 'Supplier',
                                ignore_user_permissions: 0,
                                filters: {}
                            },
                            required: true,
                            default_value: baticApp.app.defaults.country,
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
                            name: 'supplier_type',
                            title: baticApp.app.__lang('Supplier Type'),
                            type: 'Select'
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'tax_id',
                            title: baticApp.app.__lang('Tax ID'),
                            type: 'Data'
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'address',
                            title: baticApp.app.__lang('Address'),
                            type: 'Data'
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'mobile_no',
                            title: baticApp.app.__lang('Phone'),
                            type: 'Data'
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'email_id',
                            title: baticApp.app.__lang('Email'),
                            type: 'Data'
                        }
                    }
                ]
            }
        ]
    },
    'supplier-group': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'supplier_group_name',
                            title: baticApp.app.__lang('Supplier Group Name'),
                            type: 'Data',
                            required: true,
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'parent_supplier_group',
                            title: baticApp.app.__lang('Parent Supplier Group'),
                            type: 'Link',
                            doctype: 'Supplier Group',
                            link: {
                                txt: '',
                                doctype: 'Supplier Group',
                                reference_doctype: 'Supplier Group',
                                ignore_user_permissions: 1,
                                filters: JSON.stringify({"is_group": 1, "name": ["!=", null]})
                            }
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 3,
                        field: {
                            name: 'is_group',
                            title: baticApp.app.__lang('Is Group'),
                            type: 'Check',
                            default_value: 0
                        }
                    }
                ]
            }
        ]
    },
    'purchase-invoice': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'naming_series',
                            title: baticApp.app.__lang('Series'),
                            type: 'Select',
                            required: true,
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'company',
                            title: baticApp.app.__lang('Company'),
                            type: 'Link',
                            doctype: 'Company',
                            link: {
                                txt: '',
                                doctype: 'Company',
                                reference_doctype: 'Sales Invoice',
                                filters: {}
                            },
                            required: true,
                            default_value: baticApp.app.defaults.company,
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'supplier',
                            title: baticApp.app.__lang('Supplier'),
                            type: 'Link',
                            doctype: 'supplier',
                            link: {
                                txt: '',
                                doctype: 'Supplier',
                                query: 'erpnext.controllers.queries.supplier_query',
                                reference_doctype: 'Purchase Invoice',
                                filters: JSON.stringify({"disabled": 0})
                            },
                            required: true
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'posting_date',
                            title: baticApp.app.__lang('Date'),
                            type: 'Date',
                            default_value: baticApp.app.datetime._date('YYYY-MM-DD'),
                            required: true
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'posting_time',
                            title: baticApp.app.__lang('Posting Time'),
                            type: 'Time',
                            default_value: baticApp.app.datetime._date('HH:mm:ss'),
                            required: true
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'set_warehouse',
                            title: baticApp.app.__lang('Warehouse'),
                            type: 'Link',
                            doctype: 'Warehouse',
                            link: {
                                txt: '',
                                doctype: 'Warehouse',
                                reference_doctype: 'Sales Invoice',
                                filters: {}
                            },
                            required: false,
                            depends_on: ('form.update_stock==1')
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'due_date',
                            title: baticApp.app.__lang('Payment Due Date'),
                            type: 'Date',
                            required: true,
                            depends_on: ('form.is_paid!=1')
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'update_stock',
                            title: baticApp.app.__lang('Update Stock'),
                            type: 'Check',
                            default_value: 1,
                            required: false
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'is_paid',
                            title: baticApp.app.__lang('Is Paid'),
                            type: 'Check',
                            default_value: 0,
                            required: false
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'items',
                            title: baticApp.app.__lang('Items'),
                            type: 'Table',
                            doctype: 'Purchase Invoice',
                            addButtonTitle: baticApp.app.__lang('Add Item'),
                            fields: [
                                {
                                    name: 'item_code',
                                    title: baticApp.app.__lang('Item'),
                                    type: 'Link',
                                    link: {
                                        txt: '',
                                        doctype: 'Item',
                                        reference_doctype: 'Purchase Invoice Item',
                                        query: 'erpnext.controllers.queries.item_query',
                                        ignore_user_permissions: 0,
                                        filters: JSON.stringify({"is_purchase_item": 1})
                                    }
                                },
                                {
                                    name: 'uom',
                                    title: baticApp.app.__lang('UOM'),
                                    type: 'Link',
                                    link: {
                                        txt: '',
                                        doctype: 'UOM',
                                        reference_doctype: 'Purchase Invoice Item'
                                    }
                                },
                                {
                                    name: 'qty',
                                    title: baticApp.app.__lang('Quantity'),
                                    type: 'Float'
                                },
                                {
                                    name: 'rate',
                                    title: baticApp.app.__lang('Rate') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Currency'
                                },
                                {
                                    name: 'amount',
                                    title: baticApp.app.__lang('Amount') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Currency',
                                    value: ('form.update_stock'),
                                    disabled: true
                                }
                            ]
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'taxes_and_charges',
                            title: baticApp.app.__lang('Purchase Taxes and Charges Template'),
                            type: 'Link',
                            doctype: 'Purchase Taxes and Charges Template',
                            link: {
                                txt: '',
                                doctype: 'Purchase Taxes and Charges Template',
                                reference_doctype: 'Purchase Invoice',
                                ignore_user_permissions: 0,
                                filters: JSON.stringify([["company", "=", baticApp.app.defaults.company], ["docstatus", "!=", 2]])
                            },
                            required: false
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'taxes',
                            title: baticApp.app.__lang('Taxes and Charges'),
                            type: 'Table',
                            doctype: 'Purchase Invoice',
                            addButtonTitle: baticApp.app.__lang('Add Tax'),
                            fields: [
                                {
                                    name: 'charge_type',
                                    title: baticApp.app.__lang('Type'),
                                    type: 'Select',
                                    doctype: 'Purchase Taxes and Charges'
                                },
                                {
                                    name: 'account_head',
                                    title: baticApp.app.__lang('Account Head'),
                                    type: 'Link',
                                    link: {
                                        txt: '',
                                        doctype: 'Account',
                                        reference_doctype: 'Purchase Taxes and Charges',
                                        query: 'erpnext.controllers.queries.tax_account_query',
                                        ignore_user_permissions: 0,
                                        filters: {"account_type": ["Tax", "Chargeable", "Income Account", "Expenses Included In Valuation"], "company": baticApp.app.defaults.company}
                                    }
                                },
                                {
                                    name: 'rate',
                                    title: baticApp.app.__lang('Rate'),
                                    type: 'Float',
                                    disabled: true
                                },
                                {
                                    name: 'tax_amount',
                                    title: baticApp.app.__lang('Amount') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Currency',
                                    disabled: true
                                },
                                {
                                    name: 'total',
                                    title: baticApp.app.__lang('Total') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Float',
                                    disabled: true
                                }
                            ]
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 4,
                        offset: 8,
                        field: {
                            name: 'total',
                            title: baticApp.app.__lang('Total') + ` (${baticApp.app.defaults.currency})`,
                            type: 'Currency',
                            disabled: true
                        }
                    },
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 4,
                        offset: 8,
                        field: {
                            name: 'total_taxes_and_charges',
                            title: baticApp.app.__lang('Total Taxes and Charges') + ` (${baticApp.app.defaults.currency})`,
                            type: 'Currency',
                            disabled: true
                        }
                    },
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 4,
                        offset: 8,
                        field: {
                            name: 'grand_total',
                            title: baticApp.app.__lang('Grand Total') + ` (${baticApp.app.defaults.currency})`,
                            type: 'Currency',
                            disabled: true
                        }
                    },
                ]
            }
        ]
    },
    'purchase-order': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'naming_series',
                            title: baticApp.app.__lang('Series'),
                            type: 'Select',
                            required: true,
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'company',
                            title: baticApp.app.__lang('Company'),
                            type: 'Link',
                            doctype: 'Company',
                            link: {
                                txt: '',
                                doctype: 'Company',
                                reference_doctype: 'Sales Invoice',
                                filters: {}
                            },
                            required: true,
                            default_value: baticApp.app.defaults.company,
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'supplier',
                            title: baticApp.app.__lang('Supplier'),
                            type: 'Link',
                            doctype: 'Purchase Order',
                            link: {
                                txt: '',
                                doctype: 'Supplier',
                                ignore_user_permissions: 0,
                                query: 'erpnext.controllers.queries.supplier_query',
                                reference_doctype: 'Purchase Order'
                            },
                            required: true
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'transaction_date',
                            title: baticApp.app.__lang('Date'),
                            type: 'Date',
                            default_value: baticApp.app.datetime._date('YYYY-MM-DD'),
                            required: true
                        }
                    },
                    {
                        col: 3,
                        field: {
                            name: 'schedule_date',
                            title: baticApp.app.__lang('Required By'),
                            type: 'Date'
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'items',
                            title: baticApp.app.__lang('Items'),
                            type: 'Table',
                            doctype: 'Purchase Order',
                            addButtonTitle: baticApp.app.__lang('Add Item'),
                            fields: [
                                {
                                    name: 'item_code',
                                    title: baticApp.app.__lang('Item'),
                                    type: 'Link',
                                    link: {
                                        txt: '',
                                        doctype: 'Item',
                                        ignore_user_permissions: 0,
                                        reference_doctype: 'Purchase Order Item',
                                        query: 'erpnext.controllers.queries.item_query',
                                        filters: JSON.stringify({"is_purchase_item": 1, "has_variants": 0})
                                    }
                                },
                                {
                                    name: 'schedule_date',
                                    title: baticApp.app.__lang('Required By'),
                                    type: 'Date'
                                },
                                {
                                    name: 'uom',
                                    title: baticApp.app.__lang('UOM'),
                                    type: 'Link',
                                    link: {
                                        txt: '',
                                        doctype: 'UOM',
                                        ignore_user_permissions: 0,
                                        reference_doctype: 'Purchase Order Item'
                                    }
                                },
                                {
                                    name: 'qty',
                                    title: baticApp.app.__lang('Quantity'),
                                    type: 'Float'
                                },
                                {
                                    name: 'rate',
                                    title: baticApp.app.__lang('Rate') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Currency'
                                },
                                {
                                    name: 'amount',
                                    title: baticApp.app.__lang('Amount') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Currency',
                                    value: ('form.update_stock'),
                                    disabled: true
                                }
                            ]
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'taxes_and_charges',
                            title: baticApp.app.__lang('Purchase Taxes and Charges Template'),
                            type: 'Link',
                            doctype: 'Purchase Order',
                            link: {
                                txt: '',
                                doctype: 'Purchase Taxes and Charges Template',
                                reference_doctype: 'Purchase Order',
                                ignore_user_permissions: 0,
                                filters: JSON.stringify([["company", "=", baticApp.app.defaults.company], ["docstatus", "!=", 2]])
                            }
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 12,
                        field: {
                            name: 'taxes',
                            title: baticApp.app.__lang('Taxes and Charges'),
                            type: 'Table',
                            doctype: 'Purchase Invoice',
                            addButtonTitle: baticApp.app.__lang('Add Tax'),
                            fields: [
                                {
                                    name: 'charge_type',
                                    title: baticApp.app.__lang('Type'),
                                    type: 'Select',
                                    doctype: 'Purchase Taxes and Charges'
                                },
                                {
                                    name: 'account_head',
                                    title: baticApp.app.__lang('Account Head'),
                                    type: 'Link',
                                    link: {
                                        txt: '',
                                        doctype: 'Account',
                                        reference_doctype: 'Purchase Taxes and Charges',
                                        query: 'erpnext.controllers.queries.tax_account_query',
                                        ignore_user_permissions: 0,
                                        filters: {"account_type": ["Tax", "Chargeable", "Income Account", "Expenses Included In Valuation"], "company": baticApp.app.defaults.company}
                                    }
                                },
                                {
                                    name: 'rate',
                                    title: baticApp.app.__lang('Rate'),
                                    type: 'Float',
                                    disabled: true
                                },
                                {
                                    name: 'tax_amount',
                                    title: baticApp.app.__lang('Amount') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Currency',
                                    disabled: true
                                },
                                {
                                    name: 'total',
                                    title: baticApp.app.__lang('Total') + ` (${baticApp.app.defaults.currency})`,
                                    type: 'Float',
                                    disabled: true
                                }
                            ]
                        }
                    }
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 4,
                        offset: 8,
                        field: {
                            name: 'total',
                            title: baticApp.app.__lang('Total') + ` (${baticApp.app.defaults.currency})`,
                            type: 'Currency',
                            disabled: true
                        }
                    },
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 4,
                        offset: 8,
                        field: {
                            name: 'total_taxes_and_charges',
                            title: baticApp.app.__lang('Total Taxes and Charges') + ` (${baticApp.app.defaults.currency})`,
                            type: 'Currency',
                            disabled: true
                        }
                    },
                ]
            },
            {
                type: 'row',
                fields: [
                    {
                        col: 4,
                        offset: 8,
                        field: {
                            name: 'grand_total',
                            title: baticApp.app.__lang('Grand Total') + ` (${baticApp.app.defaults.currency})`,
                            type: 'Currency',
                            disabled: true
                        }
                    },
                ]
            }
        ]
    },
    'buying-settings': {
        form: [
            {
                type: 'row',
                fields: [
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'supp_master_name',
                                title: baticApp.app.__lang('Supplier Naming By'),
                                type: 'Select'
                            },
                            {
                                name: 'supplier_group',
                                title: baticApp.app.__lang('Default Supplier Group'),
                                type: 'Link',
                                doctype: 'Supplier Group',
                                link: {
                                    txt: '',
                                    doctype: 'Supplier Group',
                                    reference_doctype: 'Buying Settings',
                                    ignore_user_permissions: 0
                                }
                            },
                            {
                                name: 'buying_price_list',
                                title: baticApp.app.__lang('Default Buying Price List'),
                                type: 'Link',
                                doctype: 'Price List',
                                link: {
                                    txt: '',
                                    doctype: 'Price List',
                                    reference_doctype: 'Buying Settings',
                                    ignore_user_permissions: 0
                                }
                            },
                            {
                                name: 'maintain_same_rate_action',
                                title: baticApp.app.__lang('Action If Same Rate is Not Maintained'),
                                description: baticApp.app.__lang('Configure the action to stop the transaction or just warn if the same rate is not maintained.'),
                                type: 'Select',
                                required: true,
                                depends_on: ('form.maintain_same_rate')
                            },
                            {
                                name: 'role_to_override_stop_action',
                                title: baticApp.app.__lang('Role Allowed to Override Stop Action'),
                                type: 'Link',
                                doctype: 'Role',
                                link: {
                                    txt: '',
                                    doctype: 'Role',
                                    reference_doctype: 'Buying Settings',
                                    ignore_user_permissions: 0
                                }
                            }
                        ]
                    },
                    {
                        col: 6,
                        fields: [
                            {
                                name: 'po_required',
                                title: baticApp.app.__lang('Is Purchase Order Required for Purchase Invoice & Receipt Creation?'),
                                type: 'Select'
                            },
                            {
                                name: 'pr_required',
                                title: baticApp.app.__lang('Is Purchase Receipt Required for Purchase Invoice Creation?'),
                                type: 'Select'
                            },
                            {
                                name: 'maintain_same_rate',
                                title: baticApp.app.__lang('Maintain Same Rate Throughout the Purchase Cycle'),
                                type: 'Check',
                                default_value: 0
                            },
                            {
                                name: 'allow_multiple_items',
                                title: baticApp.app.__lang('Allow Item To Be Added Multiple Times in a Transaction'),
                                type: 'Check',
                                default_value: 0
                            },
                            {
                                name: 'bill_for_rejected_quantity_in_purchase_invoice',
                                title: baticApp.app.__lang('Bill for Rejected Quantity in Purchase Invoice'),
                                description: baticApp.app.__lang('If checked, Rejected Quantity will be included while making Purchase Invoice from Purchase Receipt.'),
                                type: 'Check',
                                default_value: 0
                            }
                        ]
                    },
                ]
            },
            {
                type: 'row',
                title: baticApp.app.__lang('Subcontract'),
                fields: [
                    {
                        col: 6,
                        field: {
                            name: 'backflush_raw_materials_of_subcontract_based_on',
                            title: baticApp.app.__lang('Backflush Raw Materials of Subcontract Based On'),
                            type: 'Select'
                        }
                    },
                    {
                        col: 6,
                        field: {
                            name: 'over_transfer_allowance',
                            title: baticApp.app.__lang('Over Transfer Allowance (%)'),
                            description: baticApp.app.__lang('Percentage you are allowed to transfer more against the quantity ordered. For example: If you have ordered 100 units. and your Allowance is 10% then you are allowed to transfer 110 units.'),
                            type: 'Float',
                            default_value: '0.00',
                            depends_on: ('form.backflush_raw_materials_of_subcontract_based_on=="BOM"')
                        }
                    }
                ]
            }


        ]
    }
}
