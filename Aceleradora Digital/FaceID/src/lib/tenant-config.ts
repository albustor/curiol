export const TENANT_CONFIG = {
  DEFAULT: {
    brandName: "FaceIDcr",
    primaryColor: "#3b82f6",
    logo: "/logo.png",
    templates: ["minimal", "event-dark", "premium-gold"]
  }
}

export type TenantConfig = {
  brandName: string;
  primaryColor: string;
  logo: string;
}

export type AdSlot = {
  id: string;
  merchant: string;
  imageUrl: string;
  link: string;
}
