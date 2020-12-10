import moment from 'moment'

export const ACCESS_ALL = '*'
export const ACCESS_ROLE = 'ROLE'
export const ACCESS_USER = 'USER'
export const ACCESS_STAFF = 'STAFF'
export const ACCESS_STATISTIC = 'STATISTIC'
export const ACCESS_PRODUCT = 'PRODUCT'
export const ACCESS_SETTING = 'SETTING'
// office item
export const LIST_OFFICE = [
  { id: 0, name: 'HAN' },
  { id: 1, name: 'DAD' },
  { id: 2, name: 'HCM' },
]
// list gender
export const LIST_GENDER = [
  { id: 0, name: 'Male' },
  { id: 1, name: 'Female' },
  { id: 2, name: 'Sexless' },
]
// status account
export const ACCOUNT_INACTIVE = 'INACTIVATED'
export const ACCOUNT_LOCKED = 'LOCKED'
export const ACCOUNT_ACTIVE = 'ACTIVATED'

export const ERROR_LOGIN_OTHER_DEVICE = 'LOGIN_OTHER_DEVICE'
export const ERROR_STATUS_USER_CHANGED = 'STATUS_USER_CHANGED'

export const PRODUCT_INACTIVE = 'INACTIVATED'
export const PRODUCT_ACTIVE = 'ACTIVATED'

export const TYPE_POST = 'POST'
export const TYPE_PRODUCT = 'PRODUCT'

export const FILTER_PRODUCT_CATEGORY = 'PRODUCT_CATEGORY'
export const FILTER_PRODUCT_SPECIALIZED = 'PRODUCT_SPECIALIZED'

export const STATUS_PENDING = 'PENDING'
export const STATUS_APPROVED = 'APPROVED'
export const STATUS_FAIL = 'FAILED'
export const STATUS_CANCELED = 'CANCELED'

export function getAccessColor(role) {
  const colors = {
    [ACCESS_ALL]: 'primary',
    [ACCESS_ROLE]: 'purple',
    [ACCESS_USER]: 'pink',
    [ACCESS_STAFF]: 'orange',
    [ACCESS_STATISTIC]: 'deep-purple',
    [ACCESS_PRODUCT]: 'blue',
    [ACCESS_SETTING]: 'teal',
  }
  return colors[role] || 'red'
}

export function getAccessName(roleCode) {
  const names = {
    [ACCESS_ALL]: 'Tất cả',
    [ACCESS_ROLE]: 'Quản lý Vai trò và Quyền',
    [ACCESS_USER]: 'Quản lý người dùng',
    [ACCESS_STAFF]: 'Quản lý nhân viên',
    [ACCESS_STATISTIC]: 'Thống kê',
    [ACCESS_PRODUCT]: 'Quản lý sản phẩm',
    [ACCESS_SETTING]: 'Cấu hình trang',
  }

  return names[roleCode] || roleCode
}

export function getAccessItems() {
  const accesses = [
    ACCESS_ALL,
    ACCESS_ROLE,
    ACCESS_USER,
    ACCESS_STAFF,
    ACCESS_STATISTIC,
    ACCESS_PRODUCT,
    ACCESS_SETTING,
  ]
  return accesses.map((v) => ({
    value: v,
    text: getAccessName(v),
  }))
}

export function getStatusAccountName(status) {
  const names = {
    [ACCOUNT_INACTIVE]: 'Inactive',
    [ACCOUNT_ACTIVE]: 'Active',
    [ACCOUNT_LOCKED]: 'Locked',
  }

  return names[status] || status
}

export function getColorAccountStatus(status) {
  const colors = {
    [ACCOUNT_INACTIVE]: 'orange',
    [ACCOUNT_ACTIVE]: 'green',
    [ACCOUNT_LOCKED]: 'red',
  }
  return colors[status] || 'orange'
}

export function getStatusProductName(status) {
  const names = {
    [PRODUCT_INACTIVE]: 'Chưa hoạt động',
    [PRODUCT_ACTIVE]: 'Hoạt động',
  }

  return names[status] || status
}

export function getColorProductStatus(status) {
  const colors = {
    [PRODUCT_INACTIVE]: 'orange',
    [PRODUCT_ACTIVE]: 'green',
  }
  return colors[status] || 'orange'
}

export function getIconStatus(status) {
  const colors = {
    [PRODUCT_INACTIVE]: 'mdi-window-close',
    [PRODUCT_ACTIVE]: 'mdi-check',
  }
  return colors[status] || 'mdi-window-close'
}

export function formatPrice(number) {
  const str = String(number)
  return str.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}

export function formatDateTime(datetime) {
  return moment(datetime).format('DD/MM/YYYY')
}

export function formatDateLabels(type, datetime) {
  const labels = {
    hours: `${moment(datetime).format('H')} giờ`,
    days: moment(datetime).format('DD/MM'),
    weeks: `Tuần ${moment(datetime).week()} - ${moment(datetime).format(
      'MM/YYYY'
    )}`,
    months: `Tháng ${moment(datetime).format('MM/YYYY')}`,
    custom: moment(datetime).format('DD/MM'),
  }

  return labels[type] || ''
}

export function getUnixStartTime(date) {
  return moment(date, 'YYYY-M-D').startOf('days').valueOf()
}

export function getUnixEndTime(date) {
  return moment(date, 'YYYY-M-D').endOf('days').valueOf()
}

export function getUnixTime(date) {
  return moment(date, 'YYYY-M-D').valueOf()
}

export function getFilterCategoryProductName(filter) {
  const names = {
    [FILTER_PRODUCT_CATEGORY]: 'Chuyên mục sản phẩm',
    [FILTER_PRODUCT_SPECIALIZED]: 'Lĩnh vực ứng dụng',
  }

  return names[filter] || ''
}

export function getStatusOrderName(status) {
  const names = {
    [STATUS_PENDING]: 'Đang xử lý',
    [STATUS_APPROVED]: 'Thành công',
    [STATUS_CANCELED]: 'Đã hủy',
    [STATUS_FAIL]: 'Lỗi',
  }

  return names[status] || status
}

export function getColorOrderStatus(status) {
  const colors = {
    [STATUS_PENDING]: 'primary',
    [STATUS_APPROVED]: 'green',
    [STATUS_CANCELED]: 'orange',
    [STATUS_FAIL]: 'red',
  }
  return colors[status] || 'orange'
}

export function getStatusReviewName(status) {
  const names = {
    [STATUS_PENDING]: 'Đang chờ duyệt',
    [STATUS_APPROVED]: 'Hoạt động',
    [STATUS_CANCELED]: 'Đã hủy',
  }

  return names[status] || status
}

export function getColorReviewStatus(status) {
  const colors = {
    [STATUS_PENDING]: 'primary',
    [STATUS_APPROVED]: 'green',
    [STATUS_CANCELED]: 'orange',
  }
  return colors[status] || 'red'
}

export function generateDynamicYear() {
  const years = []
  const date = new Date()
  let startYear = date.getFullYear() - 20
  const endYear = date.getFullYear() + 6
  while (startYear < endYear) {
    years.push((startYear++).toString())
  }
  return years
}
export function moveIndex(array, from, to) {
  array.splice(to, 0, array.splice(from, 1)[0])
  return array
}
export function changeToSlug(str) {
  str = str.replace(/^\s+|\s+$/g, '') // trim
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  const from = 'åàáãäâèéëêìíïîòóöôùúüûñç·/_,:;'
  const to = 'aaaaeeeeiiiioooouuuunc------'

  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes

  return str
}
export function handleImgSrc(src) {
  if (!src) return require('@/assets/images/avatar-default.svg')
  // base64 or nuxt link
  if (src.startsWith('data:image') || src.startsWith('/')) return src
  return `${process.env.API_URL}/Avatar/${src}`
}
