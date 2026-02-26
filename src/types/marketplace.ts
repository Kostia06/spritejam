export type LicenseType = 'personal' | 'commercial' | 'cc0';

export interface Listing {
  id: string;
  userId: string;
  projectId: string;
  title: string;
  description: string | null;
  priceCents: number;
  license: LicenseType;
  downloads: number;
  ratingSum: number;
  ratingCount: number;
  isActive: boolean;
  thumbnailUrl: string | null;
  createdAt: string;
}

export interface ListingWithUser extends Listing {
  userName: string;
  userAvatarUrl: string | null;
}
