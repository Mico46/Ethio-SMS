import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from '../lib/FirestoreContext';
import type {
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
  Event,
  LibraryBook,
  TransportRoute,
  DisciplineRecord,
  InventoryItem,
  User,
} from '../types';

export function useStudents(schoolId: string | null) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getStudents, createStudent, updateStudent, deleteStudent } = useFirestore();

  const fetchStudents = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getStudents(schoolId);
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }, [schoolId, getStudents]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const add = useCallback(async (data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = await createStudent(data);
    await fetchStudents();
    return id;
  }, [createStudent, fetchStudents]);

  const edit = useCallback(async (id: string, data: Partial<Student>) => {
    await updateStudent(id, data);
    await fetchStudents();
  }, [updateStudent, fetchStudents]);

  const remove = useCallback(async (id: string) => {
    await deleteStudent(id);
    await fetchStudents();
  }, [deleteStudent, fetchStudents]);

  return { students, loading, error, refetch: fetchStudents, add, edit, remove };
}

export function useTeachers(schoolId: string | null) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getTeachers, createTeacher, updateTeacher, deleteTeacher } = useFirestore();

  const fetchTeachers = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getTeachers(schoolId);
      setTeachers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  }, [schoolId, getTeachers]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const add = useCallback(async (data: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = await createTeacher(data);
    await fetchTeachers();
    return id;
  }, [createTeacher, fetchTeachers]);

  const edit = useCallback(async (id: string, data: Partial<Teacher>) => {
    await updateTeacher(id, data);
    await fetchTeachers();
  }, [updateTeacher, fetchTeachers]);

  const remove = useCallback(async (id: string) => {
    await deleteTeacher(id);
    await fetchTeachers();
  }, [deleteTeacher, fetchTeachers]);

  return { teachers, loading, error, refetch: fetchTeachers, add, edit, remove };
}

export function useClasses(schoolId: string | null) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getClasses, createClass, updateClass, deleteClass } = useFirestore();

  const fetchClasses = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getClasses(schoolId);
      setClasses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  }, [schoolId, getClasses]);

  useEffect(() => {
    fetchClasses();
  }, [fetchTeachers]);

  const add = useCallback(async (data: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = await createClass(data);
    await fetchClasses();
    return id;
  }, [createClass, fetchClasses]);

  const edit = useCallback(async (id: string, data: Partial<Class>) => {
    await updateClass(id, data);
    await fetchClasses();
  }, [updateClass, fetchClasses]);

  const remove = useCallback(async (id: string) => {
    await deleteClass(id);
    await fetchClasses();
  }, [deleteClass, fetchClasses]);

  return { classes, loading, error, refetch: fetchClasses, add, edit, remove };
}

export function useSubjects(schoolId: string | null) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getSubjects, createSubject, updateSubject, deleteSubject } = useFirestore();

  const fetchSubjects = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getSubjects(schoolId);
      setSubjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  }, [schoolId, getSubjects]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const add = useCallback(async (data: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = await createSubject(data);
    await fetchSubjects();
    return id;
  }, [createSubject, fetchSubjects]);

  const edit = useCallback(async (id: string, data: Partial<Subject>) => {
    await updateSubject(id, data);
    await fetchSubjects();
  }, [updateSubject, fetchSubjects]);

  const remove = useCallback(async (id: string) => {
    await deleteSubject(id);
    await fetchSubjects();
  }, [deleteSubject, fetchSubjects]);

  return { subjects, loading, error, refetch: fetchSubjects, add, edit, remove };
}

export function useFees(schoolId: string | null) {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getFees, createFee, updateFee, deleteFee } = useFirestore();

  const fetchFees = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getFees(schoolId);
      setFees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch fees');
    } finally {
      setLoading(false);
    }
  }, [schoolId, getFees]);

  useEffect(() => {
    fetchFees();
  }, [fetchFees]);

  const add = useCallback(async (data: Omit<Fee, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = await createFee(data);
    await fetchFees();
    return id;
  }, [createFee, fetchFees]);

  const edit = useCallback(async (id: string, data: Partial<Fee>) => {
    await updateFee(id, data);
    await fetchFees();
  }, [updateFee, fetchFees]);

  const remove = useCallback(async (id: string) => {
    await deleteFee(id);
    await fetchFees();
  }, [deleteFee, fetchFees]);

  return { fees, loading, error, refetch: fetchFees, add, edit, remove };
}

export function useAnnouncements(schoolId: string | null) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useFirestore();

  const fetchAnnouncements = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getAnnouncements(schoolId);
      setAnnouncements(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  }, [schoolId, getAnnouncements]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const add = useCallback(async (data: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = await createAnnouncement(data);
    await fetchAnnouncements();
    return id;
  }, [createAnnouncement, fetchAnnouncements]);

  const edit = useCallback(async (id: string, data: Partial<Announcement>) => {
    await updateAnnouncement(id, data);
    await fetchAnnouncements();
  }, [updateAnnouncement, fetchAnnouncements]);

  const remove = useCallback(async (id: string) => {
    await deleteAnnouncement(id);
    await fetchAnnouncements();
  }, [deleteAnnouncement, fetchAnnouncements]);

  return { announcements, loading, error, refetch: fetchAnnouncements, add, edit, remove };
}

export function useAttendance(schoolId: string | null, date?: string) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getAttendance, markAttendance, updateAttendance, bulkMarkAttendance } = useFirestore();

  const fetchAttendance = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getAttendance(schoolId, date);
      setAttendance(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  }, [schoolId, date, getAttendance]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const mark = useCallback(async (data: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    await markAttendance(data);
    await fetchAttendance();
  }, [markAttendance, fetchAttendance]);

  const edit = useCallback(async (id: string, data: Partial<AttendanceRecord>) => {
    await updateAttendance(id, data);
    await fetchAttendance();
  }, [updateAttendance, fetchAttendance]);

  const bulkMark = useCallback(async (records: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>[]) => {
    await bulkMarkAttendance(records);
    await fetchAttendance();
  }, [bulkMarkAttendance, fetchAttendance]);

  return { attendance, loading, error, refetch: fetchAttendance, mark, edit, bulkMark };
}

export function useExamResults(schoolId: string | null) {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getExamResults, createExamResult, updateExamResult, deleteExamResult } = useFirestore();

  const fetchResults = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getExamResults(schoolId);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exam results');
    } finally {
      setLoading(false);
    }
  }, [schoolId, getExamResults]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const add = useCallback(async (data: Omit<ExamResult, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = await createExamResult(data);
    await fetchResults();
    return id;
  }, [createExamResult, fetchResults]);

  const edit = useCallback(async (id: string, data: Partial<ExamResult>) => {
    await updateExamResult(id, data);
    await fetchResults();
  }, [updateExamResult, fetchResults]);

  const remove = useCallback(async (id: string) => {
    await deleteExamResult(id);
    await fetchResults();
  }, [deleteExamResult, fetchResults]);

  return { results, loading, error, refetch: fetchResults, add, edit, remove };
}

export function useTimetable(schoolId: string | null, classId?: string) {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getTimetable, createTimetableEntry, updateTimetableEntry, deleteTimetableEntry } = useFirestore();

  const fetchTimetable = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getTimetable(schoolId, classId);
      setTimetable(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch timetable');
    } finally {
      setLoading(false);
    }
  }, [schoolId, classId, getTimetable]);

  useEffect(() => {
    fetchTimetable();
  }, [fetchTimetable]);

  const add = useCallback(async (data: Omit<TimetableEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = await createTimetableEntry(data);
    await fetchTimetable();
    return id;
  }, [createTimetableEntry, fetchTimetable]);

  const edit = useCallback(async (id: string, data: Partial<TimetableEntry>) => {
    await updateTimetableEntry(id, data);
    await fetchTimetable();
  }, [updateTimetableEntry, fetchTimetable]);

  const remove = useCallback(async (id: string) => {
    await deleteTimetableEntry(id);
    await fetchTimetable();
  }, [deleteTimetableEntry, fetchTimetable]);

  return { timetable, loading, error, refetch: fetchTimetable, add, edit, remove };
}

export function useHomework(schoolId: string | null, classId?: string) {
  const [homework, setHomework] = useState<Homework[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getHomework, createHomework, updateHomework, deleteHomework } = useFirestore();

  const fetchHomework = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getHomework(schoolId, classId);
      setHomework(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch homework');
    } finally {
      setLoading(false);
    }
  }, [schoolId, classId, getHomework]);

  useEffect(() => {
    fetchHomework();
  }, [fetchHomework]);

  const add = useCallback(async (data: Omit<Homework, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = await createHomework(data);
    await fetchHomework();
    return id;
  }, [createHomework, fetchHomework]);

  const edit = useCallback(async (id: string, data: Partial<Homework>) => {
    await updateHomework(id, data);
    await fetchHomework();
  }, [updateHomework, fetchHomework]);

  const remove = useCallback(async (id: string) => {
    await deleteHomework(id);
    await fetchHomework();
  }, [deleteHomework, fetchHomework]);

  return { homework, loading, error, refetch: fetchHomework, add, edit, remove };
}

export function useMessages(userId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getMessages, sendMessage, markMessageRead } = useFirestore();

  const fetchMessages = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getMessages(userId);
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  }, [userId, getMessages]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const send = useCallback(async (data: Omit<Message, 'id' | 'read' | 'createdAt'>) => {
    const id = await sendMessage(data);
    await fetchMessages();
    return id;
  }, [sendMessage, fetchMessages]);

  const markRead = useCallback(async (id: string) => {
    await markMessageRead(id);
    await fetchMessages();
  }, [markMessageRead, fetchMessages]);

  return { messages, loading, error, refetch: fetchMessages, send, markRead };
}

export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getNotifications, createNotification, markNotificationRead, markAllNotificationsRead } = useFirestore();

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getNotifications(userId);
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [userId, getNotifications]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const add = useCallback(async (data: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const id = await createNotification(data);
    await fetchNotifications();
    return id;
  }, [createNotification, fetchNotifications]);

  const markRead = useCallback(async (id: string) => {
    await markNotificationRead(id);
    await fetchNotifications();
  }, [markNotificationRead, fetchNotifications]);

  const markAllRead = useCallback(async () => {
    if (!userId) return;
    await markAllNotificationsRead(userId);
    await fetchNotifications();
  }, [userId, markAllNotificationsRead, fetchNotifications]);

  return { notifications, loading, error, refetch: fetchNotifications, add, markRead, markAllRead };
}

export function useEvents(schoolId: string | null) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getEvents, createEvent, updateEvent, deleteEvent } = useFirestore();

  const fetchEvents = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getEvents(schoolId);
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [schoolId, getEvents]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const add = useCallback(async (data: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = await createEvent(data);
    await fetchEvents();
    return id;
  }, [createEvent, fetchEvents]);

  const edit = useCallback(async (id: string, data: Partial<Event>) => {
    await updateEvent(id, data);
    await fetchEvents();
  }, [updateEvent, fetchEvents]);

  const remove = useCallback(async (id: string) => {
    await deleteEvent(id);
    await fetchEvents();
  }, [deleteEvent, fetchEvents]);

  return { events, loading, error, refetch: fetchEvents, add, edit, remove };
}

export function useLibrary(schoolId: string | null) {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getLibraryBooks, createLibraryBook, updateLibraryBook, deleteLibraryBook } = useFirestore();

  const fetchBooks = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getLibraryBooks(schoolId);
      setBooks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch library books');
    } finally {
      setLoading(false);
    }
  }, [schoolId, getLibraryBooks]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const add = useCallback(async (data: Omit<LibraryBook, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = await createLibraryBook(data);
    await fetchBooks();
    return id;
  }, [createLibraryBook, fetchBooks]);

  const edit = useCallback(async (id: string, data: Partial<LibraryBook>) => {
    await updateLibraryBook(id, data);
    await fetchBooks();
  }, [updateLibraryBook, fetchBooks]);

  const remove = useCallback(async (id: string) => {
    await deleteLibraryBook(id);
    await fetchBooks();
  }, [deleteLibraryBook, fetchBooks]);

  return { books, loading, error, refetch: fetchBooks, add, edit, remove };
}

export function useTransport(schoolId: string | null) {
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getTransportRoutes, createTransportRoute, updateTransportRoute, deleteTransportRoute } = useFirestore();

  const fetchRoutes = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getTransportRoutes(schoolId);
      setRoutes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transport routes');
    } finally {
      setLoading(false);
    }
  }, [schoolId, getTransportRoutes]);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const add = useCallback(async (data: Omit<TransportRoute, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = await createTransportRoute(data);
    await fetchRoutes();
    return id;
  }, [createTransportRoute, fetchRoutes]);

  const edit = useCallback(async (id: string, data: Partial<TransportRoute>) => {
    await updateTransportRoute(id, data);
    await fetchRoutes();
  }, [updateTransportRoute, fetchRoutes]);

  const remove = useCallback(async (id: string) => {
    await deleteTransportRoute(id);
    await fetchRoutes();
  }, [deleteTransportRoute, fetchRoutes]);

  return { routes, loading, error, refetch: fetchRoutes, add, edit, remove };
}

export function useDiscipline(schoolId: string | null) {
  const [records, setRecords] = useState<DisciplineRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getDisciplineRecords, createDisciplineRecord, updateDisciplineRecord } = useFirestore();

  const fetchRecords = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getDisciplineRecords(schoolId);
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch discipline records');
    } finally {
      setLoading(false);
    }
  }, [schoolId, getDisciplineRecords]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const add = useCallback(async (data: Omit<DisciplineRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = await createDisciplineRecord(data);
    await fetchRecords();
    return id;
  }, [createDisciplineRecord, fetchRecords]);

  const edit = useCallback(async (id: string, data: Partial<DisciplineRecord>) => {
    await updateDisciplineRecord(id, data);
    await fetchRecords();
  }, [updateDisciplineRecord, fetchRecords]);

  return { records, loading, error, refetch: fetchRecords, add, edit };
}

export function useInventory(schoolId: string | null) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getInventory, createInventoryItem, updateInventoryItem, deleteInventoryItem } = useFirestore();

  const fetchItems = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getInventory(schoolId);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  }, [schoolId, getInventory]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const add = useCallback(async (data: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = await createInventoryItem(data);
    await fetchItems();
    return id;
  }, [createInventoryItem, fetchItems]);

  const edit = useCallback(async (id: string, data: Partial<InventoryItem>) => {
    await updateInventoryItem(id, data);
    await fetchItems();
  }, [updateInventoryItem, fetchItems]);

  const remove = useCallback(async (id: string) => {
    await deleteInventoryItem(id);
    await fetchItems();
  }, [deleteInventoryItem, fetchItems]);

  return { items, loading, error, refetch: fetchItems, add, edit, remove };
}

export function useUsers(schoolId: string | null) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getUsers, createUser, updateUser, deleteUser } = useFirestore();

  const fetchUsers = useCallback(async () => {
    if (!schoolId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers(schoolId);
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [schoolId, getUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const add = useCallback(async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = await createUser(data);
    await fetchUsers();
    return id;
  }, [createUser, fetchUsers]);

  const edit = useCallback(async (id: string, data: Partial<User>) => {
    await updateUser(id, data);
    await fetchUsers();
  }, [updateUser, fetchUsers]);

  const remove = useCallback(async (id: string) => {
    await deleteUser(id);
    await fetchUsers();
  }, [deleteUser, fetchUsers]);

  return { users, loading, error, refetch: fetchUsers, add, edit, remove };
}
