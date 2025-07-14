import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Bug, Send, CheckCircle, AlertCircle, Heart, Sparkles } from 'lucide-react';

const BugReport: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    category: 'bug'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const categories = [
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'improvement', label: 'Improvement Suggestion' },
    { value: 'other', label: 'Other' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const reportData = {
        userEmail: user?.email || 'anonymous@example.com',
        subject: `[${formData.category.toUpperCase()}] ${formData.subject}`,
        message: formData.message,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-bug-report`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reportData)
        }
      );

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ subject: '', message: '', category: 'bug' });
      } else {
        throw new Error('Failed to send report');
      }
    } catch (error) {
      console.error('Error sending bug report:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 pb-24 max-w-md mx-auto font-sans">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Bug className="h-8 w-8 text-cute-pink-500" />
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-cute-pink-600 to-cute-purple-600 bg-clip-text text-transparent">
            Report Issue
          </h1>
        </div>
          Report Issue
        </h1>
        <Sparkles className="text-cute-purple-500" size={28} />
      </div>

      <div className="bg-white rounded-super-cute shadow-cute border-2 border-cute-pink-100 p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Heart className="h-6 w-6 text-cute-pink-500" />
          <h2 className="text-xl font-display font-bold text-cute-purple-800">Help us improve the app</h2>
        </div>
        <p className="text-cute-purple-600 text-sm mb-4 font-medium">
          Found a bug or have a suggestion? Let us know! Your feedback helps make the app better for everyone.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-cute-purple-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border-2 border-cute-pink-200 rounded-cute focus:outline-none focus:ring-2 focus:ring-cute-pink-400 focus:border-transparent transition-all duration-200"
              required
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-cute-purple-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-3 border-2 border-cute-pink-200 rounded-cute focus:outline-none focus:ring-2 focus:ring-cute-pink-400 focus:border-transparent transition-all duration-200"
              placeholder="Brief description of the issue"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-cute-purple-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-3 border-2 border-cute-pink-200 rounded-cute focus:outline-none focus:ring-2 focus:ring-cute-pink-400 focus:border-transparent transition-all duration-200"
              rows={6}
              placeholder="Please describe the issue in detail. Include steps to reproduce if it's a bug."
              required
            />
          </div>

          {submitStatus === 'success' && (
            <div className="bg-cute-green-50 border-2 border-cute-green-200 rounded-cute p-4 flex items-center space-x-2">
              <CheckCircle className="text-cute-green-600" size={20} />
              <p className="text-cute-green-700 text-sm font-medium">
                Thank you! Your report has been sent successfully.
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-50 border-2 border-red-200 rounded-cute p-4 flex items-center space-x-2">
              <AlertCircle className="text-red-600" size={20} />
              <p className="text-red-700 text-sm font-medium">
                Failed to send report. Please try again later.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-cute-pink-500 to-cute-purple-500 text-white py-4 rounded-cute font-semibold hover:from-cute-pink-600 hover:to-cute-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-cute"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send size={22} />
                <span>Send Report</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div className="bg-cute-pink-50 rounded-super-cute p-6 border-2 border-cute-pink-100">
        <h3 className="font-display font-bold text-cute-purple-800 mb-3">What information is sent?</h3>
        <div className="space-y-2 text-sm text-cute-purple-600 font-medium">
          <p>• Your email address (for follow-up)</p>
          <p>• The message you write</p>
          <p>• Current page URL</p>
          <p>• Browser information (for debugging)</p>
          <p>• Timestamp</p>
        </div>
        <p className="text-xs text-cute-purple-500 mt-4 font-medium">
          Your privacy is important to us. This information is only used to investigate and resolve the issue you report.
        </p>
      </div>
    </div>
  );
};

export default BugReport;