import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CARD_PROVIDERS } from '@/features/cart/config/checkout.config'
import type { CardProvider } from '@/features/cart/types/checkout.types'

interface CardProviderSelectorProps {
  value: CardProvider
  onValueChange: (v: CardProvider) => void
  uid: string
}

export function CardProviderSelector({ value, onValueChange, uid }: CardProviderSelectorProps) {
  return (
    <div className="ml-4 flex flex-col gap-3 border-l pl-4">
      <p className="text-sm font-medium">Selecciona la pasarela</p>
      <RadioGroup value={value} onValueChange={(v) => onValueChange(v as CardProvider)} className="gap-2">
        {CARD_PROVIDERS.map((provider) => {
          const id = `${uid}-card-${provider.value}`
          return (
            <Label key={provider.value} htmlFor={id} className="group block cursor-pointer">
              <div className="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/5 relative flex w-full items-center gap-3 rounded-lg border px-4 py-3 transition-all">
                <RadioGroupItem
                  value={provider.value}
                  id={id}
                  className="peer size-4 shrink-0 after:absolute after:inset-0 [&_svg]:size-3"
                />
                <span className="text-sm font-medium">{provider.label}</span>
              </div>
            </Label>
          )
        })}
      </RadioGroup>
    </div>
  )
}
