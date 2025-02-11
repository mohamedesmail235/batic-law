$rootScope.app.defaults.defaultDatetimeFormat = $rootScope.app.defaults.date_format + " " + $rootScope.app.defaults.time_format;
moment.defaultFormat = $rootScope.app.defaults.date_format;
$.extend(App.datetime, {
    convert_to_user_tz: function (date, format) {
        // format defaults to true
        if ($rootScope.app.defaults.time_zone) {
            var date_obj = moment.tz(date, $rootScope.app.defaults.time_zone).local();
        } else {
            var date_obj = moment(date);
        }

        return (format === false) ? date_obj : date_obj.format($rootScope.app.defaults.defaultDatetimeFormat);
    },

    convert_to_system_tz: function (date, format) {
        // format defaults to true

        if ($rootScope.app.defaults.time_zone) {
            var date_obj = moment(date).tz($rootScope.app.defaults.time_zone);
        } else {
            var date_obj = moment(date);
        }

        return (format === false) ? date_obj : date_obj.format($rootScope.app.defaults.defaultDatetimeFormat);
    },

    is_timezone_same: function () {
        if ($rootScope.app.defaults.time_zone) {
            return moment().tz($rootScope.app.defaults.time_zone).utcOffset() === moment().utcOffset();
        } else {
            return true;
        }
    },

    str_to_obj: function (d) {
        return moment(d, $rootScope.app.defaults.defaultDatetimeFormat)._d;
    },

    obj_to_str: function (d) {
        return moment(d).locale("en").format();
    },

    obj_to_user: function (d) {
        return moment(d).format(App.datetime.get_user_date_fmt().toUpperCase());
    },

    get_diff: function (d1, d2) {
        return moment(d1).diff(d2, "days");
    },

    get_hour_diff: function (d1, d2) {
        return moment(d1).diff(d2, "hours");
    },

    get_day_diff: function (d1, d2) {
        return moment(d1).diff(d2, "days");
    },

    add_days: function (d, days) {
        return moment(d).add(days, "days").format();
    },

    add_months: function (d, months) {
        return moment(d).add(months, "months").format();
    },

    week_start: function () {
        return moment().startOf("week").format();
    },

    week_end: function () {
        return moment().endOf("week").format();
    },

    month_start: function () {
        return moment().startOf("month").format();
    },

    month_end: function () {
        return moment().endOf("month").format();
    },

    quarter_start: function () {
        return moment().startOf("quarter").format();
    },

    quarter_end: function () {
        return moment().endOf("quarter").format();
    },

    year_start: function () {
        return moment().startOf("year").format();
    },

    year_end: function () {
        return moment().endOf("year").format();
    },

    get_user_time_fmt: function () {
        return $rootScope.app.defaults && $rootScope.app.defaults.time_format || "HH:mm:ss";
    },

    get_user_date_fmt: function () {
        return $rootScope.app.defaults && $rootScope.app.defaults.date_format || "yyyy-mm-dd";
    },

    get_user_fmt: function () {  // For backwards compatibility only
        return $rootScope.app.defaults && $rootScope.app.defaults.date_format || "yyyy-mm-dd";
    },

    str_to_user: function (val, only_time = false) {
        if (!val) return "";
        var user_time_fmt = App.datetime.get_user_time_fmt();
        if (only_time) {
            return moment(val, $rootScope.app.defaults.time_format).format(user_time_fmt);
        }
        var user_date_fmt = App.datetime.get_user_date_fmt().toUpperCase();
        if (typeof val !== "string" || val.indexOf(" ") === -1) {
            return moment(val).format(user_date_fmt);
        } else {
            return moment(val, "YYYY-MM-DD HH:mm:ss").format(user_date_fmt + " " + user_time_fmt);
        }
    },

    get_datetime_as_string: function (d) {
        return moment(d).format("YYYY-MM-DD HH:mm:ss");
    },

    user_to_str: function (val, only_time = false) {
        var user_time_fmt = App.datetime.get_user_time_fmt();
        if (only_time) {
            return moment(val, user_time_fmt).format($rootScope.app.defaults.time_format);
        }
        var user_fmt = App.datetime.get_user_date_fmt().toUpperCase();
        var system_fmt = "YYYY-MM-DD";
        if (val.indexOf(" ") !== -1) {
            user_fmt += " " + user_time_fmt;
            system_fmt += " HH:mm:ss";
        }
        // user_fmt.replace("YYYY", "YY")? user might only input 2 digits of the year, which should also be parsed
        return moment(val, [user_fmt.replace("YYYY", "YY"), user_fmt]).locale("en").format(system_fmt);
    },

    user_to_obj: function (d) {
        return App.datetime.str_to_obj(App.datetime.user_to_str(d));
    },

    global_date_format: function (d) {
        var m = moment(d);
        if (m._f && m._f.indexOf("HH") !== -1) {
            return m.format("Do MMMM YYYY, h:mma")
        } else {
            return m.format('Do MMMM YYYY');
        }
    },

    now_date: function (as_obj = false) {
        return App.datetime._date($rootScope.app.defaults.date_format, as_obj);
    },

    now_time: function (as_obj = false) {
        return App.datetime._date($rootScope.app.defaults.time_format, as_obj);
    },

    now_datetime: function (as_obj = false) {
        return App.datetime._date($rootScope.app.defaults.defaultDatetimeFormat, as_obj);
    },

    _date: function (format, as_obj = false) {
        const time_zone = $rootScope.app.defaults && $rootScope.app.defaults.time_zone;
        let date;
        if (time_zone) {
            date = moment.tz(time_zone);
        } else {
            date = moment();
        }
        if (as_obj) {
            return App.datetime.moment_to_date_obj(date);
        } else {
            return date.format(format);
        }
    },

    moment_to_date_obj: function (moment) {
        const date_obj = new Date();
        const date_array = moment.toArray();
        date_obj.setFullYear(date_array[0]);
        date_obj.setMonth(date_array[1]);
        date_obj.setDate(date_array[2]);
        date_obj.setHours(date_array[3]);
        date_obj.setMinutes(date_array[4]);
        date_obj.setSeconds(date_array[5]);
        date_obj.setMilliseconds(date_array[6]);
        return date_obj;
    },

    nowdate: function () {
        return App.datetime.now_date();
    },

    get_today: function () {
        return App.datetime.now_date();
    },

    get_time: (timestamp) => {
        // return time with AM/PM
        return moment(timestamp).format('hh:mm A');
    },

    validate: function (d) {
        return moment(d, [
            $rootScope.app.defaults.date_format,
            $rootScope.app.defaults.defaultDatetimeFormat,
            $rootScope.app.defaults.time_format
        ], true).isValid();
    },

});