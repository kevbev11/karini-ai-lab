import dbConnect from '@/lib/dbConnect';
import CartItem from '@/models/CartItem';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  await dbConnect();
  const items = await CartItem.find();
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json() as { title: string; sku: string; price: string; image: string };
  const newItem = new CartItem(body);
  await newItem.save();
  return NextResponse.json(newItem);
}

export async function DELETE(req: NextRequest) {
  await dbConnect();
  const body = await req.json() as { id: string };
  await CartItem.findByIdAndDelete(body.id);
  return NextResponse.json({ message: 'Deleted' });
}
