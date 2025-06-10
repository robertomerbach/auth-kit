"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useFormState } from "@/hooks/use-form-state"
import { useRouter } from "next/navigation"

import { AvatarWrapper } from "@/components/avatar"
import { Upload } from "lucide-react" 
import { updateAccountSchema, type UpdateAccountSchema } from "@/lib/validations"
import { Loader } from "../loader"

interface UpdateAvatarProps {
  user: {
    name: string
    image: string
  }
}

export function UploadAvatar({ user }: UpdateAvatarProps) {
  const router = useRouter()
  const { setFormSuccess, setFormError, isLoading, startLoading, stopLoading } = useFormState()

  const form = useForm<UpdateAccountSchema>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      image: user.image || null,
    },
    mode: "onChange"
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    startLoading('uploadAvatar')
    try {
      const response = await axios.post("/api/user/upload-avatar", formData)
      form.setValue("image", response.data.url)
      setFormSuccess("Profile picture updated successfully!")
      // Refresh the page data to show the new image
      router.refresh()
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setFormError(error.response?.data?.error || "Failed to upload image")
      } else {
        setFormError("An unexpected error occurred")
      }
    } finally {
      stopLoading('uploadAvatar')
    }
  }

  return (
    <div className="relative text-[32px]">
      <AvatarWrapper
        image={form.watch("image") || user.image || undefined}
        name={user.name || "User not found"}
        size="80px"
      />
      <label htmlFor="avatar-upload" className="opacity-0 hover:opacity-100 transition-opacity absolute top-0 right-0 h-full w-full rounded-full bg-black/85 text-white flex items-center justify-center cursor-pointer">
        {
          isLoading('uploadAvatar') ? (
            <Loader size={24} />
          ) : (
            <Upload className="w-6 h-6" />
          )
        }
        <span className="sr-only">Upload image</span>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          disabled={isLoading('uploadAvatar')}
        />
      </label>
    </div>
  )
} 