import { ObjectId } from 'mongodb';

export interface PackageModel {
  _id: ObjectId;
  name: string;
  description?: string;
  type: 'free' | 'trial' | 'paid';
  price: number;
  salePrice?: number;
  roleType?: string;
  status: 'active' | 'inactive' | 'archived';
  discountType?: 'flat' | 'percent';
  discountValue?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Example usage:
export const demoPackage: PackageModel = {
  _id: new ObjectId(),
  name: 'Package One',
  description: 'Basic package with essential features',
  type: 'free',
  price: 0,
  salePrice: 0,
  roleType: 'user',
  status: 'active',
  discountType: 'percent',
  discountValue: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};
