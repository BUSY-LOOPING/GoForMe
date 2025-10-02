export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'user' | 'runner' | 'admin';
}

export interface Service {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string;
  base_amount: string; 
  price_type: 'fixed' | 'hourly';
  estimated_duration: number;
  requires_location: boolean;
  allows_scheduling: boolean;
  image: string | null;
  is_active: boolean;
  sort_order: number;
  created_by: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  category?: ServiceCategory;
}

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  runner_id?: number;
  service_id: number;
  status: 'pending' | 'confirmed' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'urgent';
  pickup_address?: string;
  delivery_address: string;
  scheduled_date: string;
  started_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  special_instructions?: string;
  custom_fields?: any;
  total_amount: string;
  base_amount: string;
  discount_amount: string;
  platform_fee: string;
  tax_amount: string;
  service_fee: string;
  runner_earnings?: string;
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  runner?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  service?: {
    id: number;
    name: string;
    description: string;
    base_price: string;
    category_id: number;
  };
}


export interface OrdersResponse {
  orders: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}


export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface ServicesState {
  services: Service[];
  categories: ServiceCategory[];
  selectedService: Service | null;
  isLoading: boolean;
  error: string | null;
}
