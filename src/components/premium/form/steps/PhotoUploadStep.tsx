
import { useEffect } from 'react';
import { FormData } from '@/types/premium-valuation';

interface PhotoUploadStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

export function PhotoUploadStep({
  step,
  formData,
  setFormData,
  updateValidity
}: PhotoUploadStepProps) {
  useEffect(() => {
    // This step is always valid - photos are optional
    updateValidity(step, true);
  }, [step, updateValidity]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, photos: files }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Vehicle Photos</h2>
        <p className="text-gray-600 mb-6">
          Upload photos of your vehicle to help improve valuation accuracy.
        </p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="photo-upload"
        />
        <label htmlFor="photo-upload" className="cursor-pointer">
          <div className="text-gray-500">
            <p>Click to upload photos or drag and drop</p>
            <p className="text-sm">PNG, JPG up to 10MB each</p>
          </div>
        </label>
      </div>

      {formData.photos && formData.photos.length > 0 && (
        <div>
          <p className="text-sm text-gray-600">
            {formData.photos.length} photo(s) selected
          </p>
        </div>
      )}
    </div>
  );
}
