import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import type {
  School,
  Student,
  Teacher,
  Class,
  Subject,
  Fee,
  Announcement,
  AttendanceRecord,
  ExamResult,
  TimetableEntry,
  Homework,
  Message,
  Notification,
  Payment,
  Payroll,
  LibraryBook,
  BookLoan,
  TransportRoute,
  TransportAssignment,
  DisciplineRecord,
  Event,
  Certificate,
  InventoryItem,
  AuditLog,
  User,
} from '../types';

interface FirestoreContextType {
  currentSchool: School | null;
  currentUser: User | null;
  loading: boolean;
  error: string | null;

  setCurrentSchool: (school: School | null) => void;
  setCurrentUser: (user: User | null) => void;

  // School operations
  getSchools: () => Promise<School[]>;
  getSchool: (id: string) => Promise<School | null>;
  createSchool: (data: Omit<School, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateSchool: (id: string, data: Partial<School>) => Promise<void>;
  deleteSchool: (id: string) => Promise<void>;

  // Student operations
  getStudents: (schoolId: string) => Promise<Student[]>;
  getStudent: (id: string) => Promise<Student | null>;
  createStudent: (data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateStudent: (id: string, data: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  searchStudents: (schoolId: string, term: string) => Promise<Student[]>;

  // Teacher operations
  getTeachers: (schoolId: string) => Promise<Teacher[]>;
  getTeacher: (id: string) => Promise<Teacher | null>;
  createTeacher: (data: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateTeacher: (id: string, data: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;

  // Class operations
  getClasses: (schoolId: string) => Promise<Class[]>;
  getClass: (id: string) => Promise<Class | null>;
  createClass: (data: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateClass: (id: string, data: Partial<Class>) => Promise<void>;
  deleteClass: (id: string) => Promise<void>;

  // Subject operations
  getSubjects: (schoolId: string) => Promise<Subject[]>;
  getSubject: (id: string) => Promise<Subject | null>;
  createSubject: (data: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateSubject: (id: string, data: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;

  // Fee operations
  getFees: (schoolId: string) => Promise<Fee[]>;
  getFee: (id: string) => Promise<Fee | null>;
  createFee: (data: Omit<Fee, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateFee: (id: string, data: Partial<Fee>) => Promise<void>;
  deleteFee: (id: string) => Promise<void>;
  getStudentFees: (studentId: string) => Promise<Fee[]>;

  // Announcement operations
  getAnnouncements: (schoolId: string) => Promise<Announcement[]>;
  getAnnouncement: (id: string) => Promise<Announcement | null>;
  createAnnouncement: (data: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateAnnouncement: (id: string, data: Partial<Announcement>) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;

  // Attendance operations
  getAttendance: (schoolId: string, date?: string) => Promise<AttendanceRecord[]>;
  getStudentAttendance: (studentId: string) => Promise<AttendanceRecord[]>;
  markAttendance: (data: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateAttendance: (id: string, data: Partial<AttendanceRecord>) => Promise<void>;
  bulkMarkAttendance: (records: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>[]) => Promise<void>;

  // Exam Result operations
  getExamResults: (schoolId: string) => Promise<ExamResult[]>;
  getStudentExamResults: (studentId: string) => Promise<ExamResult[]>;
  createExamResult: (data: Omit<ExamResult, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateExamResult: (id: string, data: Partial<ExamResult>) => Promise<void>;
  deleteExamResult: (id: string) => Promise<void>;

  // Timetable operations
  getTimetable: (schoolId: string, classId?: string) => Promise<TimetableEntry[]>;
  createTimetableEntry: (data: Omit<TimetableEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateTimetableEntry: (id: string, data: Partial<TimetableEntry>) => Promise<void>;
  deleteTimetableEntry: (id: string) => Promise<void>;

  // Homework operations
  getHomework: (schoolId: string, classId?: string) => Promise<Homework[]>;
  createHomework: (data: Omit<Homework, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateHomework: (id: string, data: Partial<Homework>) => Promise<void>;
  deleteHomework: (id: string) => Promise<void>;

  // Message operations
  getMessages: (userId: string) => Promise<Message[]>;
  sendMessage: (data: Omit<Message, 'id' | 'read' | 'createdAt'>) => Promise<string>;
  markMessageRead: (id: string) => Promise<void>;

  // Notification operations
  getNotifications: (userId: string) => Promise<Notification[]>;
  createNotification: (data: Omit<Notification, 'id' | 'read' | 'createdAt'>) => Promise<string>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: (userId: string) => Promise<void>;

  // Payment operations
  getPayments: (schoolId: string) => Promise<Payment[]>;
  getStudentPayments: (studentId: string) => Promise<Payment[]>;
  createPayment: (data: Omit<Payment, 'id' | 'createdAt'>) => Promise<string>;

  // Payroll operations
  getPayroll: (schoolId: string, month?: string, year?: number) => Promise<Payroll[]>;
  createPayroll: (data: Omit<Payroll, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updatePayroll: (id: string, data: Partial<Payroll>) => Promise<void>;

  // Library operations
  getLibraryBooks: (schoolId: string) => Promise<LibraryBook[]>;
  createLibraryBook: (data: Omit<LibraryBook, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateLibraryBook: (id: string, data: Partial<LibraryBook>) => Promise<void>;
  deleteLibraryBook: (id: string) => Promise<void>;
  getBookLoans: (schoolId: string) => Promise<BookLoan[]>;
  borrowBook: (data: Omit<BookLoan, 'id' | 'createdAt'>) => Promise<string>;
  returnBook: (id: string, returnedAt: string) => Promise<void>;

  // Transport operations
  getTransportRoutes: (schoolId: string) => Promise<TransportRoute[]>;
  createTransportRoute: (data: Omit<TransportRoute, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateTransportRoute: (id: string, data: Partial<TransportRoute>) => Promise<void>;
  deleteTransportRoute: (id: string) => Promise<void>;
  getTransportAssignments: (schoolId: string) => Promise<TransportAssignment[]>;
  assignTransport: (data: Omit<TransportAssignment, 'id' | 'createdAt'>) => Promise<string>;

  // Discipline operations
  getDisciplineRecords: (schoolId: string) => Promise<DisciplineRecord[]>;
  createDisciplineRecord: (data: Omit<DisciplineRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateDisciplineRecord: (id: string, data: Partial<DisciplineRecord>) => Promise<void>;

  // Event operations
  getEvents: (schoolId: string) => Promise<Event[]>;
  createEvent: (data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateEvent: (id: string, data: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  // Certificate operations
  getCertificates: (schoolId: string) => Promise<Certificate[]>;
  createCertificate: (data: Omit<Certificate, 'id' | 'createdAt'>) => Promise<string>;
  updateCertificate: (id: string, data: Partial<Certificate>) => Promise<void>;

  // Inventory operations
  getInventory: (schoolId: string) => Promise<InventoryItem[]>;
  createInventoryItem: (data: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateInventoryItem: (id: string, data: Partial<InventoryItem>) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;

  // Audit Log operations
  logAudit: (data: Omit<AuditLog, 'id' | 'createdAt'>) => Promise<void>;
  getAuditLogs: (schoolId: string, limitCount?: number) => Promise<AuditLog[]>;

  // User operations
  getUsers: (schoolId: string) => Promise<User[]>;
  getUser: (id: string) => Promise<User | null>;
  createUser: (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  // Utility
  generateId: () => string;
  formatDate: (timestamp: Timestamp | string | Date) => string;
  toTimestamp: (date: string | Date) => Timestamp;
}

const FirestoreContext = createContext<FirestoreContextType | null>(null);

export function FirestoreProvider({ children }: { children: React.ReactNode }) {
  const [currentSchool, setCurrentSchool] = useState<School | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = useCallback((timestamp: Timestamp | string | Date): string => {
    if (typeof timestamp === 'string') return timestamp;
    if (timestamp instanceof Date) return timestamp.toISOString().split('T')[0];
    return timestamp.toDate().toISOString().split('T')[0];
  }, []);

  const toTimestamp = useCallback((date: string | Date): Timestamp => {
    if (typeof date === 'string') {
      return Timestamp.fromDate(new Date(date));
    }
    return Timestamp.fromDate(date);
  }, []);

  const generateId = useCallback(() => {
    return doc(collection(db, '_')).id;
  }, []);

  // School operations
  const getSchools = useCallback(async (): Promise<School[]> => {
    try {
      const snapshot = await getDocs(collection(db, 'schools'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as School));
    } catch (err) {
      setError('Failed to fetch schools');
      throw err;
    }
  }, []);

  const getSchool = useCallback(async (id: string): Promise<School | null> => {
    try {
      const docRef = await getDoc(doc(db, 'schools', id));
      if (!docRef.exists()) return null;
      return { id: docRef.id, ...docRef.data() } as School;
    } catch (err) {
      setError('Failed to fetch school');
      throw err;
    }
  }, []);

  const createSchool = useCallback(async (data: Omit<School, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'schools'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to create school');
      throw err;
    }
  }, []);

  const updateSchool = useCallback(async (id: string, data: Partial<School>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'schools', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      setError('Failed to update school');
      throw err;
    }
  }, []);

  const deleteSchool = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'schools', id));
    } catch (err) {
      setError('Failed to delete school');
      throw err;
    }
  }, []);

  // Student operations
  const getStudents = useCallback(async (schoolId: string): Promise<Student[]> => {
    try {
      const q = query(
        collection(db, 'students'),
        where('schoolId', '==', schoolId),
        orderBy('name')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
    } catch (err) {
      setError('Failed to fetch students');
      throw err;
    }
  }, []);

  const getStudent = useCallback(async (id: string): Promise<Student | null> => {
    try {
      const docRef = await getDoc(doc(db, 'students', id));
      if (!docRef.exists()) return null;
      return { id: docRef.id, ...docRef.data() } as Student;
    } catch (err) {
      setError('Failed to fetch student');
      throw err;
    }
  }, []);

  const createStudent = useCallback(async (data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'students'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to create student');
      throw err;
    }
  }, []);

  const updateStudent = useCallback(async (id: string, data: Partial<Student>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'students', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      setError('Failed to update student');
      throw err;
    }
  }, []);

  const deleteStudent = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'students', id));
    } catch (err) {
      setError('Failed to delete student');
      throw err;
    }
  }, []);

  const searchStudents = useCallback(async (schoolId: string, term: string): Promise<Student[]> => {
    try {
      const q = query(
        collection(db, 'students'),
        where('schoolId', '==', schoolId),
        orderBy('name'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      const students = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
      const lowerTerm = term.toLowerCase();
      return students.filter(s =>
        s.name.toLowerCase().includes(lowerTerm) ||
        s.studentId.toLowerCase().includes(lowerTerm)
      );
    } catch (err) {
      setError('Failed to search students');
      throw err;
    }
  }, []);

  // Teacher operations
  const getTeachers = useCallback(async (schoolId: string): Promise<Teacher[]> => {
    try {
      const q = query(
        collection(db, 'teachers'),
        where('schoolId', '==', schoolId),
        orderBy('name')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Teacher));
    } catch (err) {
      setError('Failed to fetch teachers');
      throw err;
    }
  }, []);

  const getTeacher = useCallback(async (id: string): Promise<Teacher | null> => {
    try {
      const docRef = await getDoc(doc(db, 'teachers', id));
      if (!docRef.exists()) return null;
      return { id: docRef.id, ...docRef.data() } as Teacher;
    } catch (err) {
      setError('Failed to fetch teacher');
      throw err;
    }
  }, []);

  const createTeacher = useCallback(async (data: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'teachers'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to create teacher');
      throw err;
    }
  }, []);

  const updateTeacher = useCallback(async (id: string, data: Partial<Teacher>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'teachers', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      setError('Failed to update teacher');
      throw err;
    }
  }, []);

  const deleteTeacher = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'teachers', id));
    } catch (err) {
      setError('Failed to delete teacher');
      throw err;
    }
  }, []);

  // Class operations
  const getClasses = useCallback(async (schoolId: string): Promise<Class[]> => {
    try {
      const q = query(
        collection(db, 'classes'),
        where('schoolId', '==', schoolId),
        orderBy('grade')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Class));
    } catch (err) {
      setError('Failed to fetch classes');
      throw err;
    }
  }, []);

  const getClass = useCallback(async (id: string): Promise<Class | null> => {
    try {
      const docRef = await getDoc(doc(db, 'classes', id));
      if (!docRef.exists()) return null;
      return { id: docRef.id, ...docRef.data() } as Class;
    } catch (err) {
      setError('Failed to fetch class');
      throw err;
    }
  }, []);

  const createClass = useCallback(async (data: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'classes'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to create class');
      throw err;
    }
  }, []);

  const updateClass = useCallback(async (id: string, data: Partial<Class>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'classes', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      setError('Failed to update class');
      throw err;
    }
  }, []);

  const deleteClass = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'classes', id));
    } catch (err) {
      setError('Failed to delete class');
      throw err;
    }
  }, []);

  // Subject operations
  const getSubjects = useCallback(async (schoolId: string): Promise<Subject[]> => {
    try {
      const q = query(
        collection(db, 'subjects'),
        where('schoolId', '==', schoolId),
        orderBy('name')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Subject));
    } catch (err) {
      setError('Failed to fetch subjects');
      throw err;
    }
  }, []);

  const getSubject = useCallback(async (id: string): Promise<Subject | null> => {
    try {
      const docRef = await getDoc(doc(db, 'subjects', id));
      if (!docRef.exists()) return null;
      return { id: docRef.id, ...docRef.data() } as Subject;
    } catch (err) {
      setError('Failed to fetch subject');
      throw err;
    }
  }, []);

  const createSubject = useCallback(async (data: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'subjects'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to create subject');
      throw err;
    }
  }, []);

  const updateSubject = useCallback(async (id: string, data: Partial<Subject>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'subjects', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      setError('Failed to update subject');
      throw err;
    }
  }, []);

  const deleteSubject = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'subjects', id));
    } catch (err) {
      setError('Failed to delete subject');
      throw err;
    }
  }, []);

  // Fee operations
  const getFees = useCallback(async (schoolId: string): Promise<Fee[]> => {
    try {
      const q = query(
        collection(db, 'fees'),
        where('schoolId', '==', schoolId),
        orderBy('dueDate', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Fee));
    } catch (err) {
      setError('Failed to fetch fees');
      throw err;
    }
  }, []);

  const getFee = useCallback(async (id: string): Promise<Fee | null> => {
    try {
      const docRef = await getDoc(doc(db, 'fees', id));
      if (!docRef.exists()) return null;
      return { id: docRef.id, ...docRef.data() } as Fee;
    } catch (err) {
      setError('Failed to fetch fee');
      throw err;
    }
  }, []);

  const createFee = useCallback(async (data: Omit<Fee, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'fees'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to create fee');
      throw err;
    }
  }, []);

  const updateFee = useCallback(async (id: string, data: Partial<Fee>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'fees', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      setError('Failed to update fee');
      throw err;
    }
  }, []);

  const deleteFee = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'fees', id));
    } catch (err) {
      setError('Failed to delete fee');
      throw err;
    }
  }, []);

  const getStudentFees = useCallback(async (studentId: string): Promise<Fee[]> => {
    try {
      const q = query(
        collection(db, 'fees'),
        where('studentId', '==', studentId),
        orderBy('dueDate', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Fee));
    } catch (err) {
      setError('Failed to fetch student fees');
      throw err;
    }
  }, []);

  // Announcement operations
  const getAnnouncements = useCallback(async (schoolId: string): Promise<Announcement[]> => {
    try {
      const q = query(
        collection(db, 'announcements'),
        where('schoolId', '==', schoolId),
        orderBy('postedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement));
    } catch (err) {
      setError('Failed to fetch announcements');
      throw err;
    }
  }, []);

  const getAnnouncement = useCallback(async (id: string): Promise<Announcement | null> => {
    try {
      const docRef = await getDoc(doc(db, 'announcements', id));
      if (!docRef.exists()) return null;
      return { id: docRef.id, ...docRef.data() } as Announcement;
    } catch (err) {
      setError('Failed to fetch announcement');
      throw err;
    }
  }, []);

  const createAnnouncement = useCallback(async (data: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'announcements'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to create announcement');
      throw err;
    }
  }, []);

  const updateAnnouncement = useCallback(async (id: string, data: Partial<Announcement>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'announcements', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      setError('Failed to update announcement');
      throw err;
    }
  }, []);

  const deleteAnnouncement = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'announcements', id));
    } catch (err) {
      setError('Failed to delete announcement');
      throw err;
    }
  }, []);

  // Attendance operations
  const getAttendance = useCallback(async (schoolId: string, date?: string): Promise<AttendanceRecord[]> => {
    try {
      let q = query(
        collection(db, 'attendance'),
        where('schoolId', '==', schoolId),
        orderBy('date', 'desc'),
        limit(500)
      );
      const snapshot = await getDocs(q);
      let records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AttendanceRecord));
      if (date) {
        records = records.filter(r => r.date === date);
      }
      return records;
    } catch (err) {
      setError('Failed to fetch attendance');
      throw err;
    }
  }, []);

  const getStudentAttendance = useCallback(async (studentId: string): Promise<AttendanceRecord[]> => {
    try {
      const q = query(
        collection(db, 'attendance'),
        where('studentId', '==', studentId),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AttendanceRecord));
    } catch (err) {
      setError('Failed to fetch student attendance');
      throw err;
    }
  }, []);

  const markAttendance = useCallback(async (data: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'attendance'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to mark attendance');
      throw err;
    }
  }, []);

  const updateAttendance = useCallback(async (id: string, data: Partial<AttendanceRecord>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'attendance', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      setError('Failed to update attendance');
      throw err;
    }
  }, []);

  const bulkMarkAttendance = useCallback(async (records: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<void> => {
    try {
      const batch = writeBatch(db);
      records.forEach(record => {
        const ref = doc(collection(db, 'attendance'));
        batch.set(ref, {
          ...record,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
    } catch (err) {
      setError('Failed to bulk mark attendance');
      throw err;
    }
  }, []);

  // Exam Result operations
  const getExamResults = useCallback(async (schoolId: string): Promise<ExamResult[]> => {
    try {
      const q = query(
        collection(db, 'examResults'),
        where('schoolId', '==', schoolId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExamResult));
    } catch (err) {
      setError('Failed to fetch exam results');
      throw err;
    }
  }, []);

  const getStudentExamResults = useCallback(async (studentId: string): Promise<ExamResult[]> => {
    try {
      const q = query(
        collection(db, 'examResults'),
        where('studentId', '==', studentId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExamResult));
    } catch (err) {
      setError('Failed to fetch student exam results');
      throw err;
    }
  }, []);

  const createExamResult = useCallback(async (data: Omit<ExamResult, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'examResults'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to create exam result');
      throw err;
    }
  }, []);

  const updateExamResult = useCallback(async (id: string, data: Partial<ExamResult>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'examResults', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      setError('Failed to update exam result');
      throw err;
    }
  }, []);

  const deleteExamResult = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'examResults', id));
    } catch (err) {
      setError('Failed to delete exam result');
      throw err;
    }
  }, []);

  // Timetable operations
  const getTimetable = useCallback(async (schoolId: string, classId?: string): Promise<TimetableEntry[]> => {
    try {
      let q = query(
        collection(db, 'timetable'),
        where('schoolId', '==', schoolId),
        orderBy('day'),
        orderBy('period')
      );
      const snapshot = await getDocs(q);
      let entries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TimetableEntry));
      if (classId) {
        entries = entries.filter(e => e.classId === classId);
      }
      return entries;
    } catch (err) {
      setError('Failed to fetch timetable');
      throw err;
    }
  }, []);

  const createTimetableEntry = useCallback(async (data: Omit<TimetableEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'timetable'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to create timetable entry');
      throw err;
    }
  }, []);

  const updateTimetableEntry = useCallback(async (id: string, data: Partial<TimetableEntry>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'timetable', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      setError('Failed to update timetable entry');
      throw err;
    }
  }, []);

  const deleteTimetableEntry = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'timetable', id));
    } catch (err) {
      setError('Failed to delete timetable entry');
      throw err;
    }
  }, []);

  // Homework operations
  const getHomework = useCallback(async (schoolId: string, classId?: string): Promise<Homework[]> => {
    try {
      const q = query(
        collection(db, 'homework'),
        where('schoolId', '==', schoolId),
        orderBy('dueDate', 'desc')
      );
      const snapshot = await getDocs(q);
      let homework = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Homework));
      if (classId) {
        homework = homework.filter(h => h.classId === classId);
      }
      return homework;
    } catch (err) {
      setError('Failed to fetch homework');
      throw err;
    }
  }, []);

  const createHomework = useCallback(async (data: Omit<Homework, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'homework'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to create homework');
      throw err;
    }
  }, []);

  const updateHomework = useCallback(async (id: string, data: Partial<Homework>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'homework', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      setError('Failed to update homework');
      throw err;
    }
  }, []);

  const deleteHomework = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'homework', id));
    } catch (err) {
      setError('Failed to delete homework');
      throw err;
    }
  }, []);

  // Message operations
  const getMessages = useCallback(async (userId: string): Promise<Message[]> => {
    try {
      const q = query(
        collection(db, 'messages'),
        where('receiverId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
    } catch (err) {
      setError('Failed to fetch messages');
      throw err;
    }
  }, []);

  const sendMessage = useCallback(async (data: Omit<Message, 'id' | 'read' | 'createdAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'messages'), {
        ...data,
        read: false,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to send message');
      throw err;
    }
  }, []);

  const markMessageRead = useCallback(async (id: string): Promise<void> => {
    try {
      await updateDoc(doc(db, 'messages', id), { read: true });
    } catch (err) {
      setError('Failed to mark message as read');
      throw err;
    }
  }, []);

  // Notification operations
  const getNotifications = useCallback(async (userId: string): Promise<Notification[]> => {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
    } catch (err) {
      setError('Failed to fetch notifications');
      throw err;
    }
  }, []);

  const createNotification = useCallback(async (data: Omit<Notification, 'id' | 'read' | 'createdAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'notifications'), {
        ...data,
        read: false,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to create notification');
      throw err;
    }
  }, []);

  const markNotificationRead = useCallback(async (id: string): Promise<void> => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (err) {
      setError('Failed to mark notification as read');
      throw err;
    }
  }, []);

  const markAllNotificationsRead = useCallback(async (userId: string): Promise<void> => {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('read', '==', false)
      );
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { read: true });
      });
      await batch.commit();
    } catch (err) {
      setError('Failed to mark all notifications as read');
      throw err;
    }
  }, []);

  // Payment operations
  const getPayments = useCallback(async (schoolId: string): Promise<Payment[]> => {
    try {
      const q = query(
        collection(db, 'payments'),
        where('schoolId', '==', schoolId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
    } catch (err) {
      setError('Failed to fetch payments');
      throw err;
    }
  }, []);

  const getStudentPayments = useCallback(async (studentId: string): Promise<Payment[]> => {
    try {
      const q = query(
        collection(db, 'payments'),
        where('studentId', '==', studentId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payment));
    } catch (err) {
      setError('Failed to fetch student payments');
      throw err;
    }
  }, []);

  const createPayment = useCallback(async (data: Omit<Payment, 'id' | 'createdAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'payments'), {
        ...data,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to create payment');
      throw err;
    }
  }, []);

  // Payroll operations
  const getPayroll = useCallback(async (schoolId: string, month?: string, year?: number): Promise<Payroll[]> => {
    try {
      let q = query(
        collection(db, 'payroll'),
        where('schoolId', '==', schoolId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      let payroll = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Payroll));
      if (month && year) {
        payroll = payroll.filter(p => p.month === month && p.year === year);
      }
      return payroll;
    } catch (err) {
      setError('Failed to fetch payroll');
      throw err;
    }
  }, []);

  const createPayroll = useCallback(async (data: Omit<Payroll, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'payroll'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to create payroll');
      throw err;
    }
  }, []);

  const updatePayroll = useCallback(async (id: string, data: Partial<Payroll>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'payroll', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      setError('Failed to update payroll');
      throw err;
    }
  }, []);

  // Library operations
  const getLibraryBooks = useCallback(async (schoolId: string): Promise<LibraryBook[]> => {
    try {
      const q = query(
        collection(db, 'libraryBooks'),
        where('schoolId', '==', schoolId),
        orderBy('title')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LibraryBook));
    } catch (err) {
      setError('Failed to fetch library books');
      throw err;
    }
  }, []);

  const createLibraryBook = useCallback(async (data: Omit<LibraryBook, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'libraryBooks'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to create library book');
      throw err;
    }
  }, []);

  const updateLibraryBook = useCallback(async (id: string, data: Partial<LibraryBook>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'libraryBooks', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      setError('Failed to update library book');
      throw err;
    }
  }, []);

  const deleteLibraryBook = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'libraryBooks', id));
    } catch (err) {
      setError('Failed to delete library book');
      throw err;
    }
  }, []);

  const getBookLoans = useCallback(async (schoolId: string): Promise<BookLoan[]> => {
    try {
      const q = query(
        collection(db, 'bookLoans'),
        where('schoolId', '==', schoolId),
        orderBy('borrowedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BookLoan));
    } catch (err) {
      setError('Failed to fetch book loans');
      throw err;
    }
  }, []);

  const borrowBook = useCallback(async (data: Omit<BookLoan, 'id' | 'createdAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'bookLoans'), {
        ...data,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to borrow book');
      throw err;
    }
  }, []);

  const returnBook = useCallback(async (id: string, returnedAt: string): Promise<void> => {
    try {
      await updateDoc(doc(db, 'bookLoans', id), {
        returnedAt,
        status: 'returned'
      });
    } catch (err) {
      setError('Failed to return book');
      throw err;
    }
  }, []);

  // Transport operations
  const getTransportRoutes = useCallback(async (schoolId: string): Promise<TransportRoute[]> => {
    try {
      const q = query(
        collection(db, 'transportRoutes'),
        where('schoolId', '==', schoolId),
        orderBy('name')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TransportRoute));
    } catch (err) {
      setError('Failed to fetch transport routes');
      throw err;
    }
  }, []);

  const createTransportRoute = useCallback(async (data: Omit<TransportRoute, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'transportRoutes'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to create transport route');
      throw err;
    }
  }, []);

  const updateTransportRoute = useCallback(async (id: string, data: Partial<TransportRoute>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'transportRoutes', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      setError('Failed to update transport route');
      throw err;
    }
  }, []);

  const deleteTransportRoute = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'transportRoutes', id));
    } catch (err) {
      setError('Failed to delete transport route');
      throw err;
    }
  }, []);

  const getTransportAssignments = useCallback(async (schoolId: string): Promise<TransportAssignment[]> => {
    try {
      const q = query(
        collection(db, 'transportAssignments'),
        where('schoolId', '==', schoolId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TransportAssignment));
    } catch (err) {
      setError('Failed to fetch transport assignments');
      throw err;
    }
  }, []);

  const assignTransport = useCallback(async (data: Omit<TransportAssignment, 'id' | 'createdAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'transportAssignments'), {
        ...data,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to assign transport');
      throw err;
    }
  }, []);

  // Discipline operations
  const getDisciplineRecords = useCallback(async (schoolId: string): Promise<DisciplineRecord[]> => {
    try {
      const q = query(
        collection(db, 'discipline'),
        where('schoolId', '==', schoolId),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DisciplineRecord));
    } catch (err) {
      setError('Failed to fetch discipline records');
      throw err;
    }
  }, []);

  const createDisciplineRecord = useCallback(async (data: Omit<DisciplineRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'discipline'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to create discipline record');
      throw err;
    }
  }, []);

  const updateDisciplineRecord = useCallback(async (id: string, data: Partial<DisciplineRecord>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'discipline', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      setError('Failed to update discipline record');
      throw err;
    }
  }, []);

  // Event operations
  const getEvents = useCallback(async (schoolId: string): Promise<Event[]> => {
    try {
      const q = query(
        collection(db, 'events'),
        where('schoolId', '==', schoolId),
        orderBy('startDate', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
    } catch (err) {
      setError('Failed to fetch events');
      throw err;
    }
  }, []);

  const createEvent = useCallback(async (data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'events'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to create event');
      throw err;
    }
  }, []);

  const updateEvent = useCallback(async (id: string, data: Partial<Event>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'events', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      setError('Failed to update event');
      throw err;
    }
  }, []);

  const deleteEvent = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'events', id));
    } catch (err) {
      setError('Failed to delete event');
      throw err;
    }
  }, []);

  // Certificate operations
  const getCertificates = useCallback(async (schoolId: string): Promise<Certificate[]> => {
    try {
      const q = query(
        collection(db, 'certificates'),
        where('schoolId', '==', schoolId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Certificate));
    } catch (err) {
      setError('Failed to fetch certificates');
      throw err;
    }
  }, []);

  const createCertificate = useCallback(async (data: Omit<Certificate, 'id' | 'createdAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'certificates'), {
        ...data,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to create certificate');
      throw err;
    }
  }, []);

  const updateCertificate = useCallback(async (id: string, data: Partial<Certificate>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'certificates', id), data);
    } catch (err) {
      setError('Failed to update certificate');
      throw err;
    }
  }, []);

  // Inventory operations
  const getInventory = useCallback(async (schoolId: string): Promise<InventoryItem[]> => {
    try {
      const q = query(
        collection(db, 'inventory'),
        where('schoolId', '==', schoolId),
        orderBy('name')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));
    } catch (err) {
      setError('Failed to fetch inventory');
      throw err;
    }
  }, []);

  const createInventoryItem = useCallback(async (data: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'inventory'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to create inventory item');
      throw err;
    }
  }, []);

  const updateInventoryItem = useCallback(async (id: string, data: Partial<InventoryItem>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'inventory', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      setError('Failed to update inventory item');
      throw err;
    }
  }, []);

  const deleteInventoryItem = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'inventory', id));
    } catch (err) {
      setError('Failed to delete inventory item');
      throw err;
    }
  }, []);

  // Audit Log operations
  const logAudit = useCallback(async (data: Omit<AuditLog, 'id' | 'createdAt'>): Promise<void> => {
    try {
      await addDoc(collection(db, 'auditLogs'), {
        ...data,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Failed to log audit:', err);
    }
  }, []);

  const getAuditLogs = useCallback(async (schoolId: string, limitCount = 100): Promise<AuditLog[]> => {
    try {
      const q = query(
        collection(db, 'auditLogs'),
        where('schoolId', '==', schoolId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditLog));
    } catch (err) {
      setError('Failed to fetch audit logs');
      throw err;
    }
  }, []);

  // User operations
  const getUsers = useCallback(async (schoolId: string): Promise<User[]> => {
    try {
      const q = query(
        collection(db, 'users'),
        where('schoolId', '==', schoolId),
        orderBy('name')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    } catch (err) {
      setError('Failed to fetch users');
      throw err;
    }
  }, []);

  const getUser = useCallback(async (id: string): Promise<User | null> => {
    try {
      const docRef = await getDoc(doc(db, 'users', id));
      if (!docRef.exists()) return null;
      return { id: docRef.id, ...docRef.data() } as User;
    } catch (err) {
      setError('Failed to fetch user');
      throw err;
    }
  }, []);

  const createUser = useCallback(async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      setError('Failed to create user');
      throw err;
    }
  }, []);

  const updateUser = useCallback(async (id: string, data: Partial<User>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'users', id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      setError('Failed to update user');
      throw err;
    }
  }, []);

  const deleteUser = useCallback(async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'users', id));
    } catch (err) {
      setError('Failed to delete user');
      throw err;
    }
  }, []);

  const value: FirestoreContextType = {
    currentSchool,
    currentUser,
    loading,
    error,
    setCurrentSchool,
    setCurrentUser,

    getSchools,
    getSchool,
    createSchool,
    updateSchool,
    deleteSchool,

    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    searchStudents,

    getTeachers,
    getTeacher,
    createTeacher,
    updateTeacher,
    deleteTeacher,

    getClasses,
    getClass,
    createClass,
    updateClass,
    deleteClass,

    getSubjects,
    getSubject,
    createSubject,
    updateSubject,
    deleteSubject,

    getFees,
    getFee,
    createFee,
    updateFee,
    deleteFee,
    getStudentFees,

    getAnnouncements,
    getAnnouncement,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,

    getAttendance,
    getStudentAttendance,
    markAttendance,
    updateAttendance,
    bulkMarkAttendance,

    getExamResults,
    getStudentExamResults,
    createExamResult,
    updateExamResult,
    deleteExamResult,

    getTimetable,
    createTimetableEntry,
    updateTimetableEntry,
    deleteTimetableEntry,

    getHomework,
    createHomework,
    updateHomework,
    deleteHomework,

    getMessages,
    sendMessage,
    markMessageRead,

    getNotifications,
    createNotification,
    markNotificationRead,
    markAllNotificationsRead,

    getPayments,
    getStudentPayments,
    createPayment,

    getPayroll,
    createPayroll,
    updatePayroll,

    getLibraryBooks,
    createLibraryBook,
    updateLibraryBook,
    deleteLibraryBook,
    getBookLoans,
    borrowBook,
    returnBook,

    getTransportRoutes,
    createTransportRoute,
    updateTransportRoute,
    deleteTransportRoute,
    getTransportAssignments,
    assignTransport,

    getDisciplineRecords,
    createDisciplineRecord,
    updateDisciplineRecord,

    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,

    getCertificates,
    createCertificate,
    updateCertificate,

    getInventory,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,

    logAudit,
    getAuditLogs,

    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,

    generateId,
    formatDate,
    toTimestamp,
  };

  return (
    <FirestoreContext.Provider value={value}>
      {children}
    </FirestoreContext.Provider>
  );
}

export function useFirestore() {
  const context = useContext(FirestoreContext);
  if (!context) {
    throw new Error('useFirestore must be used within a FirestoreProvider');
  }
  return context;
}

export { FirestoreContext };
