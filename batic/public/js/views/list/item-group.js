baticApp.list_view['item-group'] = {
    columns: [
        {
            name: 'name',
            label: baticApp.app.__lang('Name'),
            template: `<a class="docname-link d-flex align-items-center" ui-sref="app.form({parent:current_route_params.parent,doctype:'item-group',type:'view',docname:row.name})"> 
                                <div class="list-thumbnail list-thumbnail-sm"><div class="centered"><img ng-src="{{(row.image)?row.image:'/assets/batic/images/null.png'}}"></div></div>
                                {{row.name}}
                           </a>`
        },
        {
            name: 'parent_item_group',
            label: baticApp.app.__lang('Parent'),
            template: '{{row.parent_item_group}}'
        },
        {
            name: 'is_group',
            label: baticApp.app.__lang('Is Group'),
            template: `<i class="far" ng-class="(row.is_group)?'fa-check-square text-success':'fa-square text-secondary'"></i>`
        }
    ]
};
