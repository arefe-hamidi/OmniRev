"use client"

import Skeleton from "@/Components/Shadcn/skeleton"

const SKELETON_HEADER_CELLS = 7
const SKELETON_ROWS = 6

export default function ContactsTableSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <div className="flex gap-4 border-b pb-3">
          {Array.from({ length: SKELETON_HEADER_CELLS }, (_, i) => (
            <Skeleton key={i} className="h-4 flex-1 min-w-[60px]" />
          ))}
        </div>
        {Array.from({ length: SKELETON_ROWS }, (_, row) => (
          <div key={row} className="flex gap-4 py-3">
            {Array.from({ length: SKELETON_HEADER_CELLS }, (_, i) => (
              <Skeleton
                key={i}
                className={`h-8 flex-1 min-w-[60px] ${i === 1 ? "max-w-[140px]" : ""}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
