export interface User {
    id: number;
    name: string;
    email: string;
    type: 'employee';
    employee_id: number;
    admin_id: number;
    profile_photo_url: string | null;
    employee?: {
        id: number;
        name: string;
        role: string;
        employment_type: string;
    };
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        token_type: string;
        user: User;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export interface Attendance {
    id: number;
    employee_user_id: number;
    attendance_date: string;
    check_in: string | null;
    check_in_latitude: number | null;
    check_in_longitude: number | null;
    check_in_distance_meters: number | null;
    check_out: string | null;
    check_out_latitude: number | null;
    check_out_longitude: number | null;
    check_out_distance_meters: number | null;
    work_duration: number | null;
    formatted_work_duration: string | null;
    has_checked_in: boolean;
    has_checked_out: boolean;
    created_at: string;
    updated_at: string;
}

export interface AttendanceListResponse {
    success: boolean;
    data: Attendance[];
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
}

export interface DashboardStats {
    attendance: {
        monthly_records: number;
        today_checked_in: boolean;
        today_checked_out: boolean;
    };
    invoices: {
        total: number;
        pending_approval: number;
    };
}

export interface CheckInRequest {
    latitude: number;
    longitude: number;
}

export interface LocationCoords {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
}

// Salary-related types
export interface SalaryRelease {
    id: number;
    employee_id: number;
    employee_name?: string;
    currency_id: number;
    currency_code?: string;
    currency_symbol?: string;
    month: number;
    year: number;
    basic_salary: number;
    bonus: number;
    commission: number;
    deductions: number;
    net_salary: number;
    release_date: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface Bonus {
    id: number;
    employee_id: number;
    employee_name?: string;
    currency_id: number;
    currency_code?: string;
    currency_symbol?: string;
    amount: number;
    description: string;
    date: string;
    release_type: 'with_salary' | 'separate';
    created_at: string;
    updated_at: string;
}

export interface Invoice {
    id: number;
    client_id: number;
    client_name?: string;
    employee_id: number;
    employee_name?: string;
    currency_id: number;
    currency_code?: string;
    currency_symbol?: string;
    due_date: string;
    amount: number;
    tax: number;
    total_amount: number;
    special_note?: string;
    status: 'pending' | 'paid' | 'overdue';
    approval_status: 'pending' | 'approved' | 'rejected';
    milestones?: InvoiceMilestone[];
    created_at: string;
    updated_at: string;
}

export interface InvoiceMilestone {
    id: number;
    title: string;
    amount: number;
    due_date: string;
    completed: boolean;
}

export interface Client {
    id: number;
    name: string;
    email: string;
    primary_contact: string;
    website?: string;
    profile_photo_url?: string;
    created_at: string;
    updated_at: string;
}

export interface Currency {
    id: number;
    code: string;
    name: string;
    symbol: string;
    conversion_rate: number;
    is_base: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface OfficeClosure {
    id: number;
    start_date: string;
    end_date: string;
    reason: string;
    is_single_day: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
