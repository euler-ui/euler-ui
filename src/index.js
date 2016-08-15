import ESelect from './select'
import ERequest from './request/Request'
import ENotification from './notification'
import LocalizationFacotry from './i18n'
import ESpinner from './spinner'
export const Select = ESelect
export const Request = ERequest
export const request = Request
export const Notification = ENotification
export const Notify = Notification
export const i18n = LocalizationFacotry.create().init()
export const Localization = i18n
export const Spinner = ESpinner