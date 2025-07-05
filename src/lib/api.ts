// API Types
export interface SignupRequest {
  email: string;
  password: string;
}

export interface SignupResponse {
  user_id: string;
  token: string;
  refresh_token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user_id: string;

  token: string;
  refresh_token: string;
}

export interface RefreshRequest {
  refresh_token: string;
  token: string;
}

export interface RefreshResponse {
  refresh_token: string;
  token: string;
}

export interface OnboardRequest {
  first_name: string;
  last_name: string;
}

export interface UserResponse {
  id: string;
  username: string;
  first_name: string;
  full_name: string;
  last_name: string;
  primary_address: string;
  mobile: string;
  role: string;
  status: string;
  avatar: string;
  created_at: string;
}

// Profile update types
export interface ProfileUpdateRequest {
  username?: string;
  first_name?: string;
  last_name?: string;
  primary_address?: string;
  mobile?: string;
}

// Avatar upload types
export interface AvatarUploadResponse {
  upload_url: string;
  path: string;
  public_url: string;
}

export interface AvatarSaveRequest {
  avatar: string;
}

// Category types
export interface CategoryResponse {
  id: number;
  name: string;
}

export interface CategoriesResponse {
  categories: CategoryResponse[];
  total: number;
}

// API Error Response
export interface ApiError {
  message: string;
  status: number;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
  const url = `${baseUrl}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        message: errorData.message || 'An error occurred',
        status: response.status,
      } as ApiError;
    }

    return await response.json();
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      throw error;
    }
    throw {
      message: 'Network error or server unavailable',
      status: 500,
    } as ApiError;
  }
}

// Auth API functions
export const authApi = {
  signup: async (data: SignupRequest): Promise<SignupResponse> => {
    return apiRequest<SignupResponse>('/auth/api/v1/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiRequest<LoginResponse>('/auth/api/v1/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  refreshToken: async (data: RefreshRequest): Promise<RefreshResponse> => {
    return apiRequest<RefreshResponse>('/auth/api/v1/token/refresh', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// User API functions
export const userApi = {
  getCurrentUser: async (): Promise<UserResponse> => {
    const tokens = tokenManager.getTokens();
    return apiRequest<UserResponse>('/account/api/v1/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });
  },

  onboardUser: async (data: OnboardRequest): Promise<UserResponse> => {
    const tokens = tokenManager.getTokens();
    return apiRequest<UserResponse>('/account/api/v1/users/onboard', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
      body: JSON.stringify(data),
    });
  },

  updateProfile: async (data: ProfileUpdateRequest): Promise<UserResponse> => {
    const tokens = tokenManager.getTokens();
    const userId = tokens.user_id;
    return apiRequest<UserResponse>(`/account/api/v1/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
      body: JSON.stringify(data),
    });
  },

  getAvatarUploadUrl: async (fileName: string, contentType: string): Promise<AvatarUploadResponse> => {
    const tokens = tokenManager.getTokens();
    return apiRequest<AvatarUploadResponse>('/storage/api/v1/presign/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
      body: JSON.stringify({
        key: 'avatar',
        file_name: fileName,
        content_type: contentType,
      }),
    });
  },

  uploadAvatarToS3: async (uploadUrl: string, file: File): Promise<void> => {
    // Direct fetch for S3 upload URL - don't use apiRequest as it prepends base URL
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!response.ok) {
      throw {
        message: 'Failed to upload avatar to S3',
        status: response.status,
      } as ApiError;
    }
  },

  saveAvatarPath: async (data: AvatarSaveRequest): Promise<void> => {
    const tokens = tokenManager.getTokens();
    const userId = tokens.user_id;
    return apiRequest<void>(`/account/api/v1/avatar/${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
      body: JSON.stringify(data),
    });
  },

  getAvatarDownloadUrl: async (avatarPath: string): Promise<{ download_url: string }> => {
    const tokens = tokenManager.getTokens();
    return apiRequest<{ download_url: string }>('/storage/api/v1/presign/download', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
      body: JSON.stringify({
        key: 'avatar',
        path: avatarPath,
      }),
    });
  },
};

// Category API functions
export const categoryApi = {
  getCategories: async (pageNo: number = 1, pageSize: number = 50): Promise<CategoriesResponse> => {
    return apiRequest<CategoriesResponse>(`/catalog/api/v1/categories?page_no=${pageNo}&page_size=${pageSize}`, {
      method: 'GET',
    });
  },

  getCategory: async (id: number): Promise<CategoryResponse> => {
    return apiRequest<CategoryResponse>(`/catalog/api/v1/categories/${id}`, {
      method: 'GET',
    });
  },
};

// Token management functions
export const tokenManager = {
  setTokens: (tokens: { token: string; refresh_token: string; user_id: string }) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', tokens.token);
      localStorage.setItem('refresh_token', tokens.refresh_token);
      localStorage.setItem('user_id', tokens.user_id);
    }
  },

  getTokens: () => {
    if (typeof window !== 'undefined') {
      return {
        access_token: localStorage.getItem('access_token'),
        refresh_token: localStorage.getItem('refresh_token'),
        user_id: localStorage.getItem('user_id'),
      };
    }
    return { access_token: null, refresh_token: null, user_id: null };
  },

  clearTokens: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_id');
    }
  },

  isAuthenticated: () => {
    const tokens = tokenManager.getTokens();
    return !!tokens.access_token;
  },
};
