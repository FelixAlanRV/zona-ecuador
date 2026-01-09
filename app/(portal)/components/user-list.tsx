"use client"

import { useState, useMemo } from "react"
import { Search, Users, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { User } from "@/lib/types"
import { mockUsers } from "@/lib/mock-data"

interface UserListProps {
  selectedUser: User | null
  onSelectUser: (user: User) => void
}

export function UserList({ selectedUser, onSelectUser }: UserListProps) {
  const [search, setSearch] = useState("")

  const filteredUsers = useMemo(() => {
    if (!search) return mockUsers

    const query = search.toLowerCase()
    return mockUsers.filter(
      (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
    )
  }, [search])

  return (
    <div className="border-r border-border bg-card/30 backdrop-blur-sm flex flex-col">
      <div className="p-5 border-b border-border/50 bg-card/50">
        <div className="space-y-3">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-background/80 border-border/50 focus:border-primary/50 h-11 transition-all"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span className="font-medium">
                {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"}
              </span>
            </div>
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted/50">
              <Filter className="h-3 w-3" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="h-16 w-16 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-foreground/80 mb-1">No users found</p>
              <p className="text-xs text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => onSelectUser(user)}
                  className={cn(
                    "w-full text-left p-3.5 rounded-xl transition-all duration-200 group",
                    "hover:bg-muted/70 hover:shadow-sm hover:scale-[1.01]",
                    "border border-transparent hover:border-border/50",
                    selectedUser?.id === user.id &&
                      "bg-primary/10 border-primary/30 shadow-md shadow-primary/5 scale-[1.01]",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                        "bg-gradient-to-br from-muted to-muted/50 border border-border/50",
                        selectedUser?.id === user.id && "from-primary/20 to-primary/5 border-primary/30",
                      )}
                    >
                      <span className="text-sm font-semibold">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-balance leading-tight">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        {user.memberships.slice(0, 3).map((membership, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted/80 border border-border/30"
                          >
                            <span className="opacity-80">{membership.country}</span>
                          </span>
                        ))}
                        {user.memberships.length > 3 && (
                          <span className="text-[10px] font-medium text-muted-foreground px-1">
                            +{user.memberships.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
