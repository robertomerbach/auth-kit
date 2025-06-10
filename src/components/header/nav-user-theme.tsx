import { useTheme } from "next-themes"
import { Monitor, Moon, Sun } from "lucide-react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
/**
 * Theme selector component that allows switching between light, dark and system themes
 * @param {Object} props - Component props
 * @param {string} props.name - Display name for the theme selector option
 */
export function ThemeSelector({ name }: { name: string }) {
  const { theme, setTheme } = useTheme()

  const themeOptions = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ];
  
  return (
    <DropdownMenuItem asChild>
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">{name}</span>
        <RadioGroup
          className="flex items-center flex-row border rounded-full"
          value={theme}
          onValueChange={setTheme}
        >
          {themeOptions.map(({ value, icon: Icon, label }) => (
            <div key={value} className="flex items-center">
              <RadioGroupItem value={value} id={value} className="sr-only" />
              <Label
                htmlFor={value}
                className={cn(
                  "flex items-center justify-center p-1 rounded-full", 
                  theme === value ? "bg-card border" : "", 
                  "hover:bg-secondary cursor-pointer"
                )}
              >
                <Icon
                  className={cn(
                    "size-3",
                    theme === value ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span className="sr-only">{label}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </DropdownMenuItem>
  );
}