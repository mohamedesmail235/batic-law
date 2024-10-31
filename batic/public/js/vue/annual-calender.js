/*
* Annual Calender Vue Component
*/

import {createApp} from 'vue';
import AnnualCalender from './components/AnnualCalender.vue';

$(document).on('run-annual-calender-component', function () {
    frappe.AnnualCalenderPageComponent = createApp(AnnualCalender).mount($('#batic-annual-calender-page')[0]);
});
