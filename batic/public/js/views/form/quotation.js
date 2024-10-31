baticApp.forms['quotation'] = {
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
                    col: 3,
                    field: {
                        name: 'sales_order',
                        title: baticApp.app.__lang('Order'),
                        type: 'Link',
                        link: {
                            txt: '',
                            doctype: 'Order',
                            reference_doctype: 'Quotation',
                            ignore_user_permissions: 0,
                            page_length: 10
                        },
                        required: true,
                    }
                },
                {
                    col: 3,
                    field: {
                        name: 'order_type_custom',
                        title: baticApp.app.__lang('Order Type'),
                        type: 'Select',
                        required: true,
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
                    col: 4,
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
                    col: 4,
                    field: {
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
                },
                {
                    col: 4,
                    field: {
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
                },
                {
                    col: 4,
                    field: {
                        name: 'calculation_type',
                        title: baticApp.app.__lang('Calculation Type'),
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
                    col: 4,
                    field: {
                        name: 'fee',
                        title: baticApp.app.__lang('Fee'),
                        type: 'Currency',
                        required: false,
                        depends_on: ("form.calculation_type=='Flat Fee' || form.calculation_type=='Percentage + Flat Fee'")
                    }
                },
                {
                    col: 4,
                    field: {
                        name: 'percentage',
                        title: baticApp.app.__lang('Percentage'),
                        type: 'Float',
                        required: false,
                        depends_on: ("form.calculation_type=='Percentage' || form.calculation_type=='Percentage + Flat Fee'")
                    }
                },
                {
                    col: 4,
                    field: {
                        name: 'per_hour_type',
                        title: baticApp.app.__lang('Per Hour Type'),
                        type: 'Select',
                        required: false,
                        depends_on: ("form.calculation_type=='Per Hour'")
                    }
                },
                {
                    col: 4,
                    field: {
                        name: 'target_hours',
                        title: baticApp.app.__lang('Target Hours'),
                        type: 'Float',
                        required: false,
                        depends_on: ("form.per_hour_type=='Average hours' && form.calculation_type=='Per Hour'")
                    }
                },
                {
                    col: 4,
                    field: {
                        name: 'target_hour_price',
                        title: baticApp.app.__lang('Target Hour Price'),
                        type: 'Currency',
                        required: false,
                        depends_on: ("form.per_hour_type=='Average hours' && form.calculation_type=='Per Hour'")
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
                        required: true,
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
            title: baticApp.app.__lang('Technical Position Per Hour Fees <small>(Read)</small>'),
            fields: [
                {
                    col: 12,
                    field: {
                        name: 'technical_position_per_hour_fees',
                        title: baticApp.app.__lang('Technical Position Per Hour Fees (Read)'),
                        hide_label: true,
                        type: 'HTML',
                        default_value: ''
                    }
                }
            ]
        }
    ]
}
