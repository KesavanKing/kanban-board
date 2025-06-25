import React, { useState, useEffect } from 'react';
import { User, Upload, X } from 'lucide-react';
import { taskApi } from '../services/api';
import { Profile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  profile: Profile;
  onClose: () => void;
  onProfileUpdate: (profile: Profile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ 
  isOpen, 
  profile, 
  onClose, 
  onProfileUpdate 
}) => {
  const [name, setName] = useState(profile.name);
  const [profilePicture, setProfilePicture] = useState<string | null>(profile.profilePicture);
  const [previewUrl, setPreviewUrl] = useState<string | null>(profile.profilePicture);

  useEffect(() => {
    if (isOpen) {
      setName(profile.name);
      setProfilePicture(profile.profilePicture);
      setPreviewUrl(profile.profilePicture);
    }
  }, [isOpen, profile]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePicture(result);
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const updatedProfile = await taskApi.updateProfile({
        name: name.trim(),
        profilePicture
      });
      onProfileUpdate(updatedProfile);
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleRemoveImage = () => {
    setProfilePicture(null);
    setPreviewUrl(null);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Edit Profile</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="form">
          <div className="form-group">
            <label className="form-label">Profile Picture</label>
            <div className="profile-picture-upload">
              <div className="profile-picture-preview">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Profile preview" 
                    className="preview-image"
                  />
                ) : (
                  <div className="no-image-placeholder">
                    <User size={48} />
                    <span>No image</span>
                  </div>
                )}
              </div>
              
              <div className="upload-controls">
                <label className="upload-btn">
                  <Upload size={16} />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                
                {previewUrl && (
                  <button 
                    type="button"
                    className="remove-btn"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleSave}
              disabled={!name.trim()}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
