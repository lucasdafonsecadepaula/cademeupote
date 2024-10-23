'use client'

import {
  Copy,
  Plus,
  Upload,
  ImagePlus,
  Check,
  LoaderPinwheel,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import whatsappIcon from '@/assets/svgs/whatsapp.svg'

import { ChangeEvent, useRef, useState, useTransition } from 'react'
import { convertBlobUrlToFile } from '@/utils'
import { uploadImage } from '@/lib/supabase/storage/client'
import { createSupabaseClient } from '@/lib/supabase/client'
import { BUCKET_NAME } from '@/config'

export function ToLoanButton() {
  const supabase = createSupabaseClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState(1)
  const [copied, setIsCopied] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    image: null as null | string,
    isPublic: true,
  })
  const [sharedLink, setSharedLink] = useState('')
  const [isPending, startTransition] = useTransition()

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const { name, description, image, isPublic } = newProduct
      if (!name || !description || !image) return
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const imageFile = await convertBlobUrlToFile(image)

      const { data, error } = await uploadImage({
        file: imageFile,
        bucket: BUCKET_NAME,
      })

      if (error || data === undefined) {
        console.error(error)
        return
      }

      const { data: item, error: errorItem } = await supabase
        .from('borrowed_items')
        .insert({
          name,
          description,
          is_public: isPublic,
          image_name: data.path,
          lender_name: user.user_metadata?.name ?? '',
          lender_image_url: user.user_metadata?.avatar_url ?? '',
        })
        .select()
        .single()
      setSharedLink(`${window.origin}/confirmar-emprestimo?token=${item.id}`)
      setStep((prev) => prev + 1)
      console.error(errorItem)
    })
  }

  function handleAddImageClick() {
    if (!fileInputRef.current) return
    fileInputRef.current.click()
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.[0]) return
    const newImageFile = e.target.files[0]
    const newImageObjectURL = URL.createObjectURL(newImageFile)
    setNewProduct((prev) => ({ ...prev, image: newImageObjectURL }))
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  function handleShareWithWhatsapp() {
    const messageText = encodeURIComponent(`${sharedLink}`)
    const shareUrl = `https://wa.me/?text=${messageText}`
    window.open(shareUrl, '_blank')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Emprestar
        </Button>
      </DialogTrigger>
      <DialogContent>
        {step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle>Dados do Empréstimo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <Label htmlFor="image">Foto</Label>
                <div className="mt-1 flex items-center space-x-4">
                  {newProduct.image ? (
                    <Image
                      src={newProduct.image}
                      alt="Preview"
                      width={100}
                      height={100}
                      className="rounded-md"
                    />
                  ) : (
                    <div
                      onClick={handleAddImageClick}
                      className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center"
                    >
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <Input
                    ref={fileInputRef}
                    id="image"
                    type="file"
                    multiple={false}
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div
                    onClick={handleAddImageClick}
                    className="w-full h-24 text-sm sm:text-base p-4 border-2 border-dashed border-gray-300 rounded-md flex sm:flex-col gap-2 items-center justify-center text-gray-400"
                  >
                    <ImagePlus className="w-8 h-8 text-gray-400" />
                    Clique aqui para adicionar uma foto
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Ex: Pote, panela ou livro..."
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Coloque uma descrição do item e o nome da pessoa que você vai emprestar."
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPublic"
                  checked={newProduct.isPublic}
                  onCheckedChange={(checked) =>
                    setNewProduct({
                      ...newProduct,
                      isPublic: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="isPublic">
                  Aceito eternizar o produto em um mural, caso o item não seja
                  devolvido
                </Label>
              </div>
              <div className="w-full flex justify-end">
                <Button className="ml-auto" type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <LoaderPinwheel className="animate-spin" />
                      Criando empréstimo
                    </>
                  ) : (
                    'Criar empréstimo'
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <DialogHeader className="text-left">
              <DialogTitle>
                Compartilhe o link para quem pegou emprestado
              </DialogTitle>
              <DialogDescription>
                Último passo, compartilhe o link abaixo apenas com a pessoa que
                pegou emprestado.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 w-full">
                <Input value={sharedLink} readOnly />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => copyToClipboard(sharedLink)}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="sr-only">Copy link</span>
                </Button>
              </div>
              <div className="flex flex-wrap sm:justify-center gap-2 sm:gap-4">
                <Button onClick={handleShareWithWhatsapp} variant="outline">
                  <Image
                    src={whatsappIcon}
                    alt="whatsapp icon"
                    height={16}
                    width={16}
                  />
                  Compartilhe com Whatsapp
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
