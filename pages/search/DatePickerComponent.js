import React from 'react'
import DatePickerType from '../../components/Op/DatePickerType.constant'
import { DatePicker } from 'antd'

const { MonthPicker, RangePicker, WeekPicker } = DatePicker
/**
 * Stupid components only show the type of date picker depends on the parent value passed down
 */
export default function DatePickerComponent(props) {
    const { onDateChange } = props
    switch (props.datePickerType) {
        case DatePickerType.MonthRange:
            return (<MonthPicker onChange={month => onDateChange(month)} />)
        case DatePickerType.DateRange:
            return (<RangePicker onChange={dates => onDateChange(dates)} />)
        case DatePicker.WeekRange:
            return (<WeekPicker onChange={week => onDateChange(week)} />)
        default:
            return (<DatePicker onChange={date => onDateChange(date)} />)
    }
}
