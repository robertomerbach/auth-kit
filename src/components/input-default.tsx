import { Input } from "@/components/ui/input"
import { FormControl } from "./ui/form"
import { FormLabel } from "./ui/form"
import { FormMessage } from "./ui/form"
import { FormItem } from "./ui/form"
import { cn } from "@/lib/utils"

interface InputDefaultProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  id: string
  label: string
}

export function InputDefault({ id, label, className, ...props }: InputDefaultProps) {
  return (
    <FormItem className="gap-1">
      <FormLabel htmlFor={id} className="mb-1.5">{label}</FormLabel>
      <FormControl>
        <Input
          id={id}
          className={cn("pt-2 pb-3 px-6 h-12 rounded-full", className)}
          {...props}
        />
      </FormControl>
      <span className="text-xs min-h-4 text-muted-foreground">
        <FormMessage className="leading-none" />
      </span>
    </FormItem>
  )
}
