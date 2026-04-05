export type ButtonVariant = 'primary' | 'secondary' | 'outline'

const variantBase =
  'inline-flex cursor-pointer items-center justify-center font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-50'

const buttonLayout = 'box-border h-12 min-w-[115px] px-5 typo-caption leading-6'

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'rounded-lg bg-(--color-palette-primary) text-(--color-palette-white) hover:opacity-95',
  secondary:
    'rounded-lg bg-(--color-palette-light-gray) text-(--color-text-secondary) hover:opacity-95',
  outline:
    'rounded-lg border border-solid border-(--color-text-subtitle) bg-transparent text-(--color-text-subtitle) hover:bg-(--color-palette-light-gray)/50',
}

export function buttonClassName(variant: ButtonVariant = 'primary', className?: string): string {
  return [variantBase, variantStyles[variant], buttonLayout, className].filter(Boolean).join(' ')
}
