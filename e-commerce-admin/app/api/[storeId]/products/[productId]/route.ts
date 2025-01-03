import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from "next/server";

export async function GET (
    req: Request,
    {params}: {params: { productId: string } }
) {
    try{

        if(!params.productId){
            return new NextResponse("Product ID is required", { status: 400 });
        }

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                category: true,
                size: true,
                color: true,
                images: true,
            }
        })

        return NextResponse.json(product);

    } catch(error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal Error", {status: 500});
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const { name, price, categoryId, sizeId, colorId, images, isFeatured, isArchived } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        if (!images || !images.length) {
            return new NextResponse("Images are required", { status: 400 });
        }

        if (!price) {
            return new NextResponse("Price is required", { status: 400 });
        }

        if (!categoryId) {
            return new NextResponse("Category ID is required", { status: 400 });
        }

        if (!sizeId) {
            return new NextResponse("Size ID is required", { status: 400 });
        }

        if (!colorId) {
            return new NextResponse("Color ID is required", { status: 400 });
        }

        if (!params.productId) {
            return new NextResponse("Product ID is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            },
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 404 });
        }

        // Start transaction to ensure atomicity
        const updatedProduct = await prismadb.$transaction(async (prisma) => {
            // Delete existing images
            await prisma.image.deleteMany({
                where: {
                    productId: params.productId,
                },
            });

            // Update the product without images first
            await prisma.product.update({
                where: {
                    id: params.productId,
                },
                data: {
                    name,
                    price,
                    categoryId,
                    sizeId,
                    colorId,
                    isFeatured,
                    isArchived,
                },
            });

            // Add new images
            const product = await prisma.product.update({
                where: {
                    id: params.productId,
                },
                data: {
                    images: {
                        createMany: {
                            data: images.map((image: { url: string }) => ({
                                url: image.url,
                            })),
                        },
                    },
                },
            });

            return product;
        });

        return NextResponse.json(updatedProduct);

    } catch (error) {
        console.log('[PRODUCT_PATCH]', error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


export async function DELETE (
    req: Request,
    {params}: {params: {storeId: string, productId: string} }
) {
    try{
        const { userId } = auth();

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!params.productId){
            return new NextResponse("Product ID is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId,
            }
        });

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 404});
        }

        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
            }
        })

        return NextResponse.json(product);

    } catch(error) {
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse("Internal Error", {status: 500});
    }
}


