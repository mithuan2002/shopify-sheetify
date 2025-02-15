
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const store = await prisma.store.create({
    data: {
      name: "My Demo Store",
      template: "minimal",
      whatsapp: "+1234567890",
      products: {
        create: [
          {
            name: "Sample Product 1",
            price: 99.99,
            description: "This is a sample product description",
            image: "/placeholder.svg"
          },
          {
            name: "Sample Product 2",
            price: 149.99,
            description: "Another sample product description",
            image: "/placeholder.svg"
          }
        ]
      }
    }
  })
  console.log({ store })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
