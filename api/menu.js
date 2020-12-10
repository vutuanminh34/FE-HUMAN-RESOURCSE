const Menu = [
  { header: 'Apps' },
  {
    title: 'Dashboard',
    group: 'apps',
    icon: 'dashboard',
    name: 'dashboard',
    href: '/',
    permissions: ['Admin', 'User', 'Mod'],
  },
  {
    title: 'Account List',
    group: 'apps',
    name: 'account',
    icon: 'mdi-account-box-multiple',
    href: '/account',
    permissions: ['Admin'],
  },
  {
    title: 'Resource List',
    group: 'apps',
    name: 'person',
    icon: 'mdi-account-multiple',
    href: '/person',
    permissions: ['Admin', 'User', 'Mod'],
  },
  {
    title: 'Category',
    group: 'apps',
    name: 'category',
    icon: 'mdi-format-list-bulleted-square',
    href: '/category',
    permissions: ['Admin', 'Mod'],
  },
  {
    title: 'Technology',
    group: 'apps',
    name: 'technology',
    icon: 'mdi-android',
    href: '/technology',
    permissions: ['Admin', 'Mod'],
  },
]
// reorder menu
Menu.forEach((item) => {
  if (item.items) {
    item.items.sort((x, y) => {
      const textA = x.title.toUpperCase()
      const textB = y.title.toUpperCase()
      return textA < textB ? -1 : textA > textB ? 1 : 0
    })
  }
})
export default Menu
