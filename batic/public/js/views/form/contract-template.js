baticApp.forms['contract-template'] = {
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
                    col: 12,
                    field: {
                        name: 'contract_terms',
                        title: baticApp.app.__lang('Contract Terms and Conditions'),
                        type: 'Editor Text',
                    }
                }
            ]
        },
        {
            type: 'row',
            title: baticApp.app.__lang('Contract Template Example'),
            fields: [
                {
                    col: 12,
                    field: {
                        name: 'contract_template_help',
                        title: baticApp.app.__lang('Examples'),
                        hide_label: true,
                        type: 'HTML',
                        default_value: `
                            <pre class="json-code">
Contract for Customer {{ party_name }}

-Valid From : {{ start_date }} 
-Valid To : {{ end_date }}
                        </pre>
                    <h4>How to get fieldnames</h4>
                    <p>
                        The field names you can use in your Contract Template are the fields in the Contract for which you are creating the template. You can find out the fields of any documents via Setup &gt; Customize Form View and selecting the document
                        type (e.g. Contract)
                    </p>
                    <h4>Templating</h4>
                    <p>Templates are compiled using the Jinja Templating Language. To learn more about Jinja, <a class="strong" href="http://jinja.pocoo.org/docs/dev/templates/">read this documentation.</a></p>
                        `
                    }
                }
            ]
        }
    ]
}
