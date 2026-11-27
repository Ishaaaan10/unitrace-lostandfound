import { NextResponse } from 'next/server';
import { INITIAL_CLAIMS } from '../../../lib/mockData';
import { Claim } from '../../../lib/types';

let serverClaims: Claim[] = [...INITIAL_CLAIMS];

export async function GET() {
  return NextResponse.json({
    success: true,
    count: serverClaims.length,
    data: serverClaims,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const newClaim: Claim = {
      ...body,
      id: `clm-${Date.now().toString().slice(-4)}`,
      otp: generatedOtp,
      status: 'PENDING_REVIEW',
      createdAt: new Date().toISOString(),
    };

    serverClaims = [newClaim, ...serverClaims];

    return NextResponse.json(
      {
        success: true,
        message: 'Ownership claim recorded. Pending Security verification.',
        data: newClaim,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Invalid claim data payload' },
      { status: 400 }
    );
  }
}
