/*
* Workspace
*/


baticApp.workspace = {};

baticApp.workspaces = [
    {
        name: 'accounting',
        label: 'Accounting',
        icon: 'far fa-usd-circle',
        links: [
            {name: 'Account', link_to: 'Account', label: 'Chart of Accounts', is_single: false},
            {name: 'Journal Entry', link_to: 'Journal Entry', label: 'Journal Entry', is_single: false},
            {name: 'Payment Entry', link_to: 'Payment Entry', label: 'Payment Entry', is_single: false},
            {name: 'Mode of Payment', link_to: 'Mode of Payment', label: 'Mode of Payment', is_single: false},
            {name: 'Item Tax Template', link_to: 'Item Tax Template', label: 'Item Tax Template', is_single: false},
            {name: 'Fiscal Year', link_to: 'Fiscal Year', label: 'Fiscal Year', is_single: false}
        ],
    },
    {
        name: 'buying',
        label: 'Buying',
         icon: 'far fa-shopping-cart',
        links: [
            {name: 'Supplier', link_to: 'Supplier', label: 'Supplier', is_single: false},
            {name: 'Supplier Group', link_to: 'Supplier Group', label: 'Supplier Group', is_single: false},
            {name: 'Purchase Order', link_to: 'Purchase Order', label: 'Purchase Order', is_single: false},
            {name: 'Purchase Invoice', link_to: 'Purchase Invoice', label: 'Purchase Invoice', is_single: false},
            {name: 'Purchase Taxes and Charges', link_to: 'Purchase Taxes and Charges', label: 'Purchase Taxes and Charges', is_single: false},
            {name: 'Buying Settings', link_to: 'Buying Settings', label: 'Buying Settings', is_single: true}
        ]
    },
    {
        name: 'selling',
        label: 'Selling',
         icon: 'far fa-file-invoice-dollar',
        links: [
            {name: 'Customer', link_to: 'Customer', label: 'Customer', is_single: false},
            {name: 'Customer Group', link_to: 'Customer Group', label: 'Customer Group', is_single: false},
            {name: 'Sales Order', link_to: 'Sales Order', label: 'Sales Order', is_single: false},
            {name: 'Sales Invoice', link_to: 'Sales Invoice', label: 'Sales Invoice', is_single: false},
            {name: 'Sales Taxes and Charges', link_to: 'Sales Taxes and Charges', label: 'Sales Taxes and Charges', is_single: false},
            {name: 'Selling Settings', link_to: 'Selling Settings', label: 'Selling Settings', is_single: true}
        ]
    },
    {
        name: 'stock',
        label: 'Stock',
         icon: 'far fa-box',
        links: [
            {name: 'Item', link_to: 'Item', label: 'Item', is_single: false},
            {name: 'Item Group', link_to: 'Item Group', label: 'Item Group', is_single: false},
            {name: 'Price List', link_to: 'Price List', label: 'Price List', is_single: false},
            {name: 'Warehouse', link_to: 'Warehouse', label: 'Warehouse', is_single: false},
            {name: 'Stock Entry', link_to: 'Stock Entry', label: 'Stock Entry', is_single: false},
            {name: 'Stock Reconciliation', link_to: 'Stock Reconciliation', label: 'Stock Reconciliation', is_single: false}
        ]
    },
    {
        name: 'retail',
        label: 'Retail',
         icon: 'far fa-store',
        links: [
            {name: 'POS Profile', link_to: 'POS Profile', label: 'POS Profile', is_single: false},
            {name: 'POS Opening Shift', link_to: 'POS Opening Shift', label: 'POS Opening Shift', is_single: false},
            {name: 'POS Closing Shift', link_to: 'POS Closing Shift', label: 'POS Closing Shift', is_single: false},
            {name: 'Delivery Charges', link_to: 'Delivery Charges', label: 'Delivery Charges', is_single: false},
            {name: 'POS Offer', link_to: 'POS Offer', label: 'POS Offer', is_single: false},
            {name: 'POS Coupon', link_to: 'POS Coupon', label: 'POS Coupon', is_single: false}
        ]
    },
    {
        name: 'setup',
        label: 'Setup',
         icon: 'far fa-cog',
        links: [
            {name: 'Company', link_to: 'Company', label: 'Company', is_single: false}
        ]
    }
];
