import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useReports } from '../../hooks/useReports';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';
import Card from '../../components/UI/Card';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';
import { Plus, FileText, Calendar, Search, Download, Eye, Trash2 } from 'lucide-react';

interface ReportFormData {
  title: string;
  type: 'pdf' | 'text';
  content?: string;
  file?: FileList;
}

const NoticeBoardPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { reports, isLoading, isCreating, createReport, deleteReport } = useReports();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ReportFormData>();

  const watchType = watch('type');

  const onSubmit = async (data: ReportFormData) => {
    try {
      await createReport({
        title: data.title,
        type: data.type,
        content: data.type === 'text' ? data.content : undefined,
      });
      reset();
      setShowForm(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleDeleteReport = deleteReport;

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.keywords.some(keyword => keyword.includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || report.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const typeOptions = [
    { value: 'pdf', label: 'PDF Document' },
    { value: 'text', label: 'Text Report' },
  ];

  const filterOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'pdf', label: 'PDF Only' },
    { value: 'text', label: 'Text Only' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
        <div>
          <h1 className="text-4xl font-bold mb-2">Notice Board</h1>
          <p className="text-blue-100 text-lg">Manage weekly reports and important documents</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setShowForm(!showForm)}
            variant="secondary"
            className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Report</span>
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 text-black">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reports by title or keywords..."
                className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-black"
              />
            </div>
          </div>
          <div className="w-full md:w-auto">
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={filterOptions}
            />
          </div>
        </div>
      </Card>

      {/* Upload Form */}
      {showForm && (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-emerald-500 to-black text-black">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">Upload New Report</h2>
            <Button
              onClick={() => setShowForm(false)}
              variant="secondary"
              size="sm"
            >
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Report Title"
                {...register('title', { required: 'Title is required' })}
                error={errors.title?.message}
                placeholder="Enter report title"
              />

              <Select
                label="Report Type"
                {...register('type', { required: 'Type is required' })}
                error={errors.type?.message}
                options={typeOptions}
              />
            </div>

            {watchType === 'text' && (
              <div>
                <label className="block text-sm font-medium text-black mb-1 ">
                  Report Content
                </label>
                <textarea
                  {...register('content', { required: 'Content is required for text reports' })}
                  rows={6}
                  className="block w-full rounded-lg border-gray-300 bg-white text-black placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-4"
                  placeholder="Enter your report content here..."
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                )}
              </div>
            )}

            {watchType === 'pdf' && (
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Upload PDF File
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  {...register('file', { required: 'File is required for PDF reports' })}
                  className="block w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-800 hover:file:bg-blue-200"
                />
                {errors.file && (
                  <p className="mt-1 text-sm text-red-600">{errors.file.message}</p>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <Button 
                type="submit" 
                variant="primary" 
                loading={isCreating}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
              >
                Upload Report
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Reports Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" className="text-indigo-600" />
          <span className="ml-3 text-black">Loading reports...</span>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <Card key={report.id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50 text-black">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  report.type === 'pdf' ? 'bg-red-500/30' : 'bg-blue-500/30'
                }`}>
                  <FileText className="w-5 h-5 text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-black truncate">
                    {report.title}
                  </h3>
                  <p className="text-sm text-black capitalize">{report.type} Report</p>
                </div>
              </div>
              <button
                onClick={() => handleDeleteReport(report.id)}
                className="text-black hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-2 text-sm text-black mb-4">
              <Calendar className="w-4 h-4 text-black" />
              <span>{new Date(report.upload_date).toLocaleDateString()}</span>
            </div>

            {report.type === 'text' && report.content && (
              <p className="text-sm text-black mb-4 line-clamp-3">
                {report.content}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {report.keywords.slice(0, 3).map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-200 text-black text-xs rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Button size="sm" variant="secondary" className="flex-1">
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              {report.type === 'pdf' && (
                <Button size="sm" variant="primary" className="flex-1">
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
      )}

      {filteredReports.length === 0 && (
        <Card className="text-center py-12 shadow-lg border-0 bg-white text-black">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-black" />
          </div>
          <h3 className="text-lg font-medium text-black">No reports found</h3>
          <p className="text-black">
            {searchTerm || filterType !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Upload your first report to get started'
            }
          </p>
        </Card>
      )}
    </div>
  );
};

export default NoticeBoardPage;