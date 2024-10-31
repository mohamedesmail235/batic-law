baticApp.doctypes['quotation'] = {
    init: function (form_data, $rootScope, $scope, $http, $timeout) {
        console.log('form_data', form_data)
        frappe.call({
            method: "frappe.desk.form.load.getdoc",
            args: {
                doctype: 'GEHR',
                name: 'GEHR',
            },
            callback: (response) => {
                if (response && response.docs && response.docs[0]) {
                    const doc = response.docs[0];
                    form_data.technical_position_per_hour_fees = `
                        <div>
                            <ul> 
                                <li><b>${baticApp.app.__lang('PLawyer')} :</b> ${doc.parther},</li>
                                <li><b>${baticApp.app.__lang('ConsLawyer')} :</b> ${doc.consultant}</li>
                                <li><b>${baticApp.app.__lang('Senior Lawyer')} :</b> ${doc.senior_lawyer}</li>
                                <li><b>${baticApp.app.__lang('Lawyer')} :</b> ${doc.lawyer}</li>
                                <li><b>${baticApp.app.__lang('Attorney AssLawyer')} :</b> ${doc.attorney_assistant}</li>
                                <li><b>${baticApp.app.__lang('Legal SecLawyer')} :</b> ${doc.legal_secretary}</li>
                            </ul>
                            <p><small>${baticApp.app.__lang('If Change Needed, Please update Global Hour rate before Save')}</small></p>
                        </div>
                    `;
                }
            }
        });
    },
    load: function (form, scope) {

        if (!form.total || form.total == 0)
            form.total = 0;
        if (!form.total_qty || form.total_qty == 0)
            form.total_qty = 0;
        if (!form.grand_total || form.grand_total == 0)
            form.grand_total = 0;
        if (!form.total_taxes_and_charges || form.total_taxes_and_charges == 0)
            form.total_taxes_and_charges = 0;

        // Items Table
        if (form && form.items) {
            let items = form.items;
            let total = 0;
            let total_qty = 0;
            for (let key in items) {
                if (items.hasOwnProperty(key)) {
                    let item = items[key];
                    if (item.item_code && (!item.qty || item.qty == 0)) {
                        item.qty = 1;
                    }
                    if (item.qty && item.qty > 0) {
                        total_qty += parseFloat(item.qty);
                    }
                    if ((item.qty && item.qty > 0) && (item.rate && item.rate >= 0)) {
                        item.amount = (item.qty * item.rate);
                        total += parseFloat(item.amount);
                    }
                }
            }
            form.total = parseFloat(total).toFixed(2);
            form.total_qty = total_qty;
            if (form.total_taxes_and_charges > 0) {
                form.grand_total = parseFloat(parseFloat(form.total) + parseFloat(form.total_taxes_and_charges)).toFixed(2);
            } else {
                form.grand_total = parseFloat(form.total);
            }
        }

    },
    data: function ($rootScope) {
        let data = {};
        let fields = $rootScope.formView.form.get_fields();
        console.log('fields', fields)
        fields.map(field => {
            if (field.type === 'Fload' || field.type === 'Currency') {
                data[field.name] = floatVal($rootScope.formView.form.data[field.name]);
            } else if (field.type === 'Int') {
                data[field.name] = intVal($rootScope.formView.form.data[field.name]);
            } else if (field.type === 'Check') {
                data[field.name] = ($rootScope.formView.form.data[field.name] === '1') ? 1 : 0;
            } else if (field.type === 'Table') {
                let table_data = $rootScope.formView.form.data[field.name];
                let send_data = [];
                let fields_names = field.fields.map(f => f.name);
                if (table_data && table_data.length) {
                    send_data = table_data.map(item => {
                        let newObj = {};
                        fields_names.forEach(key => {
                            if (item.hasOwnProperty(key)) {
                                newObj[key] = item[key];
                            }
                        });
                        return newObj;
                    });
                }
                data[field.name] = send_data;
            } else {
                data[field.name] = stringVal($rootScope.formView.form.data[field.name]);
            }
        });
        return data
    },
    events: function (form_data, $rootScope, $scope, $http, $timeout) {
        // Items Child Table
        $(document).on('field-link-blur', '#field-table-items [data-fieldname="item_code"]', function () {
            let row = $(this).parents('tr');
            if (!$(this).val())
                return
            let item_code = $(this).val();
            frappe.db.get_value('Item', {'name': item_code}, ['item_name', 'stock_uom', 'standard_rate']).then(function (response) {
                $timeout(() => {
                    $('[data-fieldname="uom"]', row).val(response.message.stock_uom).trigger('field-link-blur');
                    $('[data-fieldname="rate"]', row).val(response.message.standard_rate || '0').trigger('input');
                }, 10);
            });
        });
        // Get Order Details
        $(document).on('field-link-blur', '[data-fieldname="sales_order"]', function () {
            console.log('sales_order', form_data.sales_order)
            if (form_data.sales_order) {
                frappe.call({
                    method: "batic.l_management.doctype.worktime.worktime.get_doc_record_details",
                    args: {
                        doctype: 'Order',
                        docname: form_data.sales_order,
                    },
                    callback: ({message}) => {
                        $timeout(() => {
                            $('[data-fieldname="party_name"]').val(message.customer).triggerAll('input field-link-blur');
                            $('[data-fieldname="order_type_custom"]').val(message.order_typec).trigger('change');
                        }, 10);
                    }
                });
            }
        });
    },
    items: function (items) {
        let list = [];
        for (let key in items) {
            if (items.hasOwnProperty(key)) {
                let item = items[key];
                let list_item = {};
                list_item['item_code'] = item.item_code;
                list_item['uom'] = item.uom;
                list_item['qty'] = item.qty;
                list_item['rate'] = item.rate;
                list.push(list_item);
            }
        }
        return list;
    }
}
