'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertTriangle, Droplets, Home, Users, Shield } from 'lucide-react';

export default function ContributorPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    placeName: '',
    taluk: '',
    district: '',
    pincode: '',
    description: '',
    riskType: 'flood',
    riskLevel: 3,
    crimeIncidents: '',
    floodDepth: '',
    slumDensity: '',
    additionalInfo: ''
  });

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, riskType: value }));
  };

  // Handle slider changes
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, riskLevel: parseInt(e.target.value) }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock API call
    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Submitted data:', formData);
      
      // Show success message
      setIsSuccess(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          placeName: '',
          taluk: '',
          district: '',
          pincode: '',
          description: '',
          riskType: 'flood',
          riskLevel: 3,
          crimeIncidents: '',
          floodDepth: '',
          slumDensity: '',
          additionalInfo: ''
        });
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render different form fields based on risk type
  const renderRiskSpecificFields = () => {
    switch (formData.riskType) {
      case 'crime':
        return (
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="crimeIncidents" className="text-sm font-medium">Number of Crime Incidents (last 12 months)</label>
              <input
                id="crimeIncidents"
                name="crimeIncidents"
                type="number"
                placeholder="e.g., 12"
                value={formData.crimeIncidents}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="additionalInfo" className="text-sm font-medium">Crime Type Details</label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                placeholder="Specify types of crimes (theft, assault, etc.)"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        );
      case 'flood':
        return (
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="floodDepth" className="text-sm font-medium">Average Flood Depth (in cm)</label>
              <input
                id="floodDepth"
                name="floodDepth"
                type="number"
                placeholder="e.g., 50"
                value={formData.floodDepth}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="additionalInfo" className="text-sm font-medium">Flood Frequency & Duration</label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                placeholder="How often does flooding occur and for how long?"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        );
      case 'slum':
        return (
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="slumDensity" className="text-sm font-medium">Population Density (people per sq km)</label>
              <input
                id="slumDensity"
                name="slumDensity"
                type="number"
                placeholder="e.g., 5000"
                value={formData.slumDensity}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="additionalInfo" className="text-sm font-medium">Infrastructure Details</label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                placeholder="Describe access to water, sanitation, electricity, etc."
                value={formData.additionalInfo}
                onChange={handleInputChange}
                className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Get icon based on risk type
  const getRiskIcon = () => {
    switch (formData.riskType) {
      case 'crime':
        return <Shield className="h-5 w-5" />;
      case 'flood':
        return <Droplets className="h-5 w-5" />;
      case 'slum':
        return <Users className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <button 
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={() => router.push('/')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>
        
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 border-t-4 border-t-purple-600 overflow-hidden">
          <div className="p-6 pb-2">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Home className="h-6 w-6 text-purple-600" />
              Contribute Location Data
            </h2>
            <p className="text-gray-500 mt-1">
              Help improve BangMaps by contributing information about locations and their risk factors
            </p>
          </div>
          
          <div className="p-6 pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Location Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid w-full items-center gap-1.5">
                    <label htmlFor="placeName" className="text-sm font-medium">Place Name*</label>
                    <input
                      id="placeName"
                      name="placeName"
                      placeholder="e.g., HSR Layout"
                      required
                      value={formData.placeName}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <label htmlFor="taluk" className="text-sm font-medium">Taluk/Tehsil*</label>
                    <input
                      id="taluk"
                      name="taluk"
                      placeholder="e.g., Bengaluru South"
                      required
                      value={formData.taluk}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <label htmlFor="district" className="text-sm font-medium">District*</label>
                    <input
                      id="district"
                      name="district"
                      placeholder="e.g., Bengaluru Urban"
                      required
                      value={formData.district}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <label htmlFor="pincode" className="text-sm font-medium">PIN Code*</label>
                    <input
                      id="pincode"
                      name="pincode"
                      placeholder="e.g., 560102"
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <label htmlFor="description" className="text-sm font-medium">Brief Description</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Describe the location and its characteristics"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              
              {/* Risk Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  {getRiskIcon()}
                  Risk Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid w-full items-center gap-1.5">
                    <label htmlFor="riskType" className="text-sm font-medium">Risk Type*</label>
                    <select 
                      id="riskType"
                      value={formData.riskType} 
                      onChange={(e) => handleSelectChange(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="flood">Flood</option>
                      <option value="crime">Crime</option>
                      <option value="slum">Slum</option>
                    </select>
                  </div>
                  <div className="grid w-full items-center gap-1.5">
                    <label htmlFor="riskLevel" className="text-sm font-medium">
                      Risk Level: {formData.riskLevel} {formData.riskLevel === 1 ? '(Low)' : formData.riskLevel === 5 ? '(High)' : ''}
                    </label>
                    <input
                      id="riskLevel"
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={formData.riskLevel}
                      onChange={handleSliderChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>
                </div>
                
                {/* Risk-specific fields */}
                {renderRiskSpecificFields()}
              </div>
              
              <div className="flex justify-end px-0 pt-4 mt-6">
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || isSuccess}
                >
                  {isSubmitting ? 'Submitting...' : isSuccess ? 'Submitted Successfully!' : 'Submit Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
