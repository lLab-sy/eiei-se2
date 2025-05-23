// src/types/omise.d.ts
declare module 'omise' {
  const omiseFactory: (config: {
    publicKey?: string;
    secretKey: string;
    omiseVersion?: string;
  }) => OmiseClient;

  interface OmiseClient {
    customers: CustomersAPI;
    tokens: TokensAPI;
    charges: ChargesAPI;
    recipients: RecipientsAPI;
    transfers: TransfersAPI;
  }

  interface RecipientsAPI {
    create(data: RecipientCreate): Promise<OmiseRecipient>;
    retrieve(id: string): Promise<OmiseRecipient>;
    update(id: string, data: Partial<RecipientCreate>): Promise<OmiseRecipient>;
    list(): Promise<{ data: OmiseRecipient[] }>;
  }

  interface TransfersAPI {
    create(data: TransferCreate): Promise<OmiseTransfer>;
    retrieve(id: string): Promise<OmiseTransfer>;
    list(): Promise<{ data: OmiseTransfer[] }>;
  }

  interface TransferCreate {
    amount: number;
    recipient: string;
  }

  interface OmiseTransfer {
    id: string;
    amount: number;
    currency: string;
    recipient: string;
    paid: boolean; // e.g., 'paid', 'failed'
    created: string;
  }

  interface RecipientCreate {
    name: string;
    email: string;
    type: 'individual' | 'corporation';
    bank_account: {
      brand: string;
      number: string;
      name: string;
      last_digits: string;
    } | string; // หรือ token ก็ได้
  }

  interface OmiseRecipient {
    id: string;
    name: string;
    email: string;
    verified: boolean;
    bank_account: {
      brand: string;
      number: string;
      last_digits: string;
      name: string;
    };
    active: boolean;
    created: string;
  }

  interface CustomersAPI {
    create(data: OmiseCustomerCreate): Promise<OmiseCustomer>;
    retrieve(id: string): Promise<OmiseCustomer>;
    update(id: string, data: { card: string }): Promise<OmiseCustomer>;
    list(): Promise<{ data: OmiseCustomer[] }>;
  }

  interface TokensAPI {
    create(data: OmiseTokenCreate): Promise<OmiseToken>;
  }

  interface ChargesAPI {
    create(data: OmiseChargeCreate): Promise<OmiseCharge>;
    retrieve(id: string): Promise<OmiseCharge>;
  }

  interface OmiseTokenCreate {
    card: {
      name: string;
      number: string;
      expiration_month: number;
      expiration_year: number;
      security_code: string;
    };
  }

  interface OmiseToken {
    id: string;
    object: 'token';
    card: OmiseCard;
  }

  interface OmiseCard {
    id: string;
    brand: string;
    name: string;
    last_digits: string;
    expiration_month: number;
    expiration_year: number;
    created: string;
  }

  interface OmiseCustomer {
    id: string;
    email: string;
    description?: string;
    cards: {
      length: number;
      object: 'list';
      data: OmiseCard[];
    };
    default_card: string;
    created: string;
  }

  interface OmiseCustomerCreate {
    email: string;
    description?: string;
    card?: string;
  }

  interface OmiseChargeCreate {
    amount: number;
    currency: string;
    customer?: string;
    card?: string;
    description?: string;
  }

  interface OmiseCharge {
    id: string;
    amount: number;
    currency: string;
    status: string;
    paid: boolean;
    card: OmiseCard;
    customer: string;
    created: string;
  }

  export default omiseFactory;
}