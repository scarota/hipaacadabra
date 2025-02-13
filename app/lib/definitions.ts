export type Invoice = {
  id: string;
  customerId: string;
  amount: number;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: string;
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type CustomerField = {
  id: string;
  name: string;
};

// Kinde Types
export type KindeUser = {
  email: string;
  firstName: string;
  lastName: string;
  joinedOn: string;
  roles: string[];
};
