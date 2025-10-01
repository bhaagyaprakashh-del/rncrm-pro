import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Eye, CheckSquare, Clock, Users, Calendar, QrCode, Download, Upload, MoreVertical, User, Building, CheckCircle, XCircle, AlertTriangle, Star, Target, Award, TrendingUp, Activity, MapPin, Smartphone, Wifi, Monitor, Camera, Scan, LogIn, LogOut, Timer, Zap, Shield, Bell } from 'lucide-react';
import { getEmployees, initializeEmployeesData } from '../../data/employees.mock';
import { Employee } from '../../types/hrms';
import toast from 'react-hot-toast';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  breakTime: number; // in minutes
  workHours: number;
  overtimeHours: number;
  status: 'present' | 'absent' | 'half-day' | 'on-leave' | 'holiday';
  attendanceType: 'regular' | 'overtime' | 'night-shift' | 'weekend';
  location?: string;
  ipAddress?: string;
  deviceInfo?: string;
  qrCodeUsed: boolean;
  kioskId?: string;
  approvalStatus: 'auto-approved' | 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  isRegularized: boolean;
  regularizationReason?: string;
  regularizedBy?: string;
  regularizedAt?: string;
  notes?: string;
}

// Generate realistic attendance records for employees
const generateAttendanceRecords = (employees: Employee[]): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  
  // Generate records for last 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    employees.forEach((employee, empIndex) => {
      // Skip weekends for some variety
      if (date.getDay() === 0 || date.getDay() === 6) {
        if (Math.random() > 0.3) return; // 30% chance of weekend work
      }
      
      // Generate realistic attendance patterns
      const isPresent = Math.random() > 0.1; // 90% attendance rate
      const isOnLeave = Math.random() > 0.95; // 5% leave probability
      const isHalfDay = Math.random() > 0.9; // 10% half day probability
      
      let status: AttendanceRecord['status'] = 'present';
      let checkIn = '';
      let checkOut = '';
      let workHours = 0;
      let overtimeHours = 0;
      
      if (isOnLeave) {
        status = 'on-leave';
      } else if (!isPresent) {
        status = 'absent';
      } else if (isHalfDay) {
        status = 'half-day';
        checkIn = '09:30';
        checkOut = '13:30';
        workHours = 3.5;
      } else {
        status = 'present';
        // Random check-in between 8:30 and 9:30
        const checkInHour = 8 + Math.random();
        const checkInMinutes = Math.floor(checkInHour * 60);
        checkIn = `${Math.floor(checkInMinutes / 60).toString().padStart(2, '0')}:${(checkInMinutes % 60).toString().padStart(2, '0')}`;
        
        // Random check-out between 17:30 and 19:00
        const checkOutHour = 17.5 + Math.random() * 1.5;
        const checkOutMinutes = Math.floor(checkOutHour * 60);
        checkOut = `${Math.floor(checkOutMinutes / 60).toString().padStart(2, '0')}:${(checkOutMinutes % 60).toString().padStart(2, '0')}`;
        
        // Calculate work hours
        const checkInTime = new Date(`2024-01-01T${checkIn}:00`);
        const checkOutTime = new Date(`2024-01-01T${checkOut}:00`);
        const totalMinutes = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60);
        const breakTime = 45 + Math.random() * 30; // 45-75 minutes break
        workHours = Math.round(((totalMinutes - breakTime) / 60) * 100) / 100;
        
        // Calculate overtime
        if (workHours > 8) {
          overtimeHours = Math.round((workHours - 8) * 100) / 100;
        }
      }
      
      const record: AttendanceRecord = {
        id: `att_${employee.id}_${dateString}`,
        employeeId: employee.id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        date: dateString,
        checkIn: checkIn || undefined,
        checkOut: checkOut || undefined,
        breakTime: status === 'present' || status === 'half-day' ? 45 + Math.random() * 30 : 0,
        workHours,
        overtimeHours,
        status,
        attendanceType: overtimeHours > 0 ? 'overtime' : 'regular',
        location: employee.branch,
        ipAddress: `192.168.${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 200) + 100}`,
        deviceInfo: ['Mobile App - Android', 'QR Scanner - Kiosk', 'Web Portal - Chrome'][Math.floor(Math.random() * 3)],
        qrCodeUsed: Math.random() > 0.2, // 80% QR code usage
        kioskId: `KIOSK_${employee.branch?.replace(/\s+/g, '_').toUpperCase()}_01`,
        approvalStatus: status === 'on-leave' || isHalfDay ? 'pending' : 'auto-approved',
        approvedBy: status === 'on-leave' ? employee.reportingManager : undefined,
        approvedAt: status === 'on-leave' ? new Date(date.getTime() - 24 * 60 * 60 * 1000).toISOString() : undefined,
        isRegularized: isHalfDay,
        regularizationReason: isHalfDay ? 'Medical appointment' : undefined,
        regularizedBy: isHalfDay ? employee.reportingManager : undefined,
        regularizedAt: isHalfDay ? new Date().toISOString() : undefined,
        notes: status === 'on-leave' ? 'Approved leave' : isHalfDay ? 'Half day for medical appointment' : undefined
      };
      
      records.push(record);
    });
  }
  
  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const AttendanceCard: React.FC<{ record: AttendanceRecord; employees: Employee[]; onQRCheckIn: (employee: Employee) => void; onQRCheckOut: (employee: Employee) => void; }> = React.memo(({ record, employees, onQRCheckIn, onQRCheckOut }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200';
      case 'absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'half-day': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'on-leave': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'holiday': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getApprovalColor = (status: string) => {
    switch (status) {
      case 'auto-approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDeviceIcon = (deviceInfo: string) => {
    if (deviceInfo?.includes('Mobile')) return Smartphone;
    if (deviceInfo?.includes('Kiosk')) return Monitor;
    if (deviceInfo?.includes('Web')) return Wifi;
    return Monitor;
  };

  const DeviceIcon = getDeviceIcon(record.deviceInfo || '');

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30 hover:border-yellow-400/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-slate-600/50 rounded-full flex items-center justify-center text-slate-50 font-semibold border border-yellow-400/30">
            {record.employeeName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-50">{record.employeeName}</h3>
            <p className="text-sm text-slate-400">{new Date(record.date).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
            {record.status.replace('-', ' ').toUpperCase()}
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getApprovalColor(record.approvalStatus)}`}>
            {record.approvalStatus.replace('-', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Check In</span>
            <span className="text-slate-50 font-medium">{record.checkIn || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Check Out</span>
            <span className="text-slate-50 font-medium">{record.checkOut || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Work Hours</span>
            <span className="text-green-400 font-medium">{record.workHours}h</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Break Time</span>
            <span className="text-slate-50">{record.breakTime}m</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Overtime</span>
            <span className="text-orange-400 font-medium">{record.overtimeHours}h</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">QR Code</span>
            <span className={record.qrCodeUsed ? 'text-green-400' : 'text-red-400'}>
              {record.qrCodeUsed ? 'Used' : 'Manual'}
            </span>
          </div>
        </div>
      </div>

      {record.location && (
        <div className="mb-4 p-3 bg-slate-700/30 rounded-xl border border-yellow-400/20">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span className="text-slate-300 text-sm">{record.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <DeviceIcon className="h-4 w-4 text-slate-400" />
            <span className="text-slate-400 text-xs">{record.deviceInfo}</span>
          </div>
        </div>
      )}

      {record.isRegularized && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-400 font-medium">Regularized</p>
          <p className="text-xs text-yellow-300">{record.regularizationReason}</p>
          {record.regularizedBy && (
            <p className="text-xs text-slate-400 mt-1">By {record.regularizedBy}</p>
          )}
        </div>
      )}

      {record.notes && (
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-400">{record.notes}</p>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-yellow-400/20">
        <div className="flex items-center text-xs text-slate-500">
          <Activity className="h-3 w-3 mr-1" />
          <span>{record.attendanceType.replace('-', ' ')}</span>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all">
            <Eye className="h-4 w-4" />
          </button>
          <button 
            onClick={() => {
              const employee = employees.find(e => e.id === record.employeeId);
              if (employee) onQRCheckIn(employee);
            }}
            className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all"
            title="QR Check-In"
          >
            <LogIn className="h-4 w-4" />
          </button>
          <button 
            onClick={() => {
              const employee = employees.find(e => e.id === record.employeeId);
              if (employee) onQRCheckOut(employee);
            }}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="QR Check-Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
          {record.approvalStatus === 'pending' && (
            <>
              <button className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all">
                <CheckCircle className="h-4 w-4" />
              </button>
              <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export const AttendanceLogs: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    initializeEmployeesData();
    return getEmployees();
  });
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    // Load from localStorage or generate sample data
    const saved = localStorage.getItem('attendance_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Failed to load attendance records:', error);
        return [];
      }
    }
    return [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterApproval, setFilterApproval] = useState<string>('all');
  const [filterBranch, setFilterBranch] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [qrScanMode, setQrScanMode] = useState<'checkin' | 'checkout'>('checkin');
  const [selectedEmployeeForQR, setSelectedEmployeeForQR] = useState<Employee | null>(null);

  // Load employees and generate attendance records
  React.useEffect(() => {
    const loadedEmployees = getEmployees();
    console.log('AttendanceLogs: Loaded employees:', loadedEmployees.length);
    setEmployees(loadedEmployees);
    
    // Only set generated records if no records exist in localStorage
    const saved = localStorage.getItem('attendance_records');
    if (!saved) {
      const generatedRecords = generateAttendanceRecords(loadedEmployees);
      console.log('AttendanceLogs: Generated attendance records:', generatedRecords.length);
      setAttendanceRecords(generatedRecords);
      localStorage.setItem('attendance_records', JSON.stringify(generatedRecords));
    }
  }, []);

  // Listen for employee updates
  React.useEffect(() => {
    const handleEmployeeUpdate = () => {
      console.log('AttendanceLogs: Employee data updated, refreshing...');
      const updatedEmployees = getEmployees();
      console.log('AttendanceLogs: Updated employees count:', updatedEmployees.length);
      setEmployees(updatedEmployees);
      
      // Only regenerate if no custom records exist
      const saved = localStorage.getItem('attendance_records');
      if (!saved) {
        const updatedRecords = generateAttendanceRecords(updatedEmployees);
        setAttendanceRecords(updatedRecords);
        localStorage.setItem('attendance_records', JSON.stringify(updatedRecords));
      }
    };

    window.addEventListener('employeesUpdated', handleEmployeeUpdate);
    window.addEventListener('employeeDataChanged', handleEmployeeUpdate);
    window.addEventListener('storage', handleEmployeeUpdate);
    
    return () => {
      window.removeEventListener('employeesUpdated', handleEmployeeUpdate);
      window.removeEventListener('employeeDataChanged', handleEmployeeUpdate);
      window.removeEventListener('storage', handleEmployeeUpdate);
    };
  }, []);

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter(record => {
      const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
      const matchesApproval = filterApproval === 'all' || record.approvalStatus === filterApproval;
      const matchesDate = record.date === selectedDate;
      
      // Get employee to check branch
      const employee = employees.find(e => e.id === record.employeeId);
      const matchesBranch = filterBranch === 'all' || employee?.branch === filterBranch;
      
      return matchesSearch && matchesStatus && matchesApproval && matchesDate && matchesBranch;
    });
  }, [attendanceRecords, employees, searchTerm, filterStatus, filterApproval, filterBranch, selectedDate]);

  const stats = useMemo(() => ({
    totalRecords: attendanceRecords.length,
    present: attendanceRecords.filter(r => r.status === 'present').length,
    absent: attendanceRecords.filter(r => r.status === 'absent').length,
    halfDay: attendanceRecords.filter(r => r.status === 'half-day').length,
    onLeave: attendanceRecords.filter(r => r.status === 'on-leave').length,
    pending: attendanceRecords.filter(r => r.approvalStatus === 'pending').length,
    approved: attendanceRecords.filter(r => r.approvalStatus === 'approved' || r.approvalStatus === 'auto-approved').length,
    rejected: attendanceRecords.filter(r => r.approvalStatus === 'rejected').length,
    qrCodeUsed: attendanceRecords.filter(r => r.qrCodeUsed).length,
    regularized: attendanceRecords.filter(r => r.isRegularized).length,
    totalWorkHours: attendanceRecords.reduce((sum, r) => sum + r.workHours, 0),
    totalOvertimeHours: attendanceRecords.reduce((sum, r) => sum + r.overtimeHours, 0)
  }), [attendanceRecords]);

  const uniqueBranches = useMemo(() => [...new Set(employees.map(e => e.branch).filter(Boolean))], [employees]);

  const handleQRCheckIn = (employee: Employee) => {
    setSelectedEmployeeForQR(employee);
    setQrScanMode('checkin');
    setShowQRScanner(true);
  };

  const handleQRCheckOut = (employee: Employee) => {
    setSelectedEmployeeForQR(employee);
    setQrScanMode('checkout');
    setShowQRScanner(true);
  };

  const processQRAttendance = () => {
    if (!selectedEmployeeForQR) return;

    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);
    const dateString = now.toISOString().split('T')[0];

    const newRecord: AttendanceRecord = {
      id: `att_${selectedEmployeeForQR.id}_${dateString}_${qrScanMode}_${Date.now()}`,
      employeeId: selectedEmployeeForQR.id,
      employeeName: `${selectedEmployeeForQR.firstName} ${selectedEmployeeForQR.lastName}`,
      date: dateString,
      checkIn: qrScanMode === 'checkin' ? timeString : undefined,
      checkOut: qrScanMode === 'checkout' ? timeString : undefined,
      breakTime: 0,
      workHours: qrScanMode === 'checkout' ? 8 : 0,
      overtimeHours: 0,
      status: 'present',
      attendanceType: 'regular',
      location: selectedEmployeeForQR.branch,
      ipAddress: '192.168.1.100',
      deviceInfo: 'QR Scanner - Mobile App',
      qrCodeUsed: true,
      kioskId: `KIOSK_${selectedEmployeeForQR.branch?.replace(/\s+/g, '_').toUpperCase()}_01`,
      approvalStatus: 'auto-approved',
      isRegularized: false
    };

    const updatedRecords = [newRecord, ...attendanceRecords];
    setAttendanceRecords(updatedRecords);
    localStorage.setItem('attendance_records', JSON.stringify(updatedRecords));
    
    setShowQRScanner(false);
    setSelectedEmployeeForQR(null);
    
    toast.success(`${qrScanMode === 'checkin' ? 'Check-in' : 'Check-out'} recorded for ${selectedEmployeeForQR.firstName} ${selectedEmployeeForQR.lastName}`);
  };

  const QRScannerModal = () => {
    if (!showQRScanner || !selectedEmployeeForQR) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowQRScanner(false)}
        ></div>
        
        {/* Modal */}
        <div className="relative bg-slate-800/90 backdrop-blur-xl border border-yellow-400/40 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-400/30">
                <QrCode className="h-10 w-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-50 mb-2">
                QR Code {qrScanMode === 'checkin' ? 'Check-In' : 'Check-Out'}
              </h3>
              <p className="text-slate-400">
                {selectedEmployeeForQR.firstName} {selectedEmployeeForQR.lastName}
              </p>
              <p className="text-slate-500 text-sm">{selectedEmployeeForQR.employeeId}</p>
            </div>

            {/* QR Code Display */}
            <div className="mb-6 p-6 bg-white rounded-xl border-2 border-dashed border-yellow-400/30">
              <div className="w-32 h-32 mx-auto bg-slate-900 rounded-lg flex items-center justify-center">
                <div className="grid grid-cols-8 gap-1">
                  {[...Array(64)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1 h-1 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                    ></div>
                  ))}
                </div>
              </div>
              <p className="text-slate-600 text-xs mt-2">
                QR Code for {qrScanMode === 'checkin' ? 'Check-In' : 'Check-Out'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={processQRAttendance}
                className={`w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white transition-all ${
                  qrScanMode === 'checkin' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {qrScanMode === 'checkin' ? <LogIn className="h-4 w-4 mr-2" /> : <LogOut className="h-4 w-4 mr-2" />}
                Confirm {qrScanMode === 'checkin' ? 'Check-In' : 'Check-Out'}
              </button>
              
              <button
                onClick={() => setShowQRScanner(false)}
                className="w-full px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 border border-yellow-400/30 rounded-lg hover:bg-slate-700 transition-all backdrop-blur-sm"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-blue-400 text-xs">
                <Shield className="inline h-3 w-3 mr-1" />
                Secure QR attendance with location and device tracking
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-yellow-400/30 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-50">Attendance Logs & Approvals</h1>
          <p className="mt-1 text-sm text-slate-400">
            QR code based attendance system with automated tracking and approval workflows
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowQRScanner(true)}
            className="inline-flex items-center px-4 py-2 border border-green-400/30 text-sm font-medium rounded-lg text-green-400 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm"
          >
            <Camera className="h-4 w-4 mr-2" />
            QR Scanner
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-yellow-400/30 text-sm font-medium rounded-lg text-slate-50 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-yellow-400/30 text-sm font-medium rounded-lg text-slate-50 bg-slate-700/50 hover:bg-slate-700 transition-all backdrop-blur-sm">
            <QrCode className="h-4 w-4 mr-2" />
            Generate QR Code
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Manual Entry
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-none">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-4">
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Records</p>
                <p className="text-2xl font-bold text-slate-50">{stats.totalRecords}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Present</p>
                <p className="text-2xl font-bold text-green-400">{stats.present}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Absent</p>
                <p className="text-2xl font-bold text-red-400">{stats.absent}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Half Day</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.halfDay}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">On Leave</p>
                <p className="text-2xl font-bold text-blue-400">{stats.onLeave}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Approved</p>
                <p className="text-2xl font-bold text-green-400">{stats.approved}</p>
              </div>
              <Award className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">QR Scans</p>
                <p className="text-2xl font-bold text-purple-400">{stats.qrCodeUsed}</p>
              </div>
              <QrCode className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Regularized</p>
                <p className="text-2xl font-bold text-orange-400">{stats.regularized}</p>
              </div>
              <Star className="h-8 w-8 text-orange-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Work Hours</p>
                <p className="text-2xl font-bold text-emerald-400">{stats.totalWorkHours}h</p>
              </div>
              <Clock className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Overtime</p>
                <p className="text-2xl font-bold text-indigo-400">{stats.totalOvertimeHours}h</p>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-400" />
            </div>
          </div>
          <div className="bg-slate-800/40 backdrop-blur-xl p-4 rounded-xl border border-yellow-400/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Rejected</p>
                <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl p-4 border border-yellow-400/30">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg w-full text-slate-50 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
              />
            </div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
            >
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="half-day">Half Day</option>
              <option value="on-leave">On Leave</option>
              <option value="holiday">Holiday</option>
            </select>
            <select
              value={filterApproval}
              onChange={(e) => setFilterApproval(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
            >
              <option value="all">All Approvals</option>
              <option value="auto-approved">Auto Approved</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="px-3 py-2 bg-slate-700/50 border border-yellow-400/30 rounded-lg text-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 backdrop-blur-sm"
            >
              <option value="all">All Branches</option>
              {uniqueBranches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
            <div className="text-sm text-slate-400">
              Showing: <span className="font-semibold text-slate-50">{filteredRecords.length}</span> records
            </div>
          </div>
        </div>

        {/* Attendance Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRecords.map((record) => (
            <AttendanceCard 
              key={record.id} 
              record={record} 
              employees={employees}
              onQRCheckIn={handleQRCheckIn}
              onQRCheckOut={handleQRCheckOut}
            />
          ))}
        </div>

        {/* Attendance Table */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-yellow-400/30 overflow-hidden">
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-slate-700/50 border-b border-yellow-400/20 sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Check In/Out</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Hours</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Approval</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-yellow-400/20">
                {filteredRecords.map((record) => {
                  const employee = employees.find(e => e.id === record.employeeId);
                  return (
                    <tr key={record.id} className="hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-slate-600/50 rounded-full flex items-center justify-center text-slate-50 font-medium border border-yellow-400/30">
                            {record.employeeName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-50">{record.employeeName}</p>
                            <p className="text-xs text-slate-400">{employee?.branch || 'Unknown Branch'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-slate-50">{new Date(record.date).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm text-slate-50">{record.checkIn || 'N/A'} - {record.checkOut || 'N/A'}</p>
                          {record.qrCodeUsed && (
                            <p className="text-xs text-green-400">QR Code Used</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm text-slate-50">{record.workHours}h</p>
                          {record.overtimeHours > 0 && (
                            <p className="text-xs text-orange-400">+{record.overtimeHours}h OT</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {record.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getApprovalColor(record.approvalStatus)}`}>
                          {record.approvalStatus.replace('-', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-400 hover:text-blue-300">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const employee = employees.find(emp => emp.id === record.employeeId);
                              if (employee) handleQRCheckIn(employee);
                            }}
                            className="text-green-400 hover:text-green-300"
                            title="QR Check-In"
                          >
                            <LogIn className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              const employee = employees.find(emp => emp.id === record.employeeId);
                              if (employee) handleQRCheckOut(employee);
                            }}
                            className="text-red-400 hover:text-red-300"
                            title="QR Check-Out"
                          >
                            <LogOut className="h-4 w-4" />
                          </button>
                          {record.approvalStatus === 'pending' && (
                            <>
                              <button className="text-green-400 hover:text-green-300">
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button className="text-red-400 hover:text-red-300">
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <CheckSquare className="h-12 w-12 mx-auto text-slate-500 mb-4" />
            <h3 className="text-lg font-medium text-slate-50 mb-2">No attendance records found</h3>
            <p className="text-sm text-slate-400">Try adjusting your search criteria or date filter.</p>
          </div>
        )}

        {/* QR Scanner Modal */}
        <QRScannerModal />
      </div>
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'present': return 'bg-green-100 text-green-800 border-green-200';
    case 'absent': return 'bg-red-100 text-red-800 border-red-200';
    case 'half-day': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'on-leave': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'holiday': return 'bg-purple-100 text-purple-800 border-purple-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getApprovalColor = (status: string) => {
  switch (status) {
    case 'auto-approved': return 'bg-green-100 text-green-800 border-green-200';
    case 'approved': return 'bg-green-100 text-green-800 border-green-200';
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};