export type ItemType = 'LOST' | 'FOUND';

export type ItemCategory = 
  | 'ELECTRONICS' 
  | 'WALLETS_IDS' 
  | 'KEYS_CARDS' 
  | 'BOOKS_STATIONERY' 
  | 'BAGS_BACKPACKS' 
  | 'CLOTHING' 
  | 'ACCESSORIES' 
  | 'OTHER';

export type ItemStatus = 'OPEN' | 'CLAIM_PENDING' | 'VERIFIED' | 'RETURNED';

export type CustodyLocation = 'WITH_FINDER' | 'CAMPUS_SECURITY_DESK' | 'DEPT_OFFICE';

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  actor: string;
}

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  category: ItemCategory;
  description: string;
  location: string;
  campusZoneId: string;
  date: string;
  time?: string;
  imageUrl: string;
  status: ItemStatus;
  reward?: string;
  secretVerificationQuestion?: string;
  secretVerificationAnswer?: string;
  reporterName: string;
  reporterRollNo: string;
  reporterEmail: string;
  reporterPhone: string;
  reporterRole?: 'STUDENT' | 'STAFF' | 'CAMPUS_SECURITY';
  currentCustody: CustodyLocation;
  lockerNumber?: string;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
}

export interface Claim {
  id: string;
  itemId: string;
  itemTitle: string;
  itemType: ItemType;
  claimantName: string;
  claimantRollNo: string;
  claimantEmail: string;
  claimantPhone: string;
  claimantDepartment: string;
  claimantProofDescription: string;
  verificationAnswerAttempt: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'HANDOVER_COMPLETED';
  securityOfficerRemarks?: string;
  otp: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface User {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  department: string;
  role: 'STUDENT' | 'CAMPUS_SECURITY' | 'ADMIN';
  avatar: string;
  phone: string;
  dormsOrHostel?: string;
}

export interface CampusZone {
  id: string;
  name: string;
  code: string;
  building: string;
  description: string;
  xPercent: number; // for campus map visualization
  yPercent: number;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'MATCH_FOUND' | 'CLAIM_UPDATE' | 'ITEM_HANDED_OVER' | 'SECURITY_ALERT';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface MatchRecommendation {
  lostItem: Item;
  foundItem: Item;
  confidenceScore: number;
  matchReasons: string[];
}
