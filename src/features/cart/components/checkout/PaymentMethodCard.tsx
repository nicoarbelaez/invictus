import { Label } from '@/components/ui/label'
import { RadioGroupItem } from '@/components/ui/radio-group'

interface PaymentMethodCardProps {
  id: string
  value: string
  label: string
  description: string
}

export function PaymentMethodCard({ id, value, label, description }: PaymentMethodCardProps) {
  return (
    <Label htmlFor={id} className="group block cursor-pointer">
      <div className="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/5 relative flex w-full items-start gap-3 rounded-xl border p-4 shadow-xs transition-all">
        <RadioGroupItem
          value={value}
          id={id}
          className="peer mt-0.5 size-4 shrink-0 after:absolute after:inset-0 [&_svg]:size-3"
        />
        <div className="grid gap-1">
          <div className="text-sm leading-none font-medium">{label}</div>
          <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
        </div>
      </div>
    </Label>
  )
}
