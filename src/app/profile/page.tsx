'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Camera, 
  Edit3, 
  Save, 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield,
  Upload,
  CheckCircle
} from 'lucide-react';
import { useAuth } from 'src/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from 'src/components/ProtectedRoute';
import { userApi, ProfileUpdateRequest, ApiError } from 'src/lib/api';

// Profile update schema
const profileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  primary_address: z.string().optional(),
  mobile: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

function ProfilePage() {
  const { user, isLoading: authLoading, checkUserProfile } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema)
  });

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        primary_address: user.primary_address || '',
        mobile: user.mobile || '',
      });
    }
  }, [user, reset]);

  // Load avatar URL when user data changes
  useEffect(() => {
    const loadAvatarUrl = async () => {
      if (user?.avatar && typeof user.avatar === 'string' && user.avatar.trim() !== '') {
        try {
          const response = await userApi.getAvatarDownloadUrl(user.avatar);
          setAvatarUrl(response.download_url);
        } catch (error) {
          console.error('Failed to get avatar download URL:', error);
          setAvatarUrl(null);
        }
      } else {
        setAvatarUrl(null);
      }
    };

    loadAvatarUrl();
  }, [user?.avatar]);

  // Clear messages after some time
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setIsUploadingAvatar(true);
    setError(null);
    
    try {
      // Create preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Get presigned upload URL
      const uploadResponse = await userApi.getAvatarUploadUrl(file.name, file.type);
      
      // Upload file to S3
      await userApi.uploadAvatarToS3(uploadResponse.upload_url, file);
      
      // Save avatar path to user profile
      await userApi.saveAvatarPath({ avatar: uploadResponse.path });

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploadingAvatar(false);
        setSuccess('Profile picture updated successfully!');
        // Refresh user data
        checkUserProfile();
      }, 500);

    } catch (error) {
      console.error('Avatar upload error:', error);
      const apiError = error as ApiError;
      setError(apiError.message || 'Failed to upload avatar. Please try again.');
      setIsUploadingAvatar(false);
      setUploadProgress(0);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Update profile using API
      await userApi.updateProfile(data as ProfileUpdateRequest);
      
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      // Refresh user data
      checkUserProfile();
    } catch (error) {
      console.error('Profile update error:', error);
      const apiError = error as ApiError;
      setError(apiError.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    // Reset form to original values
    if (user) {
      reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        primary_address: user.primary_address || '',
        mobile: user.mobile || '',
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const displayAvatarUrl = previewUrl || avatarUrl;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
            <X className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Profile Picture Card */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h2>
              
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-gray-100">
                    {displayAvatarUrl ? (
                      <img
                        src={displayAvatarUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Upload overlay */}
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 w-32 h-32 rounded-full bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <div className="text-center">
                      <Camera className="w-8 h-8 text-white mx-auto mb-1" />
                      <span className="text-xs text-white">Change</span>
                    </div>
                  </label>
                  
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={isUploadingAvatar}
                  />
                </div>

                {/* Upload progress */}
                {isUploadingAvatar && (
                  <div className="mt-4 w-full">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <p className="mt-3 text-sm text-gray-500 text-center">
                  Click to upload a new profile picture
                  <br />
                  <span className="text-xs">JPG, PNG up to 5MB</span>
                </p>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="bg-white shadow rounded-lg p-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {user?.status || 'Active'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Profile Complete</span>
                  <span className="text-sm font-medium text-gray-900">
                    {user?.first_name && user?.last_name && user?.primary_address ? '85%' : '60%'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Last Updated</span>
                  <span className="text-sm text-gray-600">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit(onSubmit)}
                      disabled={isLoading}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </button>
                  </div>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* First Name */}
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          type="text"
                          id="first_name"
                          {...register('first_name')}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.first_name && (
                          <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                        )}
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{user?.first_name || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    {isEditing ? (
                      <div>
                        <input
                          type="text"
                          id="last_name"
                          {...register('last_name')}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.last_name && (
                          <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                        )}
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{user?.last_name || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Mobile */}
                  <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Mobile Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        id="mobile"
                        {...register('mobile')}
                        placeholder="+1 (555) 123-4567"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{user?.mobile || 'Not provided'}</p>
                    )}
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{user?.username || 'Not available'}</p>
                    <p className="text-xs text-gray-500">Contact support to change email</p>
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label htmlFor="primary_address" className="block text-sm font-medium text-gray-700 mb-1">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Primary Address
                    </label>
                    {isEditing ? (
                      <textarea
                        id="primary_address"
                        {...register('primary_address')}
                        rows={3}
                        placeholder="Enter your primary address"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{user?.primary_address || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </form>

              {/* Account Information */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">User ID:</span>
                    <p className="font-mono text-xs mt-1">{user?.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Role:</span>
                    <p className="mt-1">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Shield className="w-3 h-3 mr-1" />
                        {user?.role || 'User'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Member Since:</span>
                    <p className="mt-1 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  );
}
