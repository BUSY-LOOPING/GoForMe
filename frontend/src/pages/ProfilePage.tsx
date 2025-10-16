import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zip_code: user?.zip_code || '',
    date_of_birth: user?.date_of_birth || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zip_code: user.zip_code || '',
        date_of_birth: user.date_of_birth || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      // const response = await api.put('/users/profile', {
      //   first_name: formData.first_name,
      //   last_name: formData.last_name,
      //   phone: formData.phone,
      //   address: formData.address,
      //   city: formData.city,
      //   state: formData.state,
      //   zip_code: formData.zip_code,
      //   date_of_birth: formData.date_of_birth,
      // });
      

      // dispatch(updateUser(response.data.user));

      throw new Error('sdad');
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 text-center py-8">
          <span className="material-icons text-4xl text-gray-400 mb-4">person_off</span>
          <p className="text-gray-600">Unable to load profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center font-bold text-2xl">
              {user.first_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900">
                {user.first_name} {user.last_name}
              </h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
                placeholder="Toronto"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Province</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
                placeholder="ON"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Postal Code</label>
              <input
                type="text"
                value={formData.zip_code}
                onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                disabled={!editing}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
                placeholder="M5V 3A8"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
              disabled={!editing}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-600"
            />
          </div>

          {editing && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h3 className="font-bold text-lg mb-4">Account Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Email Verified</span>
            <span className={`font-medium ${user.email_verified ? 'text-gray-900' : 'text-red-600'}`}>
              {user.email_verified ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Phone Verified</span>
            <span className={`font-medium ${user.phone_verified ? 'text-gray-900' : 'text-red-600'}`}>
              {user.phone_verified ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Account Status</span>
            <span className={`font-medium ${user.is_active ? 'text-gray-900' : 'text-red-600'}`}>
              {user.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Member Since</span>
            <span className="font-medium text-gray-900">
              {new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
