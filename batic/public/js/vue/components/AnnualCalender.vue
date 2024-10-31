<template>
  <div class='demo-app'>
    <div class='demo-app-sidebar pe-2'>
      <div class="mb-2">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="toggleWeekends" :checked="calendarOptions.hiddenDays.length" @change="handleWeekendsToggle">
          <label class="form-check-label" for="toggleWeekends">
            {{frappe._('Hide Weekends')}}
          </label>
        </div>
        <div class="mt-2">
          <label class="form-label">{{frappe._('Select Employee')}}</label>
          <vue-chosen :model-value="filters" model-key="employee" :options="employees_chosen_list" label="label" track-by="value" :placeholder="frappe._('Chose an employee')"></vue-chosen>
        </div>
      </div>
      <div class='demo-app-sidebar-section'>
        <h4>{{frappe._('Reasons')}}</h4>
        <ul style="list-style:none;padding:0 10px;">
          <li :style="`margin-bottom:6px;font-size:13px;font-weight:500;color:${reason.color}`" v-for="reason in reasons">
            <i class="far fa-dot-circle"></i> {{reason.label}}
          </li>
        </ul>
      </div>
      <!--      <div class='demo-app-sidebar-section'>-->
      <!--        <h2>All Events ({{ currentEvents.length }})</h2>-->
      <!--        <ul>-->
      <!--          <li v-for='event in currentEvents' :key='event.id'>-->
      <!--            <b>{{ event.startStr }}</b>-->
      <!--            <i>{{ event.title }}</i>-->
      <!--          </li>-->
      <!--        </ul>-->
      <!--      </div>-->
    </div>
    <div class='demo-app-main'>
      <FullCalendar class="demo-app-calendar" :options="calendarOptions" ref="fullCalendar">
        <template v-slot:eventContent='arg'>
          <div class="d-flex align-items-center" style="column-gap:5px;padding:6px;">
            <img style="width:35px;height:35px;border-radius:50%;" :src="(arg.event.extendedProps.employee_photo)?arg.event.extendedProps.employee_photo:'/assets/batic/images/user.png'">
            <div>
              <b class="d-block">{{ arg.event.extendedProps.employee_name }}</b>
              <i>{{ arg.event.title }}</i>
            </div>
          </div>
        </template>
      </FullCalendar>
    </div>
  </div>
</template>
<script>

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import {INITIAL_EVENTS, createEventId} from './event-utils'
import VueChosen from "./vue-chosen.vue";


export default {
  name: "AnnualCalender",
  components: {
    FullCalendar,
    VueChosen
  },
  data() {
    return {
      frappe: frappe,
      vacations_list: [],
      employees_list: [],
      employees_chosen_list: [{
        label: frappe._('All Employees'),
        value: ''
      }],
      filters: {
        employee: ''
      },
      reasons: [
        {
          name: 'Vacation Days',
          label: frappe._('Vacation Days'),
          color: '#d64d4d'
        },
        {
          name: 'Sick Leave',
          label: frappe._('Sick Leave'),
          color: '#3c8cf5'
        },
        {
          name: 'Personal Time',
          label: frappe._('Personal Time'),
          color: '#1bae4b'
        },
        {
          name: 'Bereavement',
          label: frappe._('Bereavement'),
          color: '#855dea'
        }
      ],
      calendarOptions: {
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin // needed for dateClick
        ],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialView: 'dayGridMonth',
        initialEvents: [],
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        hiddenDays: [],
        firstDay: 0,
        dayHeaderFormat: {weekday: 'long'},
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents
        /* you can update a remote database when these fire:
        eventAdd:
        eventChange:
        eventRemove:
        */
      },
      currentEvents: [],
    }
  },
  watch: {
    'filters.employee': {
      handler(employee) {
        console.log('Employee filter changed:', employee);
        if (employee && employee.length) {
          this.get_vacations({employee: employee}, (vacations) => {
            this.build_vacations(vacations);
          });
        } else {
          this.get_vacations({}, (vacations) => {
            this.build_vacations(vacations);
          });
        }
      },
      deep: true
    },
  },
  methods: {
    handleWeekendsToggle() {
      if (!this.calendarOptions.hiddenDays.length)
        this.calendarOptions.hiddenDays = [5, 6]
      else
        this.calendarOptions.hiddenDays = []
    },
    handleDateSelect(selectInfo) {
      return false
      let title = prompt('Please enter a new title for your event')
      let calendarApi = selectInfo.view.calendar

      calendarApi.unselect() // clear date selection
      if (title) {
        calendarApi.addEvent({
          id: createEventId(),
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay
        })
      }
    },
    handleEventClick(clickInfo) {
      return false
      if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        clickInfo.event.remove()
      }
    },
    handleEvents(events) {
      this.currentEvents = events
    },
    get_employees(callback) {
      frappe.db.get_list('Employee', {fields: ["name", "employee_name", "image"]}).then((employees) => {
        callback(employees)
      });
    },
    get_vacations(filters = {}, callback) {
      filters['status'] = 'Approved';
      frappe.db.get_list('Vacation', {fields: ["*"], filters: filters}).then((vacations) => {
        callback(vacations)
      });
    },
    build_vacations(vacations) {
      if (vacations && vacations.length) {
        vacations.map(vacation => {
          let employee = this.employees_list.filter(emp => emp.name === vacation.employee)[0];
          let reason = this.reasons.filter(res => res.name === vacation.reason)[0];
          const calendarApi = this.$refs.fullCalendar.getApi();
          calendarApi.removeAllEvents();
          this.calendarOptions.events = [];
          this.vacations_list = [];
          setTimeout(() => {
            this.vacations_list.push({
              id: vacation.name,
              employee_name: employee?.employee_name,
              employee_photo: employee?.image,
              title: frappe._(vacation.reason),
              backgroundColor: reason?.color,
              borderColor: reason?.color,
              start: moment(vacation.start_date).format('YYYY-MM-DD'),
              end: moment(vacation.end_date).format('YYYY-MM-DD'),
            });
            this.calendarOptions.events = this.vacations_list
            // this.vacations_list.map(event => {
            //   calendarApi.addEvent(event);
            // });
          }, 500);
        });
      }
    }
  },
  async mounted() {
    await this.get_employees((employees) => {
      if (employees && employees.length) {
        this.employees_list = employees;
        employees.map(employee => {
          this.employees_chosen_list.push({
            label: employee.employee_name,
            value: employee.name
          })
        });
      }
      this.get_vacations({}, (vacations) => {
        this.build_vacations(vacations);
      });
    });
  }
}
</script>
<style lang="scss" scoped>
.demo-app {
  display: flex;
  min-height: 100%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
  column-gap: 30px;
}

.demo-app-sidebar {
  width: 300px;
  line-height: 1.5;
  border-right: 1px solid #eeeeee;
}

.demo-app-sidebar-section {
  padding: 0;
}

.demo-app-main {
  flex-grow: 1;
  padding: 0;
}

.fc { /* the calendar root */
  max-width: 100%;
  height: 100%;
}

</style>
