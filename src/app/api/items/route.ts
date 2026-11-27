import { NextResponse } from 'next/server';
import { INITIAL_ITEMS } from '../../../lib/mockData';
import { Item } from '../../../lib/types';

// In-memory runtime cache for serverless invocation
let serverItems: Item[] = [...INITIAL_ITEMS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  let results = [...serverItems];

  if (type && type !== 'ALL') {
    results = results.filter((item) => item.type === type);
  }

  if (category && category !== 'ALL') {
    results = results.filter((item) => item.category === category);
  }

  if (search) {
    const query = search.toLowerCase();
    results = results.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    success: true,
    count: results.length,
    data: results,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const now = new Date();
    const isoString = now.toISOString();

    const newItem: Item = {
      ...body,
      id: `item-${Date.now().toString().slice(-5)}`,
      createdAt: isoString,
      updatedAt: isoString,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          date: now.toLocaleString(),
          title: body.type === 'LOST' ? 'Lost Item Registered' : 'Found Item Registered',
          description: `${body.title} was filed in UniTrace registry.`,
          actor: body.reporterName || 'Student',
        },
      ],
    };

    serverItems = [newItem, ...serverItems];

    return NextResponse.json(
      {
        success: true,
        message: 'Article registered successfully',
        data: newItem,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid request payload' },
      { status: 400 }
    );
  }
}
