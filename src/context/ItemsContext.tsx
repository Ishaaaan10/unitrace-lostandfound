'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Item, Claim, AppNotification, ItemStatus } from '../lib/types';
import {
  getStoredItems,
  saveStoredItems,
  getStoredClaims,
  saveStoredClaims,
  getStoredNotifications,
  saveStoredNotifications,
  resetDemoDatabase,
} from '../lib/storage';
import { findMatchesForItem } from '../lib/matchEngine';
import { useAuth } from './AuthContext';

interface ItemsContextType {
  items: Item[];
  claims: Claim[];
  notifications: AppNotification[];
  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>) => Item;
  updateItemStatus: (id: string, status: ItemStatus, lockerNumber?: string) => void;
  submitClaim: (
    itemId: string,
    proofDescription: string,
    verificationAnswerAttempt: string
  ) => Claim | null;
  resolveClaim: (
    claimId: string,
    status: 'APPROVED' | 'REJECTED',
    remarks?: string
  ) => void;
  verifyHandoverOtp: (
    otp: string,
    officerRemarks?: string
  ) => { success: boolean; message: string; claim?: Claim; item?: Item };
  markNotificationRead: (id: string) => void;
  getItemById: (id: string) => Item | undefined;
  getClaimsForItem: (itemId: string) => Claim[];
  getUserClaims: (emailOrRoll: string) => Claim[];
  getUserReportedItems: (emailOrRoll: string) => Item[];
  resetData: () => void;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export function ItemsProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setItems(getStoredItems());
    setClaims(getStoredClaims());
    setNotifications(getStoredNotifications());
    setIsInitialized(true);
  }, []);

  const persistItems = (newItems: Item[]) => {
    setItems(newItems);
    saveStoredItems(newItems);
  };

  const persistClaims = (newClaims: Claim[]) => {
    setClaims(newClaims);
    saveStoredClaims(newClaims);
  };

  const persistNotifications = (newNotifs: AppNotification[]) => {
    setNotifications(newNotifs);
    saveStoredNotifications(newNotifs);
  };

  const addItem = (itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'timeline'>): Item => {
    const now = new Date();
    const isoString = now.toISOString();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newItemId = `item-${Date.now().toString().slice(-5)}`;
    const newItem: Item = {
      ...itemData,
      id: newItemId,
      createdAt: isoString,
      updatedAt: isoString,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          date: formattedDate,
          title: itemData.type === 'LOST' ? 'Lost Item Reported' : 'Found Item Reported',
          description: `${itemData.title} was recorded by ${itemData.reporterName}.`,
          actor: itemData.reporterName,
        },
      ],
    };

    const updatedItems = [newItem, ...items];
    persistItems(updatedItems);

    // Check for intelligent match suggestions
    const matches = findMatchesForItem(newItem, updatedItems);
    if (matches.length > 0 && matches[0].confidenceScore >= 60) {
      const bestMatch = matches[0];
      const otherItem = newItem.type === 'LOST' ? bestMatch.foundItem : bestMatch.lostItem;
      const newNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        userId: currentUser.id,
        title: `Possible Match Detected! (${bestMatch.confidenceScore}%)`,
        message: `Your reported ${newItem.type.toLowerCase()} item "${newItem.title}" strongly matches "${otherItem.title}" reported in ${otherItem.location}.`,
        type: 'MATCH_FOUND',
        timestamp: isoString,
        read: false,
        link: `/items/${otherItem.id}`,
      };
      persistNotifications([newNotif, ...notifications]);
    }

    return newItem;
  };

  const updateItemStatus = (id: string, status: ItemStatus, lockerNumber?: string) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status,
          ...(lockerNumber ? { lockerNumber } : {}),
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    });
    persistItems(updated);
  };

  const submitClaim = (
    itemId: string,
    proofDescription: string,
    verificationAnswerAttempt: string
  ): Claim | null => {
    const targetItem = items.find((i) => i.id === itemId);
    if (!targetItem) return null;

    // Generate 6 digit secure OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const newClaim: Claim = {
      id: `clm-${Date.now().toString().slice(-4)}`,
      itemId: targetItem.id,
      itemTitle: targetItem.title,
      itemType: targetItem.type,
      claimantName: currentUser.name,
      claimantRollNo: currentUser.rollNo,
      claimantEmail: currentUser.email,
      claimantPhone: currentUser.phone,
      claimantDepartment: currentUser.department,
      claimantProofDescription: proofDescription,
      verificationAnswerAttempt,
      status: 'PENDING_REVIEW',
      otp: generatedOtp,
      createdAt: new Date().toISOString(),
    };

    const updatedClaims = [newClaim, ...claims];
    persistClaims(updatedClaims);

    // Update item status and timeline
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const updatedItems = items.map((i) => {
      if (i.id === itemId) {
        return {
          ...i,
          status: 'CLAIM_PENDING' as ItemStatus,
          timeline: [
            ...i.timeline,
            {
              id: `tl-${Date.now()}`,
              date: formattedDate,
              title: 'Claim Submitted for Review',
              description: `Claim submitted by ${currentUser.name} (${currentUser.rollNo}). Under security verification.`,
              actor: currentUser.name,
            },
          ],
        };
      }
      return i;
    });
    persistItems(updatedItems);

    // Notify Security Desk
    const securityNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: 'usr-security-officer',
      title: 'New Ownership Claim Submitted',
      message: `${currentUser.name} has submitted a claim on "${targetItem.title}". Review verification proof.`,
      type: 'CLAIM_UPDATE',
      timestamp: new Date().toISOString(),
      read: false,
      link: '/security-desk',
    };
    persistNotifications([securityNotif, ...notifications]);

    return newClaim;
  };

  const resolveClaim = (
    claimId: string,
    status: 'APPROVED' | 'REJECTED',
    remarks?: string
  ) => {
    const claim = claims.find((c) => c.id === claimId);
    if (!claim) return;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const updatedClaims = claims.map((c) => {
      if (c.id === claimId) {
        return {
          ...c,
          status,
          securityOfficerRemarks: remarks || (status === 'APPROVED' ? 'Proof verified by Security Desk' : 'Verification failed'),
          resolvedAt: now.toISOString(),
        };
      }
      return c;
    });
    persistClaims(updatedClaims);

    // If approved, update item status to VERIFIED
    if (status === 'APPROVED') {
      const updatedItems = items.map((i) => {
        if (i.id === claim.itemId) {
          return {
            ...i,
            status: 'VERIFIED' as ItemStatus,
            timeline: [
              ...i.timeline,
              {
                id: `tl-${Date.now()}`,
                date: formattedDate,
                title: 'Claim Approved by Campus Security',
                description: `Officer Rajesh Kumar approved claim. Digital Claim Pass with OTP issued to ${claim.claimantName}.`,
                actor: 'Campus Security',
              },
            ],
          };
        }
        return i;
      });
      persistItems(updatedItems);
    }

    // Notify claimant
    const claimantNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: claim.claimantRollNo,
      title: status === 'APPROVED' ? 'Claim Approved! Claim Pass Ready' : 'Claim Verification Declined',
      message:
        status === 'APPROVED'
          ? `Your claim for "${claim.itemTitle}" is approved! Show your digital Claim Pass and OTP (${claim.otp}) at Security Gate 1 for handover.`
          : `Your claim for "${claim.itemTitle}" was not approved. Security remarks: ${remarks || 'Details did not match'}.`,
      type: 'CLAIM_UPDATE',
      timestamp: now.toISOString(),
      read: false,
      link: '/dashboard',
    };
    persistNotifications([claimantNotif, ...notifications]);
  };

  const verifyHandoverOtp = (
    otp: string,
    officerRemarks?: string
  ): { success: boolean; message: string; claim?: Claim; item?: Item } => {
    const cleanOtp = otp.trim();
    const matchingClaim = claims.find(
      (c) => c.otp === cleanOtp && (c.status === 'APPROVED' || c.status === 'PENDING_REVIEW')
    );

    if (!matchingClaim) {
      return { success: false, message: 'Invalid or expired OTP. Please check the code in your Claim Pass.' };
    }

    const targetItem = items.find((i) => i.id === matchingClaim.itemId);
    if (!targetItem) {
      return { success: false, message: 'Target item not found in system records.' };
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Mark claim completed
    const updatedClaims = claims.map((c) => {
      if (c.id === matchingClaim.id) {
        return {
          ...c,
          status: 'HANDOVER_COMPLETED' as const,
          securityOfficerRemarks: officerRemarks || 'Physical identity verified and item handed over at Security Desk.',
          resolvedAt: now.toISOString(),
        };
      }
      return c;
    });
    persistClaims(updatedClaims);

    // Mark item returned
    const updatedItems = items.map((i) => {
      if (i.id === targetItem.id) {
        return {
          ...i,
          status: 'RETURNED' as ItemStatus,
          timeline: [
            ...i.timeline,
            {
              id: `tl-${Date.now()}`,
              date: formattedDate,
              title: 'Item Handed Over & Case Closed',
              description: `Physical custody verified and handed to ${matchingClaim.claimantName} (${matchingClaim.claimantRollNo}) via OTP #${cleanOtp}.`,
              actor: 'Officer Rajesh Kumar (Campus Security)',
            },
          ],
        };
      }
      return i;
    });
    persistItems(updatedItems);

    // Send final notification
    const finalNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: matchingClaim.claimantRollNo,
      title: 'Item Successfully Recovered! 🎉',
      message: `Your item "${targetItem.title}" has been handed over. Thank you for using UniTrace!`,
      type: 'ITEM_HANDED_OVER',
      timestamp: now.toISOString(),
      read: false,
      link: '/dashboard',
    };
    persistNotifications([finalNotif, ...notifications]);

    return {
      success: true,
      message: `Handover verified successfully! Item "${targetItem.title}" delivered to ${matchingClaim.claimantName}.`,
      claim: matchingClaim,
      item: targetItem,
    };
  };

  const markNotificationRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    persistNotifications(updated);
  };

  const getItemById = (id: string) => items.find((i) => i.id === id);

  const getClaimsForItem = (itemId: string) => claims.filter((c) => c.itemId === itemId);

  const getUserClaims = (emailOrRoll: string) =>
    claims.filter(
      (c) =>
        c.claimantEmail.toLowerCase() === emailOrRoll.toLowerCase() ||
        c.claimantRollNo.toLowerCase() === emailOrRoll.toLowerCase()
    );

  const getUserReportedItems = (emailOrRoll: string) =>
    items.filter(
      (i) =>
        i.reporterEmail.toLowerCase() === emailOrRoll.toLowerCase() ||
        i.reporterRollNo.toLowerCase() === emailOrRoll.toLowerCase()
    );

  const resetData = () => {
    resetDemoDatabase();
    setItems(getStoredItems());
    setClaims(getStoredClaims());
    setNotifications(getStoredNotifications());
  };

  return (
    <ItemsContext.Provider
      value={{
        items,
        claims,
        notifications,
        addItem,
        updateItemStatus,
        submitClaim,
        resolveClaim,
        verifyHandoverOtp,
        markNotificationRead,
        getItemById,
        getClaimsForItem,
        getUserClaims,
        getUserReportedItems,
        resetData,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems() {
  const context = useContext(ItemsContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
}
