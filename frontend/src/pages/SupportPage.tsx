import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';

const SupportPage: React.FC = () => {
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting support ticket:', formData);
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ subject: '', category: '', message: '' });
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting ticket:', error);
    }
  };

  const faqs = [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order in the Order History section.',
    },
    {
      question: 'How do I cancel an order?',
      answer: 'Contact support within 5 minutes of placing the order.',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards and debit cards.',
    },
  ];

  return (
      <div className="flex-1">
      
        <main className="p-6">
          <div className="max-w-4xl">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                    <span className="material-icons text-white">email</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Email Support</h3>
                    <p className="text-sm text-gray-600">support@goforme.com</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Response within 24 hours</p>
              </div>

              <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                    <span className="material-icons text-white">phone</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Phone Support</h3>
                    <p className="text-sm text-gray-600">1-800-123-4567</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Mon-Fri 9am-5pm EST</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-8">
              <h3 className="font-bold text-xl text-gray-900 mb-4">Submit a Ticket</h3>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-icons text-4xl text-gray-900">check_circle</span>
                  </div>
                  <p className="font-semibold text-gray-900">Ticket Submitted!</p>
                  <p className="text-sm text-gray-600 mt-2">
                    We'll get back to you within 24 hours
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="order">Order Issue</option>
                      <option value="payment">Payment Issue</option>
                      <option value="account">Account Issue</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg"
                      rows={6}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Submit Ticket
                  </button>
                </form>
              )}
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h3 className="font-bold text-xl text-gray-900 mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
  );
};

export default SupportPage;
