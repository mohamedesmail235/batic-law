baticApp.forms['contract'] = {
    form: [
        {
            type: 'row',
            fields: [
                {
                    col: 6,
                    field: {
                        name: 'party_type',
                        title: baticApp.app.__lang('Party Type'),
                        type: 'Select',
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'party_name',
                        title: baticApp.app.__lang('Party Name'),
                        type: 'Link',
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
                        name: 'quotation',
                        title: baticApp.app.__lang('Quotation'),
                        type: 'Link',
                        link: {
                            txt: '',
                            doctype: 'Quotation',
                            reference_doctype: 'Contract',
                            page_length: 10
                        },
                        required: true,
                    }
                },
                {
                    col: 4,
                    field: {
                        name: 'contract_type',
                        title: baticApp.app.__lang('Contract Type'),
                        type: 'Select',
                        required: true
                    }
                },
                {
                    col: 4,
                    field: {
                        name: 'calculation_type',
                        title: baticApp.app.__lang('Calculation Type'),
                        type: 'Select',
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
                        name: 'flat_fee_type',
                        title: baticApp.app.__lang('Flat Fee Type'),
                        type: 'Select',
                        required: false,
                        depends_on: ("form.calculation_type=='Flat Fee' && form.contract_type=='Periodical'")
                    }
                },
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
                    col: 4,
                    field: {
                        name: 'start_date',
                        title: baticApp.app.__lang('Start Date'),
                        type: 'Date',
                        required: true
                    }
                },
                {
                    col: 4,
                    field: {
                        name: 'end_date',
                        title: baticApp.app.__lang('End Date'),
                        type: 'Date',
                        required: true
                    }
                }
            ]
        },
        {
            type: 'row',
            title: baticApp.app.__lang('Contract Details'),
            fields: [
                {
                    col: 12,
                    field: {
                        name: 'contract_details',
                        title: baticApp.app.__lang('Contract Details'),
                        type: 'Editor Text',
                        required: true,
                    }
                },
                {
                    col: 6,
                    field: {
                        name: 'contract_template',
                        title: baticApp.app.__lang('Contract Template'),
                        type: 'Link',
                        link: {
                            txt: '',
                            doctype: 'Contract Template',
                            reference_doctype: 'Contract',
                            page_length: 10
                        },
                        required: false,
                    }
                },
                {
                    col: 12,
                    field: {
                        name: 'contract_terms',
                        title: baticApp.app.__lang('Contract Terms'),
                        type: 'Editor Text',
                        required: true,
                    }
                }
            ]
        }
    ]
}
