import React, { useState } from 'react';
import { Package, Plus, Search, CreditCard as Edit3, Trash2, DollarSign, Calendar, Users, TrendingUp } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  code: string;
  description: string;
  type: 'chit_fund' | 'savings' | 'loan' | 'investment';
  duration: number; // in months
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  commissionRate: number;
  status: 'active' | 'inactive' | 'draft';
  subscriberCount: number;
  totalValue: number;
}

export const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'chit_fund' | 'savings' | 'loan' | 'investment'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'draft'>('all');

  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Premium Chit Fund',
      code: 'PCF001',
      description: 'High-value chit fund scheme for premium customers',
      type: 'chit_fund',
      duration: 24,
      minAmount: 100000,
      maxAmount: 1000000,
      interestRate: 12.5,
      commissionRate: 5.0,
      status: 'active',
      subscriberCount: 45,
      totalValue: 15000000
    },
    {
      id: '2',
      name: 'Standard Chit Fund',
      code: 'SCF002',
      description: 'Regular chit fund scheme for middle-class families',
      type: 'chit_fund',
      duration: 20,
      minAmount: 25000,
      maxAmount: 200000,
      interestRate: 11.0,
      commissionRate: 4.5,
      status: 'active',
      subscriberCount: 120,
      totalValue: 8500000
    },
    {
      id: '3',
      name: 'Quick Chit Fund',
      code: 'QCF003',
      description: 'Short-term chit fund for quick returns',
      type: 'chit_fund',
      duration: 12,
      minAmount: 10000,
      maxAmount: 100000,
      interestRate: 10.0,
      commissionRate: 4.0,
      status: 'active',
      subscriberCount: 85,
      totalValue: 3200000
    },
    {
      id: '4',
      name: 'Gold Savings Scheme',
      code: 'GSS004',
      description: 'Gold-backed savings scheme with guaranteed returns',
      type: 'savings',
      duration: 36,
      minAmount: 5000,
      maxAmount: 500000,
      interestRate: 8.5,
      commissionRate: 2.0,
      status: 'active',
      subscriberCount: 200,
      totalValue: 12000000
    },
    {
      id: '5',
      name: 'Business Loan Scheme',
      code: 'BLS005',
      description: 'Loan scheme for small business owners',
      type: 'loan',
      duration: 60,
      minAmount: 50000,
      maxAmount: 2000000,
      interestRate: 15.0,
      commissionRate: 3.0,
      status: 'active',
      subscriberCount: 35,
      totalValue: 18000000
    },
    {
      id: '6',
      name: 'Education Investment Plan',
      code: 'EIP006',
      description: 'Long-term investment plan for education funding',
      type: 'investment',
      duration: 120,
      minAmount: 20000,
      maxAmount: 1000000,
      interestRate: 13.5,
      commissionRate: 2.5,
      status: 'draft',
      subscriberCount: 0,
      totalValue: 0
    }
  ]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || product.type === filterType;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'chit_fund': return 'Chit Fund';
      case 'savings': return 'Savings';
      case 'loan': return 'Loan';
      case 'investment': return 'Investment';
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'chit_fund': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'savings': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'loan': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'investment': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'inactive': return 'bg-red-500/20 text-red-400';
      case 'draft': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    draft: products.filter(p => p.status === 'draft').length,
    totalSubscribers: products.reduce((sum, p) => sum + p.subscriberCount, 0),
    totalValue: products.reduce((sum, p) => sum + p.totalValue, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Products (Chit Schemes)</h1>
          <p className="text-slate-400 mt-1">Manage your financial products and schemes</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          Create Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <Package className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Products</p>
              <p className="text-2xl font-bold text-green-400">{stats.active}</p>
            </div>
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Draft Products</p>
              <p className="text-2xl font-bold text-orange-400">{stats.draft}</p>
            </div>
            <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Subscribers</p>
              <p className="text-2xl font-bold text-white">{stats.totalSubscribers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Value</p>
              <p className="text-lg font-bold text-white">{formatCurrency(stats.totalValue)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="all">All Types</option>
              <option value="chit_fund">Chit Fund</option>
              <option value="savings">Savings</option>
              <option value="loan">Loan</option>
              <option value="investment">Investment</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                  <p className="text-slate-400 text-sm">Code: {product.code}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs border ${getTypeColor(product.type)}`}>
                  {getTypeLabel(product.type)}
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-sm mb-4">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Duration</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    <span className="text-white text-sm">{product.duration} months</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Min Amount</span>
                  <span className="text-white text-sm">{formatCurrency(product.minAmount)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Interest Rate</span>
                  <span className="text-green-400 text-sm font-medium">{product.interestRate}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Subscribers</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-slate-400" />
                    <span className="text-white text-sm">{product.subscriberCount}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Max Amount</span>
                  <span className="text-white text-sm">{formatCurrency(product.maxAmount)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Commission</span>
                  <span className="text-yellow-400 text-sm font-medium">{product.commissionRate}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(product.status)}`}>
                  {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                </span>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-300 text-sm">{formatCurrency(product.totalValue)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No products found</h3>
          <p className="text-slate-400">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};