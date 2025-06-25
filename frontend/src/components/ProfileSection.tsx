import React, { useState, useEffect } from 'react';
import { taskApi } from '../services/api';
import { Profile, UpdateProfileRequest } from '../types';

interface ProfileSectionProps {
  profile: Profile;
  onProfileUpdate: (updatedProfile: Profile) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ profile, onProfileUpdate }) => {
  const [isEditMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState<UpdateProfileRequest>({ name: profile.name });

  const handleProfileChange = async () => {
    try {
      const updatedProfile = await taskApi.updateProfile(profileData);
      onProfileUpdate(updatedProfile);
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, profilePicture: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-section">
      {isEditMode ? (
        <>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
          />
          <input type="file" accept="image/*" onChange={handleUpload} />
          <button onClick={handleProfileChange}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </>
      ) : (
        <>
          <img
            src={profile.profilePicture || 'default-avatar.png'}
            alt="Profile"
            className="profile-picture"
          />
          <h3>{profile.name}</h3>
          <button onClick={() => setEditMode(true)}>Edit Profile</button>
        </>
      )}
    </div>
  );
};

