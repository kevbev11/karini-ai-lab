import dbConnect from '@/lib/dbConnect';
import CartItem from '@/models/CartItem';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    const items = await CartItem.find({});
    return NextResponse.json(items, { status: 200 });
  } catch (error: any) {
    console.error('GET /api/cart error:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(req: Request) {
    try {
      await dbConnect();
      const data = await req.json();
      const newItem = await CartItem.create(data);
      return NextResponse.json(newItem, { status: 201 });
    } catch (err: any) {
      console.error('POST /api/cart error:', err);
      return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
    }
  }

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { id } = await req.json();
    const result = await CartItem.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Deleted' });
  } catch (error: any) {
    console.error('DELETE /api/cart error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
