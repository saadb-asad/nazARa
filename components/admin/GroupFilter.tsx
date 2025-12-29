'use client'

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dispatch, SetStateAction } from "react"
import { Building2 } from "lucide-react"

interface GroupFilterProps {
    groups: string[]
    selected: string
    setSelected: Dispatch<SetStateAction<string>>
}

export function GroupFilter({ groups, selected, setSelected }: GroupFilterProps) {
    if (groups.length === 0) return null

    return (
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <Building2 className="h-3 w-3" /> Location:
            </span>
            <Tabs value={selected} onValueChange={setSelected} className="w-auto">
                <TabsList className="bg-white border">
                    <TabsTrigger value="All">All Locations</TabsTrigger>
                    {groups.map(group => (
                        <TabsTrigger key={group} value={group}>
                            {group}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>
    )
}
