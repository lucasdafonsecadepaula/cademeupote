'use client'

import {
  Copy,
  Upload,
  ImagePlus,
  Check,
  LoaderPinwheel,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import whatsappIcon from '@/assets/svgs/whatsapp.svg'
import { ChangeEvent, useRef, useState, useTransition } from 'react'
import { convertBlobUrlToFile, getUserMetadata } from '@/utils'
import { uploadImage } from '@/lib/supabase/storage/client'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { getUser, insertBorrowedItem } from '@/lib/supabase/queries'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'

export function ToLoanComponent() {
  const supabase = createSupabaseClient()
  const router = useRouter()
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
  const [hasError, setHasError] = useState(false)

  async function handleCreateProduct(e: React.FormEvent) {
    e.preventDefault()

    startTransition(async () => {
      const { name, description, image, isPublic } = newProduct
      const user = await getUser(supabase)
      if (!user) return

      const metadata = getUserMetadata(user)

      const [item, errorItem] = await insertBorrowedItem(supabase, {
        description,
        // imageName: imagePath,
        isPublic,
        lenderImageUrl: metadata.avatarUrl,
        lenderName: metadata.name,
        name,
      })

      if (errorItem) {
        console.error(errorItem)
        setHasError(true)

        setTimeout(() => {
          setHasError(false)
        }, 3000)
        return
      }

      let imagePath = ''
      if (image) {
        const imageFile = await convertBlobUrlToFile(image)
        const [storageImg, storageImgError] = await uploadImage(supabase, {
          file: imageFile,
          itemId: item.id,
          userId: user.id,
        })
        if (storageImgError) {
          await supabase.from('borrowed_items').delete().eq('id', item.id)

          setHasError(true)
          console.error(storageImgError)
          setTimeout(() => {
            setHasError(false)
          }, 3000)
          return
        }
        imagePath = storageImg?.path ?? ''

        await supabase
          .from('borrowed_items')
          .update({
            image_name: imagePath,
          })
          .eq('id', item.id)
          .single()
      }

      setSharedLink(`${window.origin}/confirmar-emprestimo?token=${item.id}`)
      setStep((prev) => prev + 1)
    })
  }

  function handleAddImageClick() {
    if (!fileInputRef.current) return
    fileInputRef.current.click()
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    if (!e.target.files?.[0]) return
    const newImageFile = e.target.files[0]
    const newImageObjectURL = URL.createObjectURL(newImageFile)
    setNewProduct((prev) => ({ ...prev, image: newImageObjectURL }))
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(sharedLink).then(() => {
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
    <div>
      {hasError ? (
        <Alert variant="destructive" className="max-w-md mx-auto mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ocorreu algum erro</AlertTitle>
          <AlertDescription>Tente novamente</AlertDescription>
        </Alert>
      ) : null}

      {step === 1 ? (
        <>
          <div>
            <h4 className="text-lg pb-8">Dados do Empréstimo</h4>
          </div>
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
            <div className="w-full flex gap-4 justify-end">
              <Button
                variant="outline"
                className=""
                disabled={isPending}
                type="button"
                onClick={() => {
                  router.prefetch('/emprestimos')
                  router.push('/emprestimos')
                }}
              >
                <ArrowLeft />
                Voltar
              </Button>
              <Button className="" type="submit" disabled={isPending}>
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
          <div className="text-left">
            <h4 className="text-lg pb-8">
              Compartilhe o link para quem pegou emprestado
            </h4>
            <p>
              Último passo, compartilhe o link abaixo apenas com a pessoa que
              pegou emprestado.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 w-full">
              <Input value={sharedLink} readOnly />
              <Button size="icon" variant="outline" onClick={copyToClipboard}>
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
              <Button
                variant="outline"
                className=""
                disabled={isPending}
                type="button"
                onClick={() => {
                  router.prefetch('/emprestimos')
                  router.push('/emprestimos')
                }}
              >
                <ArrowLeft />
                Voltar
              </Button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
