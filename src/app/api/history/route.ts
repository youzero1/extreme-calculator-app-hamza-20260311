import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { CalculationHistory } from '@/entities/CalculationHistory';
import { Like } from 'typeorm';

export async function GET(request: NextRequest) {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(CalculationHistory);
    const search = request.nextUrl.searchParams.get('search') || '';

    let records: CalculationHistory[];
    if (search) {
      records = await repo.find({
        where: [
          { expression: Like(`%${search}%`) },
          { result: Like(`%${search}%`) },
        ],
        order: { createdAt: 'DESC' },
        take: 100,
      });
    } else {
      records = await repo.find({
        order: { createdAt: 'DESC' },
        take: 100,
      });
    }

    return NextResponse.json({ data: records });
  } catch (error) {
    console.error('GET /api/history error:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { expression, result } = body;

    if (!expression || result === undefined) {
      return NextResponse.json({ error: 'Expression and result are required' }, { status: 400 });
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(CalculationHistory);

    const record = repo.create({ expression, result: String(result) });
    const saved = await repo.save(record);

    return NextResponse.json({ data: saved }, { status: 201 });
  } catch (error) {
    console.error('POST /api/history error:', error);
    return NextResponse.json({ error: 'Failed to save calculation' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    const ds = await getDataSource();
    const repo = ds.getRepository(CalculationHistory);

    if (id) {
      await repo.delete({ id: parseInt(id, 10) });
      return NextResponse.json({ message: `Record ${id} deleted` });
    } else {
      await repo.clear();
      return NextResponse.json({ message: 'All history cleared' });
    }
  } catch (error) {
    console.error('DELETE /api/history error:', error);
    return NextResponse.json({ error: 'Failed to delete history' }, { status: 500 });
  }
}
