// Attendance-related TypeScript types

export interface AttendanceSettings {
    ip_whitelist: {
        enforce_ip_whitelist: boolean;
        enabled: boolean;
    };
    location_guard: {
        enforce_office_location: boolean;
        enabled: boolean;
        office_configured: boolean;
        office_latitude?: number;
        office_longitude?: number;
        office_radius_meters?: number;
    };
    employee?: {
        geolocation_mode: 'disabled' | 'required' | 'required_with_whitelist';
        geolocation_required: boolean;
        enforces_office_radius: boolean;
        uses_whitelist_override: boolean;
        has_ip_whitelist: boolean;
        ip_whitelists_count: number;
    };
}

export interface AttendanceRecord {
    id: number;
    employee_user_id: number;
    attendance_date: string;
    check_in: string;
    check_in_latitude?: number;
    check_in_longitude?: number;
    check_in_distance_meters?: number;
    check_out?: string;
    check_out_latitude?: number;
    check_out_longitude?: number;
    check_out_distance_meters?: number;
    work_duration?: string;
    has_checked_in: boolean;
    has_checked_out: boolean;
}

export interface AttendanceStatus {
    today_date: string;
    checked_in_today: boolean;
    checked_out_today: boolean;
    can_check_in: boolean;
    can_check_out: boolean;
    has_pending_checkout: boolean;
    today_attendance?: AttendanceRecord;
    pending_attendance?: {
        id: number;
        date: string;
        check_in: string;
    };
}

export interface CheckInRequest {
    latitude?: number;
    longitude?: number;
}

export interface CheckOutRequest {
    latitude?: number;
    longitude?: number;
}

export interface AttendanceErrorResponse {
    success: false;
    message: string;
    distance?: number;
    required_distance?: number;
}

// Fix Request types
export interface FixRequest {
    id: number;
    employee_user_id: number;
    attendance_id: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_notes?: string;
    processed_at?: string;
    created_at: string;
    updated_at: string;
    attendance?: AttendanceRecord;
}

export interface CreateFixRequestRequest {
    attendance_id: number;
    reason: string;
}

export interface ProcessFixRequestRequest {
    status: 'approved' | 'rejected';
    admin_notes?: string;
}

// Office Schedule types
export interface OfficeSchedule {
    id: number;
    start_time: string;
    end_time: string;
    working_days: string[];
    timezone: string;
    created_at: string;
    updated_at: string;
}

export interface OfficeScheduleResponse {
    schedule: OfficeSchedule | null;
    has_schedule: boolean;
}

// Enhanced Attendance Status (includes fix requests)
export interface EnhancedAttendanceStatus extends AttendanceStatus {
    pending_fix_requests?: FixRequest[];
    can_request_fix: boolean;
    office_schedule?: OfficeSchedule;
}
