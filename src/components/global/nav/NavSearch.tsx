import { Field } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'

import { Search } from 'lucide-react'

export function NavSearch() {
  return (
    <Field className="relative w-full max-w-md">
      <InputGroup>
        <InputGroupInput id="input-group-url" placeholder="Búsqueda" />
        <InputGroupAddon>
          <InputGroupText>
            <Search />
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
