'use client'
// import { useState } from 'react'
import { Copy, Facebook, Instagram, Plus, Share2 } from 'lucide-react' // ChevronRight
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card' // CardHeader
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { ItemProps } from '@/app/products/page'

// Updated placeholder product data
// const initialProducts = [
//   {
//     id: 1,
//     name: 'Product A',
//     description: 'This is a description for Product A',
//     price: 19.99,
//     stock: 50,
//     image: '/placeholder.svg?height=200&width=200',
//     createdAt: '01/06/2023', // June 1, 2023
//   },
//   {
//     id: 2,
//     name: 'Product B',
//     description: 'This is a description for Product B',
//     price: 29.99,
//     stock: 30,
//     image: '/placeholder.svg?height=200&width=200',
//     createdAt: '01/06/2023', // July 15, 2023
//   },
//   {
//     id: 3,
//     name: 'Product C',
//     description: 'This is a description for Product C',
//     price: 39.99,
//     stock: 20,
//     image: '/placeholder.svg?height=200&width=200',
//     createdAt: '01/06/2023', // August 30, 2023
//   },
// ]

export default function ProductList({ products }: { products: ItemProps[] }) {
  // const [products] = useState(initialProducts)

  const handleCreateProduct = () => {
    // In a real app, this would open a form or navigate to a create product page
    console.log('Create new product')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getDaysAgo = (_date: string) => {
    return '1 day ago'
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleShare = (platform: string, product: any) => {
    // In a real app, this would implement the actual sharing functionality
    console.log(`Sharing ${product.name} on ${platform}`)
  }

  return (
    <div className="bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-center mb-6">Emprestimos</h1>

        <ScrollArea className="h-[calc(100vh-233px)]">
          {products.map((product) => (
            <Card key={product.id} className="mb-4">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
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
                          Created on: {product.created_at}
                        </p>
                        <Badge variant="secondary">
                          {getDaysAgo(product.created_at)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-base font-bold">
                          Voce emprestou a 5 dias
                        </div>
                      </div>
                      <div className="flex gap-2">
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
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Create New Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <Label htmlFor="image">Product Image</Label>
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
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="max-w-[200px]"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
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
                <Label htmlFor="isPublic">Show product to the public</Label>
              </div>
              <Button type="submit">Create Product</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
