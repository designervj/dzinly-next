import { ObjectId } from 'mongodb';

export interface Branding {
  primaryColor: string;
  secondaryColor: string;
}

export interface PaymentGateways {
  [key: string]: any;
}

export interface Features {
  websiteEnabled: boolean;
  ecommerceEnabled: boolean;
  blogEnabled: boolean;
  invoicesEnabled: boolean;
}

export interface Settings {
  locale: string;
  currency: string;
  timezone: string;
}

export interface TenantModel {
  _id: ObjectId;
  slug: string;
  name: string;
  email: string;
  customDomainVerified: boolean;
  plan: 'trial' | 'basic' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'suspended' | 'cancelled';
  branding: Branding;
  paymentGateways: PaymentGateways;
  features: Features;
  settings: Settings;
  status: 'active' | 'suspended' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}