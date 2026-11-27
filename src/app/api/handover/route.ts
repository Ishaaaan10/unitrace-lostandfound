import { NextResponse } from 'next/server';
import { INITIAL_CLAIMS } from '../../../lib/mockData';

let serverClaims = [...INITIAL_CLAIMS];

export async function POST(request: Request) {
  try {
    const { otp, officerRemarks } = await request.json();
    const cleanOtp = (otp || '').trim();

    const claim = serverClaims.find(
      (c) => c.otp === cleanOtp && (c.status === 'APPROVED' || c.status === 'PENDING_REVIEW')
    );

    if (!claim) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired OTP code. Verify claim pass.',
        },
        { status: 404 }
      );
    }

    claim.status = 'HANDOVER_COMPLETED';
    claim.securityOfficerRemarks = officerRemarks || 'Physical identity verified and item handed over at Security Desk.';
    claim.resolvedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: `Handover authorized for ${claim.claimantName}. Restitution certificate ready.`,
      claim,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Handover processing error' },
      { status: 400 }
    );
  }
}
