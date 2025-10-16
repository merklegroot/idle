'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import NavInventory from './NavInventory'

function NavLink({ label, href }: { label: string, href: string }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <li>
      <Link 
        href={href} 
        className={`hover:text-gray-300 transition-colors ${
          isActive ? 'text-white font-semibold' : 'text-gray-300'
        }`}
      >
        {label}
      </Link>
    </li>
  )
}

export default function Navigation() {
  return (
    <nav className="bg-gray-800 text-white p-4 sticky top-0 z-50 shadow-lg border-b border-gray-700">
      <div className="container mx-auto flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex items-center gap-6">
          <Link href="/home" className="text-xl font-bold text-white hover:text-gray-300 transition-colors">
            Idle Game
          </Link>
          <ul className="flex flex-wrap gap-4 lg:gap-6">
            <NavLink href="/home" label="Home" />
            <NavLink href="/equipment" label="Equipment" />
            <NavLink href="/map" label="Map" />
            <NavLink href="/numbers" label="Numbers" />
            <NavLink href="/asset-packs" label="Assets" />
          </ul>
        </div>
        <NavInventory />
      </div>
    </nav>
  )
}
