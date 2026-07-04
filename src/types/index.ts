export type Role = "super_admin" | "school_owner" | "principal" | "teacher" | "student" | "parent" | "accountant" | "registrar";
export type Lang = "en" | "am";

export interface School {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  establishedYear: number;
  status: "active" | "inactive";
  subscriptionPlan: "basic" | "standard" | "premium";
  subscriptionExpiry: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  schoolId: string;
  phone?: string;
  photo?: string;
  status: "active" | "inactive" | "suspended";
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  schoolId: string;
  name: string;
  studentId: string;
  grade: string;
  section: string;
  gender: "M" | "F";
  dob: string;
  phone: string;
  address: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  photo: string;
  enrollmentDate: string;
  status: "active" | "inactive" | "graduated" | "transferred";
  gpa: number;
  attendance: number;
  bloodGroup: string;
  religion?: string;
  nationality?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  id: string;
  schoolId: string;
  name: string;
  employeeId: string;
  subject: string;
  classes: string[];
  phone: string;
  email: string;
  photo: string;
  hireDate: string;
  salary: number;
  status: "active" | "on_leave" | "inactive";
  qualification: string;
  experience: number;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  id: string;
  schoolId: string;
  name: string;
  grade: string;
  sections: string[];
  students: number;
  homeroom: string;
  academicYear: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  schoolId: string;
  name: string;
  code: string;
  teacher: string;
  teacherId: string;
  periods: number;
  grades: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Fee {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  grade: string;
  feeType: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: "paid" | "pending" | "overdue" | "partial";
  paidAmount: number;
  academicYear: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  schoolId: string;
  title: string;
  body: string;
  audience: string[];
  postedBy: string;
  postedAt: string;
  priority: "high" | "medium" | "low";
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  markedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExamResult {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  subject: string;
  subjectId: string;
  examType: string;
  score: number;
  maxScore: number;
  grade: string;
  gpa: number;
  academicYear: string;
  term: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimetableEntry {
  id: string;
  schoolId: string;
  classId: string;
  className: string;
  subject: string;
  subjectId: string;
  teacher: string;
  teacherId: string;
  day: string;
  period: number;
  startTime: string;
  endTime: string;
  room?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Homework {
  id: string;
  schoolId: string;
  classId: string;
  className: string;
  subject: string;
  subjectId: string;
  title: string;
  description: string;
  dueDate: string;
  assignedBy: string;
  attachments?: string[];
  status: "active" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  schoolId: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  receiverId: string;
  receiverName: string;
  subject: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  schoolId: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  schoolId: string;
  feeId: string;
  studentId: string;
  amount: number;
  paymentMethod: "cash" | "bank_transfer" | "mobile_money" | "check";
  receiptNumber: string;
  processedBy: string;
  createdAt: string;
}

export interface Payroll {
  id: string;
  schoolId: string;
  teacherId: string;
  teacherName: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  month: string;
  year: number;
  status: "pending" | "processed" | "paid";
  processedBy?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryBook {
  id: string;
  schoolId: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  quantity: number;
  available: number;
  location: string;
  status: "available" | "borrowed" | "reserved";
  createdAt: string;
  updatedAt: string;
}

export interface BookLoan {
  id: string;
  schoolId: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string;
  status: "borrowed" | "returned" | "overdue";
  createdAt: string;
}

export interface TransportRoute {
  id: string;
  schoolId: string;
  name: string;
  driver: string;
  driverPhone: string;
  vehicleNumber: string;
  stops: string[];
  capacity: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface TransportAssignment {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  routeId: string;
  routeName: string;
  pickupStop: string;
  dropStop: string;
  createdAt: string;
}

export interface DisciplineRecord {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  type: "warning" | "suspension" | "expulsion" | "detention";
  reason: string;
  action: string;
  reportedBy: string;
  date: string;
  parentNotified: boolean;
  status: "pending" | "resolved" | "appealed";
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  type: "academic" | "sports" | "cultural" | "meeting" | "holiday" | "exam";
  startDate: string;
  endDate: string;
  venue?: string;
  audience: string[];
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  schoolId: string;
  studentId: string;
  studentName: string;
  type: "completion" | "achievement" | "character" | "transfer";
  issueDate: string;
  certificateNumber: string;
  details: string;
  status: "pending" | "issued" | "collected";
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  schoolId: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  location: string;
  status: "available" | "low_stock" | "out_of_stock";
  lastPurchase?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  schoolId: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}

export interface Setting {
  id: string;
  schoolId: string;
  key: string;
  value: string;
  category: string;
  updatedAt: string;
}
