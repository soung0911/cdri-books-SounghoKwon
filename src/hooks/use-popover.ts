import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'

export interface UsePopoverDismissOptions {
  panelRef: RefObject<HTMLElement | null>
  anchorRef: RefObject<HTMLElement | null>
  onDismiss: () => void
  enabled?: boolean
}

/** 패널·앵커 바깥 pointerdown(capture) 및 Escape 시 onDismiss */
export function usePopoverDismiss({
  panelRef,
  anchorRef,
  onDismiss,
  enabled = true,
}: UsePopoverDismissOptions) {
  useEffect(() => {
    if (!enabled) return

    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (panelRef.current?.contains(t)) return
      if (anchorRef.current?.contains(t)) return
      onDismiss()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss()
    }

    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [anchorRef, enabled, onDismiss, panelRef])
}

export interface UsePointerDownOutsideOptions {
  ref: RefObject<HTMLElement | null>
  enabled: boolean
  onOutside: () => void
}

/** enabled일 때 ref 밖 pointerdown(capture)이면 onOutside */
export function usePointerDownOutside({ ref, enabled, onOutside }: UsePointerDownOutsideOptions) {
  useEffect(() => {
    if (!enabled) return

    const onPointerDown = (e: PointerEvent) => {
      if (ref.current?.contains(e.target as Node)) return
      onOutside()
    }

    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  }, [enabled, onOutside, ref])
}

export interface UsePopoverStateResult<T extends HTMLElement> {
  open: boolean
  setOpen: (open: boolean) => void
  anchorRef: RefObject<T | null>
  toggle: () => void
  close: () => void
}

export function usePopoverState<T extends HTMLElement = HTMLDivElement>(
  initialOpen = false,
): UsePopoverStateResult<T> {
  const [open, setOpen] = useState(initialOpen)
  const anchorRef = useRef<T | null>(null)

  const toggle = useCallback(() => {
    setOpen((v) => !v)
  }, [])

  const close = useCallback(() => {
    setOpen(false)
  }, [])

  return { open, setOpen, anchorRef, toggle, close }
}
