import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
} from '@mui/material'
import { LayoutGroup, motion } from 'framer-motion'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NavLink, navLinks } from './constants'
import ActiveImage from '~/assets/images/파링이보다 귀여운 파치리스.png'

export type RootDrawerProps = {
  open: boolean
  onClose: () => void
}

const NavLinkItem: React.FC<{ item: NavLink }> = ({ item }) => {
  const loc = useLocation()

  const pathname = React.useMemo(
    () => (loc.pathname.endsWith('/') ? loc.pathname : loc.pathname + '/'),
    [loc.pathname]
  )

  const active = React.useMemo(() => item.match.test(pathname), [pathname])

  return (
    <ListItemButton selected={active} component={Link} to={item.to}>
      <ListItemText primary={item.label} />
      {active && (
        <motion.img
          src={ActiveImage}
          height={32}
          width={32}
          alt="active"
          layoutId="mobile-drawer-link-active"
        />
      )}
    </ListItemButton>
  )
}

export const RootDrawer: React.FC<RootDrawerProps> = ({ onClose, open }) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Toolbar />
      <LayoutGroup>
        <List sx={{ minWidth: 256 }}>
          {/* Nav Links */}

          {navLinks.map((x, i) => (
            <NavLinkItem item={x} key={i} />
          ))}
        </List>
      </LayoutGroup>
    </Drawer>
  )
}
