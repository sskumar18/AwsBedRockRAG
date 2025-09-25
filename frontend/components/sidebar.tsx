"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Database, Plus } from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const navigation = [
    {
      name: "Knowledge Bases",
      href: "/",
      icon: Database,
      current: pathname === "/",
    },
  ]

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 border-r border-gray-800">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-xl font-semibold text-white">Knowledge Base</h1>
      </div>
      <nav className="flex flex-1 flex-col px-4 py-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  item.current ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white",
                  "group flex gap-x-3 rounded-md p-3 text-sm font-medium leading-6 transition-colors",
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
