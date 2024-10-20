'use client'

import { ChangeEvent, startTransition, useRef, useState } from 'react'
import {
  Copy,
  Facebook,
  // Instagram,
  Plus,
  Share2,
  Upload,
  Inbox,
  ImagePlus,
  Check,
  ArrowRight,
} from 'lucide-react' // ChevronRight
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card' // CardHeader
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import { ItemProps } from '@/app/products/page'
import { convertBlobUrlToFile } from '@/utils'

import { uploadImage } from '@/lib/supabase/storage/client'
import { createSupabaseClient } from '@/lib/supabase/client'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

function TransactionInfo({
  seller,
  buyer,
}: {
  seller: { avatar: string; name: string }
  buyer: { avatar: string; name: string }
}) {
  return (
    <div className="flex items-center">
      <div className="flex items-center">
        <Avatar className="h-8 w-8 border">
          <AvatarImage src={seller.avatar} alt={seller.name} />
          <AvatarFallback className="bg-blue-500">
            {seller.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="ml-2 text-sm font-medium">{seller.name}</span>
      </div>
      <ArrowRight className="mx-2" />
      <div className="flex items-center">
        <span className="mr-2 text-sm font-medium">{buyer.name}</span>
        <Avatar className="h-8 w-8 border">
          <AvatarImage src={buyer.avatar} alt={buyer.name} />
          <AvatarFallback className="bg-primary">
            {buyer.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}

export function ProductListComponent({ products }: { products: ItemProps[] }) {
  const supabase = createSupabaseClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    image: null as null | string,
    isPublic: true,
  })
  const [step, setStep] = useState(1)
  const [sharedLink, setSharedLink] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      const { name, description, image, isPublic } = newProduct
      if (!name || !description || !image || !isPublic) return

      const imageFile = await convertBlobUrlToFile(image)

      const { data, error } = await uploadImage({
        file: imageFile,
        bucket: 'Items Emprestados',
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
        })
        .select()
        .single()
      setSharedLink(`${window.origin}/confirmar-emprestimo?token=${item.id}`)
      setStep((prev) => prev + 1)
      console.log('item', item)
      console.log('errorItem', errorItem)
    })
  }

  const handleAddImageClick = () => {
    if (!fileInputRef.current) return
    fileInputRef.current.click()
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    const newImageFile = e.target.files[0]
    const newImageObjectURL = URL.createObjectURL(newImageFile)
    setNewProduct((prev) => ({ ...prev, image: newImageObjectURL }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const shareToSocialMedia = (platform: string) => {
    const url = sharedLink
    let shareUrl = ''

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(newProduct.name)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(newProduct.name)}`
        break
    }

    window.open(shareUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-center mb-6">Emprestimos</h1>

        <ScrollArea className="h-[calc(100vh-233px)] border rounded-lg relative">
          {products.map((product) => (
            <Card key={product.id} className="mb-4">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 relative">
                  <div className="flex-shrink-0 flex items-center justify-center">
                    <Image
                      src={product.imageUrl ?? ''}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      <CardTitle className="text-xl font-medium mb-2">
                        {product.name}
                      </CardTitle>

                      <p className="text-sm text-muted-foreground mb-4">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-2 mb-4">
                        <p className="text-sm text-muted-foreground">
                          {product.is_my
                            ? 'Emprestou no dia: '
                            : 'Pegou emprestado no dia: '}
                          {format(new Date(product.created_at), 'dd/MM/yyyy')}
                        </p>
                        {product.is_public ? (
                          <Badge
                            variant="default"
                            className="bg-blue-500 hover:bg-blue-500"
                          >
                            Public
                          </Badge>
                        ) : (
                          <Badge variant="outline">Private</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <p className="text-sm font-bold">
                          {product.is_my
                            ? 'Você emprestou para ciclano '
                            : 'Você pegou emprestado de ciclano'}
                          {formatDistanceToNow(new Date(product.created_at), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </p>
                        <TransactionInfo
                          seller={{
                            name: 'Eva Brown',
                            avatar: '/placeholder.svg?height=40&width=40',
                          }}
                          buyer={{
                            name: 'Michael Davis',
                            avatar: '/placeholder.svg?height=40&width=40',
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-end mt-8 flex-wrap-reverse gap-3">
                      <div>
                        <Button>Marcar como entregue</Button>
                      </div>
                      <div>
                        <Button variant="outline">
                          <Share2 className="h-4 w-4" />
                          <span className="hidden min-[440px]:block">
                            Compartilhar
                          </span>
                        </Button>
                      </div>
                      {/* <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="w-8 h-8 p-0"
                          onClick={() => handleShare('WhatsApp', product)}
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy the link</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="w-8 h-8 p-0"
                          onClick={() => handleShare('WhatsApp', product)}
                        >
                          <Share2 className="h-4 w-4" />
                          <span className="sr-only">Share on WhatsApp</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="w-8 h-8 p-0"
                          onClick={() => handleShare('Instagram', product)}
                        >
                          <Instagram className="h-4 w-4" />
                          <span className="sr-only">Share on Instagram</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          className="w-8 h-8 p-0"
                          onClick={() => handleShare('Facebook', product)}
                        >
                          <Facebook className="h-4 w-4" />
                          <span className="sr-only">Share on Facebook</span>
                        </Button>
                      </div> */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {products.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center gap-2">
              <Inbox size={28} />
              <p className="text-2xl text-gray-400 font-light">
                Caixa de emprestimos vazia
              </p>
            </div>
          ) : null}
        </ScrollArea>

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
                  <DialogTitle>Dados do emprestimo</DialogTitle>
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
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <div
                        onClick={handleAddImageClick}
                        className="w-full h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col gap-2 items-center justify-center text-gray-400"
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
                      placeholder="Ex: Pote"
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
                      placeholder="Ex: Presente de fulano"
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
                      Aceito eternizar o produto em um mural, caso o item não
                      seja devolvido
                    </Label>
                  </div>
                  <div className="w-full flex justify-end">
                    <Button className="ml-auto" type="submit">
                      Create Product
                    </Button>
                  </div>
                </form>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <DialogHeader>
                  <DialogTitle>Share Product</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
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
                  <div className="flex justify-center space-x-4">
                    <Button
                      onClick={() => shareToSocialMedia('facebook')}
                      variant="outline"
                    >
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </Button>
                    <Button
                      onClick={() => shareToSocialMedia('twitter')}
                      variant="outline"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Twitter
                    </Button>
                    <Button
                      onClick={() => shareToSocialMedia('linkedin')}
                      variant="outline"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Button>
                  </div>
                </div>
              </>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
