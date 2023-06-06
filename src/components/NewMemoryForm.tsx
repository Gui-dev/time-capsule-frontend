'use client'

import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Camera } from 'lucide-react'
import Cookie from 'js-cookie'

import { MediaPicker } from './MediaPicker'
import { api } from '@/lib/api'

export const NewMemoryForm = () => {
  const router = useRouter()
  const handleCreateMemory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    let coverUrl = ''
    const token = Cookie.get('token')
    const formData = new FormData(event.currentTarget)
    const fileToUpload = formData.get('media')

    if (fileToUpload) {
      const uploadFormData = new FormData()
      uploadFormData.set('file', fileToUpload)
      const uploadResponse = await api.post('/upload', uploadFormData)

      coverUrl = uploadResponse.data.fileUrl
    }

    await api.post(
      '/memories',
      {
        content: formData.get('content'),
        coverUrl,
        isPublic: formData.get('isPublic'),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    router.push('/')
  }

  return (
    <form onSubmit={handleCreateMemory} className="flex flex-1 flex-col gap-2">
      <div className="flex items-center gap-4">
        <label
          htmlFor="media"
          className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <Camera className="h-4 w-4" />
          Anexar média
        </label>
        <label
          htmlFor="isPulic"
          className="flex items-center gap-1.5 text-sm text-gray-200 hover:text-gray-100"
        >
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500"
          />{' '}
          Tornar memória pública
        </label>
      </div>
      <MediaPicker />
      <textarea
        name="content"
        className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        placeholder="Fique livre para adicionar fotos, videos e relatos sobre essa experiência que você quer lembrar para sempre"
      ></textarea>

      <button
        type="submit"
        className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
      >
        Salvar
      </button>
    </form>
  )
}
