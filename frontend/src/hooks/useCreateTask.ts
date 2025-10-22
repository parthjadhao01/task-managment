import React from 'react'
import { useQueryState, parseAsBoolean } from "nuqs";

export default function useCreateTask() {
  const [isOpen,setIsOpen] = useQueryState(
    "create-task",
    parseAsBoolean.withDefault(false).withOptions({clearOnDefault : true})
  )

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return {
    isOpen,
    open,
    close,
    setIsOpen
  }
}
