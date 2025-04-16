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
