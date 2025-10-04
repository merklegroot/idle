'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useGameStore from '@/stores/gameStore'
import { formattingUtil } from '@/utils/formattingUtil'

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
  const { bootstrap, getResource, homes } = useGameStore();

  const handleBootstrap = () => {
    bootstrap();
  };

  const gold = getResource('gold');
  const wood = getResource('wood');
  const stone = getResource('stone');
  
  const goldAmount = gold?.amount || 0;
  const woodAmount = wood?.amount || 0;
  const stoneAmount = stone?.amount || 0;
  
  // Calculate total population from all homes
  const totalPopulation = homes.reduce((sum, home) => sum + home.population, 0);

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
            <NavLink href="/town" label="Town" />
            <NavLink href="/numbers" label="Numbers" />
            <NavLink href="/icons" label="Icons" />
          </ul>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">💰</span>
              <span className="font-semibold text-yellow-400">{formattingUtil.formatNumber(goldAmount)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-green-400">🪵</span>
              <span className="font-semibold text-green-400">{formattingUtil.formatNumber(woodAmount)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-300">🪨</span>
              <span className="font-semibold text-gray-300">{formattingUtil.formatNumber(stoneAmount)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-blue-400">👥</span>
              <span className="font-semibold text-blue-400">{formattingUtil.formatNumber(totalPopulation)}</span>
            </div>
          </div>
          <button
            onClick={handleBootstrap}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
          >
            Bootstrap
          </button>
        </div>
      </div>
    </nav>
  )
}
