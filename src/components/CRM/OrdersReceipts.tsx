import React, { useState } from 'react';
import { Plus, Search, Download, FileText, DollarSign, Calendar, CheckCircle, Clock, Target, X, Save, User, Building, Phone, Mail, CreditCard, Eye, CreditCard as Edit, Trash2 } from 'lucide-react';
import { loadLeads } from '../../data/leads.mock';
import toast from 'react-hot-toast';
import { X, Save } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerCompany?: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  receiptGenerated: boolean;
  assignedTo: string;
  source: string;
  tags: string[];
  description: string;
  paymentMethod: 'cash' | 'bank' | 'upi' | 'cheque' | 'card';
  receiptNumber?: string;
  notes?: string;
}

interface CreateOrderFormData {
  customerName: string;
  customerCompany: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  description: string;
  paymentMethod: 'cash' | 'bank' | 'upi' | 'cheque' | 'card';
  assignedTo: string;
  source: string;
  notes: string;
}

const CreateOrderModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (orderData: CreateOrderFormData) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<CreateOrderFormData>({
    customerName: '',
    customerCompany: '',
    customerEmail: '',
    customerPhone: '',
    amount: 0,
    description: '',
    paymentMethod: 'upi',
    assignedTo: '',
    source: 'direct',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const agents = ['Priya Sharma', 'Karthik Nair', 'Vikram Singh', 'Suresh Kumar', 'Anjali Sharma'];

  const handleInputChange = (field: keyof CreateOrderFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!formData.customerEmail.trim()) newErrors.customerEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) newErrors.customerEmail = 'Invalid email format';
    if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Phone is required';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.assignedTo) newErrors.assignedTo = 'Please assign to an agent';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave(formData);
      
      // Reset form
      setFormData({
        customerName: '',
        customerCompany: '',
        customerEmail: '',
        customerPhone: '',
        amount: 0,
        description: '',
        paymentMethod: 'upi',
        assignedTo: '',
        source: 'direct',
        notes: ''
      });
      
      toast.success('Order created successfully!');
    } catch (error) {
      toast.error('Failed to create order. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-slate-800/90 backdrop-blur-xl border border-yellow-400/40 rounded-2xl shadow-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-50">Create New Order</h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-50 hover:bg-slate-700/50 rounded-lg transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Customer Name *
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.customerName ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                placeholder="Enter customer name"
                disabled={isSaving}
              />
              {errors.customerName && <p className="mt-1 text-sm text-red-400">{errors.customerName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">
                <Building className="inline h-4 w-4 mr-1" />
                Company (Optional)
              </label>
              <input
                type="text"
                value={formData.customerCompany}
                onChange={(e) => handleInputChange('customerCompany', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                placeholder="Company name"
                disabled={isSaving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email *
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.customerEmail ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                placeholder="customer@example.com"
                disabled={isSaving}
              />
              {errors.customerEmail && <p className="mt-1 text-sm text-red-400">{errors.customerEmail}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">
                <Phone className="inline h-4 w-4 mr-1" />
                Phone *
              </label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.customerPhone ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                placeholder="+91 98765 43210"
                disabled={isSaving}
              />
              {errors.customerPhone && <p className="mt-1 text-sm text-red-400">{errors.customerPhone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">
                <DollarSign className="inline h-4 w-4 mr-1" />
                Order Amount (₹) *
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.amount ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                placeholder="500000"
                disabled={isSaving}
              />
              {errors.amount && <p className="mt-1 text-sm text-red-400">{errors.amount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                disabled={isSaving}
              >
                <option value="upi">UPI</option>
                <option value="bank">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
                <option value="card">Card</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Assigned To *</label>
              <select
                value={formData.assignedTo}
                onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                  errors.assignedTo ? 'border-red-500' : 'border-yellow-400/30'
                }`}
                disabled={isSaving}
              >
                <option value="">Select Agent</option>
                {agents.map(agent => (
                  <option key={agent} value={agent}>{agent}</option>
                ))}
              </select>
              {errors.assignedTo && <p className="mt-1 text-sm text-red-400">{errors.assignedTo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-50 mb-2">Source</label>
              <select
                value={formData.source}
                onChange={(e) => handleInputChange('source', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                disabled={isSaving}
              >
                <option value="direct">Direct</option>
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="cold-call">Cold Call</option>
                <option value="social-media">Social Media</option>
                <option value="advertisement">Advertisement</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2">
              <FileText className="inline h-4 w-4 mr-1" />
              Order Description *
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-3 py-2 bg-slate-700/50 border rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm ${
                errors.description ? 'border-red-500' : 'border-yellow-400/30'
              }`}
              placeholder="Describe the order details, scheme type, etc."
              disabled={isSaving}
            />
            {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-50 mb-2">Additional Notes</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
              placeholder="Any additional notes about the order"
              disabled={isSaving}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-yellow-400/30">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 border border-yellow-400/30 rounded-lg hover:bg-slate-700 transition-all disabled:opacity-50 backdrop-blur-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const generateReceipt = (order: Order): string => {
  const receiptContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Receipt - ${order.receiptNumber}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 5px;
        }
        .company-tagline {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 10px;
        }
        .receipt-title {
            font-size: 24px;
            font-weight: bold;
            color: #059669;
            margin-top: 15px;
        }
        .receipt-number {
            font-size: 16px;
            color: #6b7280;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #374151;
            margin-bottom: 10px;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
        }
        .info-label {
            font-weight: 600;
            color: #4b5563;
        }
        .info-value {
            color: #111827;
        }
        .amount-section {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            text-align: center;
        }
        .amount {
            font-size: 32px;
            font-weight: bold;
            color: #059669;
            margin-bottom: 5px;
        }
        .amount-label {
            font-size: 14px;
            color: #6b7280;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }
        .signature-section {
            margin-top: 40px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
        }
        .signature-box {
            text-align: center;
            padding-top: 40px;
            border-top: 1px solid #000;
        }
        @media print {
            body { margin: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">Ramnirmalchits Financial Services</div>
        <div class="company-tagline">Your Trusted Financial Partner</div>
        <div class="receipt-title">PAYMENT RECEIPT</div>
        <div class="receipt-number">Receipt No: ${order.receiptNumber}</div>
    </div>

    <div class="section">
        <div class="section-title">Customer Information</div>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Name:</span>
                <span class="info-value">${order.customerName}</span>
            </div>
            ${order.customerCompany ? `
            <div class="info-item">
                <span class="info-label">Company:</span>
                <span class="info-value">${order.customerCompany}</span>
            </div>
            ` : ''}
            <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">${order.customerEmail}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Phone:</span>
                <span class="info-value">${order.customerPhone}</span>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Order Details</div>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Order Number:</span>
                <span class="info-value">${order.orderNumber}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Date:</span>
                <span class="info-value">${new Date(order.date).toLocaleDateString()}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Payment Method:</span>
                <span class="info-value">${order.paymentMethod.toUpperCase()}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Handled By:</span>
                <span class="info-value">${order.assignedTo}</span>
            </div>
        </div>
        <div style="margin-top: 15px;">
            <div class="info-label">Description:</div>
            <div class="info-value" style="margin-top: 5px; padding: 10px; background: #f8fafc; border-radius: 4px;">
                ${order.description}
            </div>
        </div>
    </div>

    <div class="amount-section">
        <div class="amount">₹${order.amount.toLocaleString('en-IN')}</div>
        <div class="amount-label">Total Amount Received</div>
    </div>

    ${order.notes ? `
    <div class="section">
        <div class="section-title">Additional Notes</div>
        <div style="padding: 10px; background: #f8fafc; border-radius: 4px; border: 1px solid #e2e8f0;">
            ${order.notes}
        </div>
    </div>
    ` : ''}

    <div class="signature-section">
        <div class="signature-box">
            <div>Customer Signature</div>
        </div>
        <div class="signature-box">
            <div>Authorized Signature</div>
        </div>
    </div>

    <div class="footer">
        <p><strong>Ramnirmalchits Financial Services</strong></p>
        <p>123 Business District, Financial Hub, Mumbai - 400001</p>
        <p>Phone: +91 98765 43210 | Email: info@ramnirmalchits.com</p>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <p style="margin-top: 15px; font-style: italic;">
            Thank you for choosing Ramnirmalchits Financial Services. This is a computer-generated receipt.
        </p>
    </div>
</body>
</html>
  `;

  return receiptContent;
};

const downloadReceipt = (order: Order) => {
  try {
    const receiptContent = generateReceipt(order);
    const blob = new Blob([receiptContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt-${order.receiptNumber || order.orderNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Receipt downloaded: ${order.receiptNumber || order.orderNumber}`);
  } catch (error) {
    console.error('Error downloading receipt:', error);
    toast.error('Failed to download receipt. Please try again.');
  }
};

export const OrdersReceipts: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [orders, setOrders] = useState<Order[]>(() => {
    // Load existing orders from localStorage or initialize with sample data
    const saved = localStorage.getItem('orders_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.error('Failed to load orders:', error);
        return [];
      }
    }
    
    // Initialize with orders from won leads
    const leads = loadLeads();
    const wonLeads = leads.filter(l => l.status === 'won');
    return wonLeads.map((lead, index) => ({
      id: lead.id,
      orderNumber: `ORD-2024-${String(index + 1).padStart(3, '0')}`,
      customerName: lead.name,
      customerCompany: lead.company,
      customerEmail: lead.email,
      customerPhone: lead.phone,
      amount: lead.value,
      date: lead.updatedAt.split('T')[0],
      status: 'completed' as const,
      receiptGenerated: true,
      assignedTo: lead.assignedTo || 'Unknown',
      source: lead.source,
      tags: lead.tags || [],
      description: `Chit fund enrollment for ${lead.company || lead.name}`,
      paymentMethod: 'upi' as const,
      receiptNumber: `RCP-2024-${String(index + 1).padStart(3, '0')}`
    }));
  });

  const filteredOrders = orders.filter(order =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.customerCompany && order.customerCompany.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCreateOrder = () => {
    setShowCreateModal(true);
  };

  const handleSaveOrder = (orderData: CreateOrderFormData) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      orderNumber: `ORD-2024-${String(orders.length + 1).padStart(3, '0')}`,
      customerName: orderData.customerName,
      customerCompany: orderData.customerCompany || undefined,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      amount: orderData.amount,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      receiptGenerated: true,
      assignedTo: orderData.assignedTo,
      source: orderData.source,
      tags: [],
      description: orderData.description,
      paymentMethod: orderData.paymentMethod,
      receiptNumber: `RCP-2024-${String(orders.length + 1).padStart(3, '0')}`,
      notes: orderData.notes || undefined
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    
    // Save to localStorage
    localStorage.setItem('orders_data', JSON.stringify(updatedOrders));
    
    setShowCreateModal(false);
    toast.success(`Order ${newOrder.orderNumber} created successfully!`);
  };

  const handleGenerateReceipt = (order: Order) => {
    if (!order.receiptGenerated) {
      // Generate receipt for the first time
      const updatedOrder = {
        ...order,
        receiptGenerated: true,
        receiptNumber: order.receiptNumber || `RCP-2024-${String(Date.now()).slice(-3)}`
      };
      
      const updatedOrders = orders.map(o => o.id === order.id ? updatedOrder : o);
      setOrders(updatedOrders);
      localStorage.setItem('orders_data', JSON.stringify(updatedOrders));
      
      downloadReceipt(updatedOrder);
      toast.success('Receipt generated and downloaded!');
    } else {
      // Download existing receipt
      downloadReceipt(order);
    }
  };

  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.status === 'completed').length,
    pending: orders.filter(o => o.status === 'pending').length,
    totalValue: orders.reduce((sum, o) => sum + o.amount, 0),
    avgOrderSize: orders.length > 0 ? orders.reduce((sum, o) => sum + o.amount, 0) / orders.length : 0,
    thisMonth: orders.filter(o => new Date(o.date) > new Date(Date.now() - 30*24*60*60*1000)).length
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-yellow-400/30 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Orders & Receipts</h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage customer orders and payment receipts
          </p>
        </div>
        <button 
          onClick={handleCreateOrder}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Order
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Orders</p>
                <p className="text-2xl font-bold text-slate-50">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Completed</p>
                <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Value</p>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Avg Order Size</p>
                <p className="text-2xl font-bold text-purple-400">{formatCurrency(stats.avgOrderSize)}</p>
              </div>
              <Target className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">This Month</p>
                <p className="text-2xl font-bold text-orange-400">{stats.thisMonth}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-yellow-400/30">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg w-full text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-yellow-400/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50 border-b border-yellow-400/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Agent</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Receipt</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yellow-400/20">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-slate-50">{order.orderNumber}</p>
                        <p className="text-xs text-slate-400">Source: {order.source}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-slate-50">{order.customerName}</p>
                        {order.customerCompany && (
                          <p className="text-xs text-slate-400">{order.customerCompany}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm text-slate-50">{order.customerEmail}</p>
                        <p className="text-xs text-slate-400">{order.customerPhone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-green-400">{formatCurrency(order.amount)}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-slate-50">{new Date(order.date).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm text-slate-50">{order.assignedTo}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {order.status === 'completed' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.receiptGenerated ? (
                        <button 
                          onClick={() => downloadReceipt(order)}
                          className="inline-flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs"
                          title="Download Receipt"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleGenerateReceipt(order)}
                          className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs"
                          title="Generate Receipt"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Generate
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-400 hover:text-blue-300"
                          title="View Order"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300"
                          title="Edit Order"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-red-400 hover:text-red-300"
                          title="Delete Order"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-slate-500 mb-4" />
            <h3 className="text-lg font-medium text-slate-50 mb-2">No orders found</h3>
            <p className="text-sm text-slate-400 mb-4">
              {searchTerm ? 'Try adjusting your search criteria' : 'Create your first order to get started'}
            </p>
            <button 
              onClick={handleCreateOrder}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Order
            </button>
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveOrder}
      />
    </div>
  );
};