baticApp.doctypes['stock-entry'] = {
    load: function (form, scope) {

    },
    data: function ($rootScope) {
        return {
            "naming_series": stringVal($rootScope.formView.form.data.naming_series),
            "company": stringVal($rootScope.formView.form.data.company),
            "posting_date": moment($rootScope.formView.form.data.posting_date).format('YYYY-MM-DD'),
            "posting_time": stringVal($rootScope.formView.form.data.posting_time),
            "items": ($rootScope.formView.form.data.items) ? this.items($rootScope.formView.form.data.items) : [],
        };
    },
    items: function (items) {
        let list = [];
        for (let key in items) {
            if (items.hasOwnProperty(key)) {
                let item = items[key];
                let list_item = {};
                if (item.s_warehouse)
                    list_item['s_warehouse'] = item.s_warehouse;
                if (item.t_warehouse)
                    list_item['t_warehouse'] = item.t_warehouse;
                list_item['item_code'] = item.item_code;
                list_item['qty'] = item.qty;
                list_item['basic_rate'] = item.basic_rate;
                list_item['description'] = '';
                list.push(list_item);
            }
        }
        return list;
    }
}
