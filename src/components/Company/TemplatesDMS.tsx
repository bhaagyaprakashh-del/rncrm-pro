import React, { useState } from 'react';
import { FileText, Plus, Search, CreditCard as Edit3, Trash2, Download, Eye, Upload, Folder, File } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  type: 'contract' | 'letter' | 'form' | 'report' | 'certificate';
  category: string;
  description: string;
  fileSize: string;
  lastModified: string;
  createdBy: string;
  downloads: number;
  status: 'active' | 'draft' | 'archived';
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  category: string;
  tags: string[];
}

export const TemplatesDMS: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'documents'>('templates');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'contract' | 'letter' | 'form' | 'report' | 'certificate'>('all');

  const [templates] = useState<Template[]>([
    {
      id: '1',
      name: 'Chit Fund Agreement Template',
      type: 'contract',
      category: 'Legal Documents',
      description: 'Standard agreement template for chit fund subscribers',
      fileSize: '245 KB',
      lastModified: '2024-01-15',
      createdBy: 'Legal Team',
      downloads: 156,
      status: 'active'
    },
    {
      id: '2',
      name: 'Welcome Letter Template',
      type: 'letter',
      category: 'Communication',
      description: 'Welcome letter for new chit fund members',
      fileSize: '89 KB',
      lastModified: '2024-01-10',
      createdBy: 'HR Team',
      downloads: 89,
      status: 'active'
    },
    {
      id: '3',
      name: 'KYC Form Template',
      type: 'form',
      category: 'Compliance',
      description: 'Know Your Customer form for new subscribers',
      fileSize: '156 KB',
      lastModified: '2024-01-08',
      createdBy: 'Compliance Team',
      downloads: 234,
      status: 'active'
    },
    {
      id: '4',
      name: 'Monthly Report Template',
      type: 'report',
      category: 'Reports',
      description: 'Monthly performance and financial report template',
      fileSize: '312 KB',
      lastModified: '2024-01-05',
      createdBy: 'Finance Team',
      downloads: 67,
      status: 'active'
    },
    {
      id: '5',
      name: 'Completion Certificate',
      type: 'certificate',
      category: 'Certificates',
      description: 'Certificate issued upon successful completion of chit fund',
      fileSize: '198 KB',
      lastModified: '2023-12-28',
      createdBy: 'Operations Team',
      downloads: 45,
      status: 'draft'
    }
  ]);

  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Company Registration Certificate',
      type: 'PDF',
      size: '2.3 MB',
      uploadedBy: 'Admin',
      uploadedAt: '2024-01-15',
      category: 'Legal',
      tags: ['registration', 'legal', 'company']
    },
    {
      id: '2',
      name: 'RBI Guidelines 2024',
      type: 'PDF',
      size: '5.7 MB',
      uploadedBy: 'Compliance Team',
      uploadedAt: '2024-01-12',
      category: 'Compliance',
      tags: ['rbi', 'guidelines', 'compliance']
    },
    {
      id: '3',
      name: 'Audit Report Q4 2023',
      type: 'PDF',
      size: '1.8 MB',
      uploadedBy: 'Finance Team',
      uploadedAt: '2024-01-10',
      category: 'Financial',
      tags: ['audit', 'financial', 'q4']
    },
    {
      id: '4',
      name: 'Employee Handbook',
      type: 'PDF',
      size: '3.2 MB',
      uploadedBy: 'HR Team',
      uploadedAt: '2024-01-08',
      category: 'HR',
      tags: ['handbook', 'employees', 'policies']
    }
  ]);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || template.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const filteredDocuments = documents.filter(doc => {
    return doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
           doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contract': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'letter': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'form': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'report': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'certificate': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'draft': return 'bg-orange-500/20 text-orange-400';
      case 'archived': return 'bg-slate-500/20 text-slate-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Templates & Document Management</h1>
          <p className="text-slate-400 mt-1">Manage document templates and file storage</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-600/50 transition-colors">
            <Upload className="h-4 w-4" />
            Upload Document
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors font-medium">
            <Plus className="h-4 w-4" />
            Create Template
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-1">
        <div className="flex">
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'templates'
                ? 'bg-yellow-500 text-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'documents'
                ? 'bg-yellow-500 text-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Documents
          </button>
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
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
          </div>
          
          {activeTab === 'templates' && (
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="all">All Types</option>
              <option value="contract">Contract</option>
              <option value="letter">Letter</option>
              <option value="form">Form</option>
              <option value="report">Report</option>
              <option value="certificate">Certificate</option>
            </select>
          )}
        </div>
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                    <p className="text-slate-400 text-sm">{template.category}</p>
                  </div>
                </div>
                
                <span className={`px-2 py-1 rounded-full text-xs border ${getTypeColor(template.type)}`}>
                  {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                </span>
              </div>

              <p className="text-slate-300 text-sm mb-4">{template.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">File Size</span>
                    <span className="text-white">{template.fileSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Downloads</span>
                    <span className="text-white">{template.downloads}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Modified</span>
                    <span className="text-white">{template.lastModified}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Created By</span>
                    <span className="text-white">{template.createdBy}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(template.status)}`}>
                  {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                </span>

                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
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
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDocuments.map((document) => (
            <div key={document.id} className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-700/50 rounded-lg flex items-center justify-center">
                    <File className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{document.name}</h3>
                    <p className="text-slate-400 text-sm">{document.category}</p>
                  </div>
                </div>
                
                <span className="px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {document.type}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {document.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Size</span>
                    <span className="text-white">{document.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Uploaded By</span>
                    <span className="text-white">{document.uploadedBy}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Uploaded</span>
                    <span className="text-white">{document.uploadedAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-700/50">
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                  <Download className="h-4 w-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                  <Edit3 className="h-4 w-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {((activeTab === 'templates' && filteredTemplates.length === 0) || 
        (activeTab === 'documents' && filteredDocuments.length === 0)) && (
        <div className="text-center py-12">
          {activeTab === 'templates' ? (
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          ) : (
            <Folder className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          )}
          <h3 className="text-lg font-medium text-white mb-2">
            No {activeTab} found
          </h3>
          <p className="text-slate-400">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};