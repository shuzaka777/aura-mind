import React, { useState, useRef } from 'react';
import type { UserProfile, AppData } from '../types';
import { EditIcon, CheckIcon, UserCircleIcon, DownloadIcon } from './icons';
import { generateTherapistReport } from '../services/geminiService';


interface ProfileProps {
  appData: AppData;
  onProfileUpdate: (newProfile: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ appData, onProfileUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(appData.userProfile);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userProfile } = appData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNumericField = ['age', 'height', 'weight'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumericField ? (value ? Number(value) : null) : value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onProfileUpdate(formData);
    setIsEditing(false);
  };
  
  const handleExport = async () => {
    setIsExporting(true);
    const reportContent = await generateTherapistReport({
        mentalHealth: appData.mentalHealthData,
        journal: appData.journalEntries
    });
    
    const fullReport = `AuraMind Mental Health Report\nGenerated on: ${new Date().toLocaleString()}\n\nUser: ${userProfile.name}\n\n${reportContent}`;
    
    const blob = new Blob([fullReport], { type: 'text/plain' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    const today = new Date().toLocaleDateString('en-CA');
    link.download = `AuraMind_Report_${today}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    setIsExporting(false);
  };

  const ProfileField = ({ label, value }: {label: string, value: string | number | null}) => (
    <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-lg text-gray-800 dark:text-gray-200">{value || 'Not set'}</p>
    </div>
  );
  
  const EditField = ({ label, name, value, type='text', children }: {label: string, name: string, value: any, type?: string, children?: React.ReactNode}) => {
    const id = `profile-${name}`;
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
            {type === 'select' ? (
                <select id={id} name={name} value={value || ''} onChange={handleChange} className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500">
                    {children}
                </select>
            ) : (
                <input type={type} id={id} name={name} value={value || ''} onChange={handleChange} className="mt-1 w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500" />
            )}
        </div>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 border border-slate-200/50 dark:border-slate-700/50">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Your Profile</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Update your personal information</p>
          </div>
          <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className="flex items-center text-lime-700 dark:text-lime-500 font-semibold text-sm py-1 px-3 rounded-full hover:bg-lime-50 dark:hover:bg-gray-700 transition-colors">
            {isEditing ? <CheckIcon className="w-5 h-5 mr-1" /> : <EditIcon className="w-5 h-5 mr-1" />}
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>

        <div className="flex flex-col items-center mb-8">
            <div className="relative">
                {formData.avatarUrl ? (
                    <img src={formData.avatarUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover shadow-md" />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <UserCircleIcon className="w-16 h-16 text-slate-400" />
                    </div>
                )}
                {isEditing && (
                    <>
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="sr-only" />
                        <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-600 p-1.5 rounded-full shadow-md hover:bg-slate-100 transition-colors">
                            <EditIcon className="w-4 h-4 text-slate-600 dark:text-slate-200" />
                            <span className="sr-only">Change profile picture</span>
                        </button>
                    </>
                )}
            </div>
        </div>
        
        {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EditField label="Name" name="name" value={formData.name} />
                <EditField label="Email" name="email" type="email" value={formData.email} />
                <EditField label="Mobile Number" name="mobileNumber" type="tel" value={formData.mobileNumber} />
                <EditField label="Age" name="age" type="number" value={formData.age} />
                <EditField label="Gender" name="gender" type="select" value={formData.gender}>
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                </EditField>
                <EditField label="Height (cm)" name="height" type="number" value={formData.height} />
                <EditField label="Weight (kg)" name="weight" type="number" value={formData.weight} />
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField label="Name" value={userProfile.name} />
                <ProfileField label="Email" value={userProfile.email} />
                <ProfileField label="Mobile Number" value={userProfile.mobileNumber} />
                <ProfileField label="Age" value={userProfile.age} />
                <ProfileField label="Gender" value={userProfile.gender} />
                <ProfileField label="Height (cm)" value={userProfile.height} />
                <ProfileField label="Weight (kg)" value={userProfile.weight} />
            </div>
        )}
      </div>

       <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 border border-slate-200/50 dark:border-slate-700/50">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Data & Exporting</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">Download a copy of your recent progress report for your personal records.</p>
          <button onClick={handleExport} disabled={isExporting} className="flex items-center justify-center w-full md:w-auto bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50">
            <DownloadIcon className="w-5 h-5 mr-2" />
            {isExporting ? 'Exporting...' : 'Export My Report (.txt)'}
          </button>
       </div>
    </div>
  );
};

export default Profile;