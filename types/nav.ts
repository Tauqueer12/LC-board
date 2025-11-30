export type MainNavItem = {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
}

export type SidebarNavItem = {
  title: string
  href?: string
  items?: SidebarNavItem[]
}
