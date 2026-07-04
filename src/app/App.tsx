import { useState, useEffect, useCallback, useMemo } from "react";
import { LayoutDashboard, Users, GraduationCap, BookOpen, CalendarCheck, FileText, DollarSign, Bell, Settings, Library, Bus, Chrome as Home, ChevronDown, ChevronRight, Menu, X, Sun, Moon, Search, TrendingUp, TrendingDown, UserCheck, UserX, BookMarked, Award, CircleCheck as CheckCircle, Clock, Plus, ListFilter as Filter, Download, Eye, CreditCard as Edit, Trash2, Building2, Globe, Shield, LogOut, User, ChartBar as BarChart3, Activity, Wallet, CreditCard, Receipt, School, ClipboardList, MessageSquare, Calendar, Package, Star, ChevronLeft, CircleAlert as AlertCircle, Layers, Hash, MapPin, Phone, Mail, Lock, ArrowRight, RefreshCw, Printer, Send, BookOpenCheck, Clipboard, MoveHorizontal as MoreHorizontal, Check, Minus, ChartPie as PieChartIcon, ArrowUpRight, ArrowDownRight, UserPlus, FilePlus, Banknote, ShieldCheck, Megaphone, CircleHelp as HelpCircle, Info, ChevronUp, Boxes, ClipboardCheck, Baby, Stethoscope, Bus as BusIcon, WifiOff, Wifi } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, RadialBarChart, RadialBar,
  ComposedChart
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────

type Role = "super_admin" | "school_owner" | "principal" | "teacher" | "student" | "parent" | "accountant" | "registrar";
type Lang = "en" | "am";
type View =
  | "dashboard" | "students" | "student_detail" | "teachers" | "classes"
  | "sections" | "subjects" | "attendance" | "attendance_report"
  | "homework" | "assignments" | "timetable" | "exams" | "grades"
  | "report_cards" | "fees" | "invoices" | "payments" | "payroll"
  | "library" | "inventory" | "transport" | "discipline" | "certificates"
  | "announcements" | "notifications" | "messages" | "calendar" | "events"
  | "reports" | "analytics" | "audit_logs" | "settings" | "parent_portal"
  | "teacher_portal" | "login" | "admissions" | "promotion" | "graduation"
  | "question_bank" | "transcripts" | "hostel" | "schools_list";

interface Student {
  id: string; name: string; studentId: string; grade: string; section: string;
  gender: "M" | "F"; dob: string; phone: string; address: string;
  parentName: string; parentPhone: string; photo: string;
  enrollmentDate: string; status: "active" | "inactive" | "graduated" | "transferred";
  gpa: number; attendance: number; bloodGroup: string; religion: string;
}

interface Teacher {
  id: string; name: string; employeeId: string; subject: string;
  classes: string[]; phone: string; email: string; photo: string;
  hireDate: string; salary: number; status: "active" | "on_leave" | "inactive";
  qualification: string; experience: number;
}

interface Fee {
  id: string; studentId: string; studentName: string; grade: string;
  feeType: string; amount: number; dueDate: string; paidDate: string | null;
  status: "paid" | "pending" | "overdue" | "partial"; paidAmount: number;
}

interface Announcement {
  id: string; title: string; body: string; audience: string[];
  postedBy: string; postedAt: string; priority: "high" | "medium" | "low";
  pinned: boolean;
}

interface AttendanceRecord {
  studentId: string; studentName: string; grade: string; section: string;
  date: string; status: "present" | "absent" | "late" | "excused";
}

interface ExamResult {
  studentId: string; studentName: string; subject: string; examType: string;
  score: number; maxScore: number; grade: string; gpa: number;
}

// ─── Sample Data ─────────────────────────────────────────────────────────────

const STUDENTS: Student[] = [
  { id: "s1", name: "Abebe Girma", studentId: "STU-2024-001", grade: "Grade 10", section: "A", gender: "M", dob: "2008-03-15", phone: "0911-234-567", address: "Addis Ababa, Bole", parentName: "Girma Tadesse", parentPhone: "0912-345-678", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop", enrollmentDate: "2019-09-01", status: "active", gpa: 3.8, attendance: 94, bloodGroup: "O+", religion: "Orthodox" },
  { id: "s2", name: "Tigist Haile", studentId: "STU-2024-002", grade: "Grade 10", section: "A", gender: "F", dob: "2008-06-22", phone: "0912-345-678", address: "Addis Ababa, Kazanchis", parentName: "Haile Bekele", parentPhone: "0913-456-789", photo: "https://images.unsplash.com/photo-1494790108755-2616b332c9f0?w=80&h=80&fit=crop", enrollmentDate: "2019-09-01", status: "active", gpa: 3.9, attendance: 97, bloodGroup: "A+", religion: "Orthodox" },
  { id: "s3", name: "Dawit Mengistu", studentId: "STU-2024-003", grade: "Grade 11", section: "B", gender: "M", dob: "2007-01-10", phone: "0913-456-789", address: "Addis Ababa, Piazza", parentName: "Mengistu Alemu", parentPhone: "0914-567-890", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop", enrollmentDate: "2018-09-01", status: "active", gpa: 3.5, attendance: 88, bloodGroup: "B+", religion: "Muslim" },
  { id: "s4", name: "Hana Tesfaye", studentId: "STU-2024-004", grade: "Grade 11", section: "A", gender: "F", dob: "2007-08-30", phone: "0914-567-890", address: "Addis Ababa, Merkato", parentName: "Tesfaye Worku", parentPhone: "0915-678-901", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop", enrollmentDate: "2018-09-01", status: "active", gpa: 4.0, attendance: 99, bloodGroup: "AB+", religion: "Orthodox" },
  { id: "s5", name: "Yonas Bekele", studentId: "STU-2024-005", grade: "Grade 12", section: "A", gender: "M", dob: "2006-11-05", phone: "0915-678-901", address: "Addis Ababa, Megenagna", parentName: "Bekele Hailu", parentPhone: "0916-789-012", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop", enrollmentDate: "2017-09-01", status: "active", gpa: 3.7, attendance: 92, bloodGroup: "O-", religion: "Protestant" },
  { id: "s6", name: "Sara Alemu", studentId: "STU-2024-006", grade: "Grade 9", section: "C", gender: "F", dob: "2009-04-18", phone: "0916-789-012", address: "Addis Ababa, CMC", parentName: "Alemu Girma", parentPhone: "0917-890-123", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop", enrollmentDate: "2020-09-01", status: "active", gpa: 3.6, attendance: 91, bloodGroup: "A-", religion: "Orthodox" },
  { id: "s7", name: "Mikael Tadesse", studentId: "STU-2024-007", grade: "Grade 9", section: "B", gender: "M", dob: "2009-12-01", phone: "0917-890-123", address: "Addis Ababa, Ayat", parentName: "Tadesse Lemma", parentPhone: "0918-901-234", photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&h=80&fit=crop", enrollmentDate: "2020-09-01", status: "active", gpa: 3.2, attendance: 85, bloodGroup: "B-", religion: "Orthodox" },
  { id: "s8", name: "Selamawit Worku", studentId: "STU-2024-008", grade: "Grade 12", section: "B", gender: "F", dob: "2006-07-14", phone: "0918-901-234", address: "Addis Ababa, Gerji", parentName: "Worku Haile", parentPhone: "0919-012-345", photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&h=80&fit=crop", enrollmentDate: "2017-09-01", status: "active", gpa: 3.9, attendance: 96, bloodGroup: "O+", religion: "Muslim" },
];

const TEACHERS: Teacher[] = [
  { id: "t1", name: "Dr. Alem Kebede", employeeId: "EMP-001", subject: "Mathematics", classes: ["Grade 10A", "Grade 11B", "Grade 12A"], phone: "0911-111-222", email: "alem.kebede@school.et", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop", hireDate: "2015-09-01", salary: 18500, status: "active", qualification: "PhD Mathematics", experience: 12 },
  { id: "t2", name: "Ato Berhane Desta", employeeId: "EMP-002", subject: "Physics", classes: ["Grade 11A", "Grade 12B"], phone: "0912-222-333", email: "berhane.desta@school.et", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop", hireDate: "2018-01-15", salary: 15000, status: "active", qualification: "MSc Physics", experience: 8 },
  { id: "t3", name: "W/ro Mekdes Hailu", employeeId: "EMP-003", subject: "English", classes: ["Grade 9A", "Grade 9B", "Grade 10B"], phone: "0913-333-444", email: "mekdes.hailu@school.et", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop", hireDate: "2016-09-01", salary: 14000, status: "active", qualification: "BA English Literature", experience: 10 },
  { id: "t4", name: "Ato Fekadu Lemma", employeeId: "EMP-004", subject: "Biology", classes: ["Grade 11B", "Grade 12A"], phone: "0914-444-555", email: "fekadu.lemma@school.et", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop", hireDate: "2020-09-01", salary: 13500, status: "active", qualification: "BSc Biology", experience: 5 },
  { id: "t5", name: "W/rt Meseret Alemu", employeeId: "EMP-005", subject: "Chemistry", classes: ["Grade 10A", "Grade 11A"], phone: "0915-555-666", email: "meseret.alemu@school.et", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop", hireDate: "2019-03-01", salary: 14500, status: "on_leave", qualification: "MSc Chemistry", experience: 7 },
  { id: "t6", name: "Ato Girma Tesfaye", employeeId: "EMP-006", subject: "History", classes: ["Grade 9C", "Grade 10B"], phone: "0916-666-777", email: "girma.tesfaye@school.et", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop", hireDate: "2017-09-01", salary: 13000, status: "active", qualification: "BA History", experience: 9 },
];

const FEES: Fee[] = [
  { id: "f1", studentId: "s1", studentName: "Abebe Girma", grade: "Grade 10", feeType: "Tuition Fee", amount: 15000, dueDate: "2024-10-01", paidDate: "2024-09-28", status: "paid", paidAmount: 15000 },
  { id: "f2", studentId: "s2", studentName: "Tigist Haile", grade: "Grade 10", feeType: "Tuition Fee", amount: 15000, dueDate: "2024-10-01", paidDate: null, status: "pending", paidAmount: 0 },
  { id: "f3", studentId: "s3", studentName: "Dawit Mengistu", grade: "Grade 11", feeType: "Tuition Fee", amount: 16000, dueDate: "2024-09-15", paidDate: null, status: "overdue", paidAmount: 0 },
  { id: "f4", studentId: "s4", studentName: "Hana Tesfaye", grade: "Grade 11", feeType: "Tuition Fee", amount: 16000, dueDate: "2024-10-01", paidDate: "2024-09-30", status: "paid", paidAmount: 16000 },
  { id: "f5", studentId: "s5", studentName: "Yonas Bekele", grade: "Grade 12", feeType: "Tuition Fee", amount: 17000, dueDate: "2024-10-01", paidDate: "2024-10-01", status: "paid", paidAmount: 17000 },
  { id: "f6", studentId: "s6", studentName: "Sara Alemu", grade: "Grade 9", feeType: "Tuition Fee", amount: 14000, dueDate: "2024-10-01", paidDate: null, status: "partial", paidAmount: 7000 },
  { id: "f7", studentId: "s1", studentName: "Abebe Girma", grade: "Grade 10", feeType: "Library Fee", amount: 500, dueDate: "2024-10-01", paidDate: "2024-09-28", status: "paid", paidAmount: 500 },
  { id: "f8", studentId: "s7", studentName: "Mikael Tadesse", grade: "Grade 9", feeType: "Sport Fee", amount: 800, dueDate: "2024-09-01", paidDate: null, status: "overdue", paidAmount: 0 },
];

const ANNOUNCEMENTS: Announcement[] = [
  { id: "a1", title: "Second Semester Exam Schedule Released", body: "The examination schedule for the second semester has been finalized. All Grade 10-12 students must review the timetable posted on the school notice board. Exams begin on November 15, 2024. Students are advised to prepare adequately.", audience: ["all"], postedBy: "Principal Almaz Bekele", postedAt: "2024-10-15T09:00:00", priority: "high", pinned: true },
  { id: "a2", title: "Parent-Teacher Conference — October 25", body: "We are hosting our quarterly Parent-Teacher Conference on October 25, 2024 from 9:00 AM to 4:00 PM. All parents are strongly encouraged to attend to receive updates on their children's academic progress.", audience: ["parents", "teachers"], postedBy: "Vice Principal Haile Worku", postedAt: "2024-10-12T14:30:00", priority: "high", pinned: true },
  { id: "a3", title: "School Library New Arrivals", body: "The school library has received over 200 new books across Science, Mathematics, Literature, and Ethiopian History. Students may borrow up to 3 books at a time for a period of 2 weeks.", audience: ["students", "teachers"], postedBy: "Librarian Selamawit Girma", postedAt: "2024-10-10T10:00:00", priority: "low", pinned: false },
  { id: "a4", title: "Football Tournament — Registration Open", body: "Inter-school football tournament registration is now open. Students interested in representing our school must register with the Physical Education department by October 20, 2024.", audience: ["students"], postedBy: "PE Teacher Dawit Lemma", postedAt: "2024-10-08T08:00:00", priority: "medium", pinned: false },
];

const ATTENDANCE_DATA: AttendanceRecord[] = [
  ...STUDENTS.slice(0, 6).map((s, i) => ({
    studentId: s.id, studentName: s.name, grade: s.grade, section: s.section,
    date: "2024-10-16",
    status: (["present","present","absent","present","late","present"] as const)[i]
  })),
];

const EXAM_RESULTS: ExamResult[] = [
  { studentId: "s1", studentName: "Abebe Girma", subject: "Mathematics", examType: "Midterm", score: 86, maxScore: 100, grade: "A", gpa: 4.0 },
  { studentId: "s1", studentName: "Abebe Girma", subject: "Physics", examType: "Midterm", score: 78, maxScore: 100, grade: "B+", gpa: 3.5 },
  { studentId: "s1", studentName: "Abebe Girma", subject: "English", examType: "Midterm", score: 90, maxScore: 100, grade: "A+", gpa: 4.0 },
  { studentId: "s2", studentName: "Tigist Haile", subject: "Mathematics", examType: "Midterm", score: 94, maxScore: 100, grade: "A+", gpa: 4.0 },
  { studentId: "s2", studentName: "Tigist Haile", subject: "Biology", examType: "Midterm", score: 88, maxScore: 100, grade: "A", gpa: 4.0 },
  { studentId: "s3", studentName: "Dawit Mengistu", subject: "Mathematics", examType: "Midterm", score: 72, maxScore: 100, grade: "B", gpa: 3.0 },
  { studentId: "s4", studentName: "Hana Tesfaye", subject: "Chemistry", examType: "Midterm", score: 97, maxScore: 100, grade: "A+", gpa: 4.0 },
];

// Chart Data
const monthlyEnrollment = [
  { month: "Sep", students: 1180, teachers: 68 },
  { month: "Oct", students: 1205, teachers: 70 },
  { month: "Nov", students: 1198, teachers: 70 },
  { month: "Dec", students: 1190, teachers: 69 },
  { month: "Jan", students: 1215, teachers: 72 },
  { month: "Feb", students: 1230, teachers: 72 },
  { month: "Mar", students: 1220, teachers: 74 },
];

const attendanceTrend = [
  { day: "Mon", present: 1150, absent: 65, late: 15 },
  { day: "Tue", present: 1160, absent: 50, late: 20 },
  { day: "Wed", present: 1140, absent: 70, late: 20 },
  { day: "Thu", present: 1170, absent: 45, late: 15 },
  { day: "Fri", present: 1100, absent: 95, late: 35 },
];

const feeCollection = [
  { month: "Jul", collected: 285000, pending: 45000 },
  { month: "Aug", collected: 320000, pending: 38000 },
  { month: "Sep", collected: 410000, pending: 52000 },
  { month: "Oct", collected: 380000, pending: 65000 },
  { month: "Nov", collected: 355000, pending: 42000 },
  { month: "Dec", collected: 430000, pending: 30000 },
];

const gradeDistribution = [
  { grade: "A+", count: 145, color: "#0d9488" },
  { grade: "A", count: 210, color: "#14b8a6" },
  { grade: "B+", count: 285, color: "#d97706" },
  { grade: "B", count: 320, color: "#f59e0b" },
  { grade: "C+", count: 185, color: "#7c3aed" },
  { grade: "C", count: 95, color: "#a78bfa" },
  { grade: "D", count: 45, color: "#dc2626" },
];

const genderRatio = [
  { name: "Male", value: 628, color: "#0d9488" },
  { name: "Female", value: 602, color: "#d97706" },
];

const subjectPerformance = [
  { subject: "Math", avg: 72, highest: 98, lowest: 42 },
  { subject: "Physics", avg: 68, highest: 95, lowest: 38 },
  { subject: "English", avg: 78, highest: 99, lowest: 51 },
  { subject: "Biology", avg: 75, highest: 97, lowest: 45 },
  { subject: "Chemistry", avg: 70, highest: 96, lowest: 40 },
  { subject: "History", avg: 80, highest: 100, lowest: 55 },
];

const SCHOOL_CLASSES = [
  { id: "c1", name: "Grade 9", sections: ["A","B","C"], students: 135, homeroom: "W/ro Mekdes Hailu" },
  { id: "c2", name: "Grade 10", sections: ["A","B"], students: 98, homeroom: "Dr. Alem Kebede" },
  { id: "c3", name: "Grade 11", sections: ["A","B"], students: 87, homeroom: "Ato Berhane Desta" },
  { id: "c4", name: "Grade 12", sections: ["A","B"], students: 76, homeroom: "Ato Girma Tesfaye" },
];

const SUBJECTS = [
  { id: "sub1", name: "Mathematics", code: "MATH", teacher: "Dr. Alem Kebede", periods: 6, grades: ["9","10","11","12"] },
  { id: "sub2", name: "Physics", code: "PHY", teacher: "Ato Berhane Desta", periods: 5, grades: ["10","11","12"] },
  { id: "sub3", name: "English", code: "ENG", teacher: "W/ro Mekdes Hailu", periods: 6, grades: ["9","10","11","12"] },
  { id: "sub4", name: "Biology", code: "BIO", teacher: "Ato Fekadu Lemma", periods: 5, grades: ["9","10","11","12"] },
  { id: "sub5", name: "Chemistry", code: "CHEM", teacher: "W/rt Meseret Alemu", periods: 5, grades: ["10","11","12"] },
  { id: "sub6", name: "History", code: "HIST", teacher: "Ato Girma Tesfaye", periods: 4, grades: ["9","10","11","12"] },
  { id: "sub7", name: "Amharic", code: "AMH", teacher: "W/ro Tigist Bekele", periods: 5, grades: ["9","10","11","12"] },
  { id: "sub8", name: "Physical Education", code: "PE", teacher: "Ato Dawit Lemma", periods: 3, grades: ["9","10","11","12"] },
];

const TIMETABLE = {
  "Grade 10A": {
    Monday: ["Math","English","Physics","---","Biology","Amharic"],
    Tuesday: ["English","Math","Chemistry","PE","History","---"],
    Wednesday: ["Physics","Biology","Math","English","---","Chemistry"],
    Thursday: ["Amharic","Chemistry","English","Math","Physics","Biology"],
    Friday: ["Biology","History","---","Amharic","Math","English"],
  }
};

const SCHOOLS = [
  { id: "sch1", name: "Addis Ababa International School", city: "Addis Ababa", students: 1230, teachers: 74, founded: 2005, status: "active", plan: "Premium" },
  { id: "sch2", name: "Bahir Dar Excellence Academy", city: "Bahir Dar", students: 870, teachers: 52, founded: 2010, status: "active", plan: "Standard" },
  { id: "sch3", name: "Hawassa Modern School", city: "Hawassa", students: 650, teachers: 40, founded: 2015, status: "active", plan: "Basic" },
  { id: "sch4", name: "Mekelle Academy", city: "Mekelle", students: 440, teachers: 28, founded: 2018, status: "active", plan: "Basic" },
  { id: "sch5", name: "Dire Dawa Prep School", city: "Dire Dawa", students: 320, teachers: 22, founded: 2020, status: "trial", plan: "Trial" },
];

// ─── i18n ────────────────────────────────────────────────────────────────────

const i18n: Record<Lang, Record<string, string>> = {
  en: {
    dashboard: "Dashboard", students: "Students", teachers: "Teachers",
    classes: "Classes", sections: "Sections", subjects: "Subjects",
    attendance: "Attendance", exams: "Examinations", grades: "Grades",
    fees: "Fees", payments: "Payments", library: "Library",
    announcements: "Announcements", settings: "Settings", reports: "Reports",
    analytics: "Analytics", logout: "Log Out", search: "Search...",
    totalStudents: "Total Students", totalTeachers: "Total Teachers",
    attendanceRate: "Attendance Rate", feeCollection: "Fee Collection",
    add: "Add", edit: "Edit", delete: "Delete", view: "View", save: "Save",
    cancel: "Cancel", active: "Active", inactive: "Inactive", all: "All",
    export: "Export", print: "Print", filter: "Filter",
    male: "Male", female: "Female", grade: "Grade", section: "Section",
    status: "Status", name: "Name", phone: "Phone", email: "Email",
    actions: "Actions", date: "Date", amount: "Amount (ETB)",
    paid: "Paid", pending: "Pending", overdue: "Overdue", partial: "Partial",
    schoolName: "Addis Ababa International School",
    welcome: "Welcome back", schools: "Schools", transport: "Transport",
    hostel: "Hostel", events: "Events", messages: "Messages",
    notifications: "Notifications", payroll: "Payroll",
    admissions: "Admissions", timetable: "Timetable", discipline: "Discipline",
    certificates: "Certificates", inventory: "Inventory",
    superAdmin: "Super Admin", principal: "Principal", teacher: "Teacher",
    student: "Student", parent: "Parent", accountant: "Accountant",
    present: "Present", absent: "Absent", late: "Late", excused: "Excused",
  },
  am: {
    dashboard: "ዳሽቦርድ", students: "ተማሪዎች", teachers: "አስተማሪዎች",
    classes: "ክፍሎች", sections: "ክፍለ ጊዜዎች", subjects: "ትምህርቶች",
    attendance: "ክትትል", exams: "ፈተናዎች", grades: "ውጤቶች",
    fees: "ክፍያ", payments: "ክፍያዎች", library: "ቤተ-መጻሕፍት",
    announcements: "ማስታወቂያዎች", settings: "ቅንብሮች", reports: "ሪፖርቶች",
    analytics: "ትንተና", logout: "ውጣ", search: "ፈልግ...",
    totalStudents: "ጠቅላላ ተማሪዎች", totalTeachers: "ጠቅላላ አስተማሪዎች",
    attendanceRate: "የክትትል ደረጃ", feeCollection: "ክፍያ ስብስብ",
    add: "ጨምር", edit: "አርም", delete: "ሰርዝ", view: "እይ", save: "አስቀምጥ",
    cancel: "ሰርዝ", active: "ንቁ", inactive: "ተቋርጧል", all: "ሁሉም",
    export: "ላክ", print: "አትም", filter: "ማጣሪያ",
    male: "ወንድ", female: "ሴት", grade: "ክፍል", section: "ዘርፍ",
    status: "ሁኔታ", name: "ስም", phone: "ስልክ", email: "ኢሜይል",
    actions: "ድርጊቶች", date: "ቀን", amount: "መጠን (ብር)",
    paid: "ተከፍሏል", pending: "በመጠባበቅ", overdue: "ዘግይቷል", partial: "ከፊል",
    schoolName: "አዲስ አበባ ዓለም አቀፍ ትምህርት ቤት",
    welcome: "እንኳን ደህና መጡ", schools: "ትምህርት ቤቶች", transport: "ትራንስፖርት",
    hostel: "ሆስቴል", events: "ዝግጅቶች", messages: "መልዕክቶች",
    notifications: "ማሳወቂያዎች", payroll: "ክፍያ ዝርዝር",
    admissions: "ምዝገባ", timetable: "የጊዜ ሰሌዳ", discipline: "ዲሲፕሊን",
    certificates: "የምስክር ወረቀቶች", inventory: "ክምችት",
    superAdmin: "ዋና አስተዳዳሪ", principal: "ርዕሰ መምህር", teacher: "አስተማሪ",
    student: "ተማሪ", parent: "ወላጅ", accountant: "ሂሳብ ሹም",
    present: "ተሳትፏል", absent: "አልተሳተፈም", late: "ዘግይቶ", excused: "ፈቃድ",
  },
};

// ─── Utility components ───────────────────────────────────────────────────────

const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: "default"|"success"|"warning"|"danger"|"info"|"neutral" }) => {
  const cls = {
    default: "bg-primary/10 text-primary",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    info: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    neutral: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  }[variant];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold font-mono ${cls}`}>{children}</span>;
};

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-card text-card-foreground rounded-xl border border-border shadow-sm ${className}`}>{children}</div>
);

const StatCard = ({ icon: Icon, label, value, sub, trend, color }: {
  icon: React.ElementType; label: string; value: string; sub?: string;
  trend?: { val: number; positive: boolean }; color: string;
}) => (
  <Card className="p-5 flex items-start gap-4">
    <div className={`flex-none w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold mt-0.5" style={{ fontFamily: "var(--font-display)" }}>{value}</p>
      {(sub || trend) && (
        <div className="flex items-center gap-1.5 mt-1">
          {trend && (
            <span className={`flex items-center gap-0.5 text-xs font-semibold ${trend.positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
              {trend.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(trend.val)}%
            </span>
          )}
          {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
        </div>
      )}
    </div>
  </Card>
);

const Btn = ({ children, onClick, variant = "primary", size = "md", className = "", disabled = false }: {
  children: React.ReactNode; onClick?: () => void;
  variant?: "primary"|"secondary"|"ghost"|"danger"|"outline";
  size?: "sm"|"md"|"lg"; className?: string; disabled?: boolean;
}) => {
  const v = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-muted text-foreground",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-border hover:bg-muted text-foreground",
  }[variant];
  const s = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" }[size];
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-1.5 font-semibold rounded-lg transition-colors ${v} ${s} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}>
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, type = "text", placeholder = "", className = "" }: {
  label?: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; className?: string;
}) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && <label className="text-xs font-semibold text-foreground">{label}</label>}
    <input
      type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition"
    />
  </div>
);

const Select = ({ label, value, onChange, options, className = "" }: {
  label?: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; className?: string;
}) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && <label className="text-xs font-semibold text-foreground">{label}</label>}
    <select
      value={value} onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Table = ({ headers, rows, emptyMsg = "No records found." }: {
  headers: string[]; rows: React.ReactNode[][];  emptyMsg?: string;
}) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border">
          {headers.map(h => (
            <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {rows.length === 0 ? (
          <tr><td colSpan={headers.length} className="text-center py-12 text-muted-foreground">{emptyMsg}</td></tr>
        ) : rows.map((row, i) => (
          <tr key={i} className="hover:bg-muted/40 transition-colors">
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-3 whitespace-nowrap">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Modal = ({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card text-card-foreground rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-bold text-lg" style={{ fontFamily: "var(--font-display)" }}>{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><X size={18} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-5">{children}</div>
      </div>
    </div>
  );
};

const TabBar = ({ tabs, active, onChange }: {
  tabs: { id: string; label: string; icon?: React.ElementType }[];
  active: string; onChange: (id: string) => void;
}) => (
  <div className="flex gap-1 border-b border-border">
    {tabs.map(t => {
      const Icon = t.icon;
      return (
        <button key={t.id} onClick={() => onChange(t.id)}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors
            ${active === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
          {Icon && <Icon size={15} />}{t.label}
        </button>
      );
    })}
  </div>
);

// ─── Sidebar nav config ───────────────────────────────────────────────────────

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { id: "dashboard", icon: LayoutDashboard, label: "dashboard" },
      { id: "analytics", icon: BarChart3, label: "analytics" },
    ]
  },
  {
    label: "People",
    items: [
      { id: "students", icon: GraduationCap, label: "students" },
      { id: "teachers", icon: Users, label: "teachers" },
      { id: "admissions", icon: UserPlus, label: "admissions" },
    ]
  },
  {
    label: "Academics",
    items: [
      { id: "classes", icon: School, label: "classes" },
      { id: "subjects", icon: BookOpen, label: "subjects" },
      { id: "timetable", icon: Calendar, label: "timetable" },
      { id: "attendance", icon: CalendarCheck, label: "attendance" },
      { id: "exams", icon: ClipboardList, label: "exams" },
      { id: "grades", icon: Award, label: "grades" },
      { id: "homework", icon: BookMarked, label: "homework" },
    ]
  },
  {
    label: "Finance",
    items: [
      { id: "fees", icon: DollarSign, label: "fees" },
      { id: "payments", icon: CreditCard, label: "payments" },
      { id: "payroll", icon: Banknote, label: "payroll" },
    ]
  },
  {
    label: "Campus",
    items: [
      { id: "library", icon: Library, label: "library" },
      { id: "transport", icon: Bus, label: "transport" },
      { id: "inventory", icon: Package, label: "inventory" },
      { id: "events", icon: Star, label: "events" },
    ]
  },
  {
    label: "Communication",
    items: [
      { id: "announcements", icon: Megaphone, label: "announcements" },
      { id: "messages", icon: MessageSquare, label: "messages" },
      { id: "notifications", icon: Bell, label: "notifications" },
    ]
  },
  {
    label: "System",
    items: [
      { id: "reports", icon: FileText, label: "reports" },
      { id: "audit_logs", icon: Shield, label: "Audit Logs" },
      { id: "settings", icon: Settings, label: "settings" },
    ]
  },
];

const SUPER_ADMIN_EXTRA = { id: "schools_list", icon: Building2, label: "schools" };

// ─── Module Components ────────────────────────────────────────────────────────

function DashboardView({ t, role }: { t: (k: string) => string; role: Role }) {
  const isSuperAdmin = role === "super_admin";
  const [firestoreMode, setFirestoreMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleFirestore = async () => {
    setLoading(true);
    try {
      if (!firestoreMode) {
        const { seedDatabase } = await import("../lib/seedData");
        await seedDatabase();
      }
      setFirestoreMode(!firestoreMode);
    } catch (err) {
      console.error("Firestore toggle error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Firestore Toggle */}
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${firestoreMode ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className="text-sm font-medium">Data Source: {firestoreMode ? 'Firestore (Live)' : 'Local (Demo)'}</span>
        </div>
        <button
          onClick={toggleFirestore}
          disabled={loading}
          className="px-3 py-1.5 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Switching...' : firestoreMode ? 'Use Demo Data' : 'Connect Firestore'}
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={GraduationCap} label={isSuperAdmin ? "Total Students" : t("totalStudents")} value={isSuperAdmin ? "3,510" : "1,230"} sub="vs last month" trend={{ val: 3.2, positive: true }} color="bg-teal-500" />
        <StatCard icon={Users} label={t("totalTeachers")} value={isSuperAdmin ? "212" : "74"} sub="6 on leave" trend={{ val: 1.4, positive: true }} color="bg-violet-500" />
        <StatCard icon={CalendarCheck} label={t("attendanceRate")} value="94.2%" sub="today" trend={{ val: 0.8, positive: true }} color="bg-sky-500" />
        <StatCard icon={Wallet} label={t("feeCollection")} value={isSuperAdmin ? "ETB 1.4M" : "ETB 380K"} sub="this month" trend={{ val: 5.1, positive: false }} color="bg-amber-500" />
      </div>

      {isSuperAdmin && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Building2} label="Total Schools" value="5" sub="1 on trial" trend={{ val: 25, positive: true }} color="bg-emerald-500" />
          <StatCard icon={BookOpen} label="Active Classes" value="87" sub="across all schools" trend={{ val: 2, positive: true }} color="bg-rose-500" />
          <StatCard icon={DollarSign} label="Monthly Revenue" value="ETB 2.1M" sub="all schools" trend={{ val: 8.4, positive: true }} color="bg-orange-500" />
          <StatCard icon={ShieldCheck} label="System Uptime" value="99.9%" sub="last 30 days" trend={{ val: 0.01, positive: true }} color="bg-indigo-500" />
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="col-span-2 p-5">
          <h3 className="font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Enrollment & Teacher Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={monthlyEnrollment}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Area yAxisId="left" type="monotone" dataKey="students" fill="var(--chart-1)" stroke="var(--chart-1)" fillOpacity={0.15} name="Students" />
              <Line yAxisId="right" type="monotone" dataKey="teachers" stroke="var(--chart-2)" strokeWidth={2} dot={false} name="Teachers" />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Gender Ratio</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={genderRatio} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {genderRatio.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Weekly Attendance</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={attendanceTrend} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="present" fill="var(--chart-1)" radius={[3,3,0,0]} name="Present" />
              <Bar dataKey="absent" fill="var(--chart-4)" radius={[3,3,0,0]} name="Absent" />
              <Bar dataKey="late" fill="var(--chart-2)" radius={[3,3,0,0]} name="Late" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Fee Collection (ETB)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={feeCollection}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickFormatter={v => `${v/1000}k`} />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }} formatter={(v: number) => [`ETB ${v.toLocaleString()}`, ""]} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Area type="monotone" dataKey="collected" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.15} name="Collected" />
              <Area type="monotone" dataKey="pending" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.15} name="Pending" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold" style={{ fontFamily: "var(--font-display)" }}>Recent Announcements</h3>
            <Badge variant="info">{ANNOUNCEMENTS.length} total</Badge>
          </div>
          <div className="space-y-3">
            {ANNOUNCEMENTS.slice(0,3).map(a => (
              <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-none ${a.priority === "high" ? "bg-red-500" : a.priority === "medium" ? "bg-amber-500" : "bg-emerald-500"}`} />
                <div>
                  <p className="text-sm font-semibold">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.postedBy} · {new Date(a.postedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold" style={{ fontFamily: "var(--font-display)" }}>Overdue Fees</h3>
            <Badge variant="danger">{FEES.filter(f => f.status === "overdue").length} overdue</Badge>
          </div>
          <div className="space-y-3">
            {FEES.filter(f => f.status === "overdue" || f.status === "pending").slice(0,4).map(f => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                <div>
                  <p className="text-sm font-semibold">{f.studentName}</p>
                  <p className="text-xs text-muted-foreground">{f.grade} · {f.feeType}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">ETB {f.amount.toLocaleString()}</p>
                  <Badge variant={f.status === "overdue" ? "danger" : "warning"}>{f.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StudentsView({ t }: { t: (k: string) => string }) {
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<Student | null>(null);

  const grades = ["all", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

  const filtered = useMemo(() => STUDENTS.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.studentId.includes(search)) return false;
    if (gradeFilter !== "all" && s.grade !== gradeFilter) return false;
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    return true;
  }), [search, gradeFilter, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Student Registry</h2>
          <p className="text-sm text-muted-foreground">{STUDENTS.length} students enrolled · Academic Year 2024/25</p>
        </div>
        <div className="flex items-center gap-2">
          <Btn variant="outline" size="sm"><Download size={14} />{t("export")}</Btn>
          <Btn size="sm" onClick={() => { setSelected(null); setModalOpen(true); }}><Plus size={14} />Add Student</Btn>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("search")}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring/50" />
          </div>
          <Select value={gradeFilter} onChange={setGradeFilter} options={grades.map(g => ({ value: g, label: g === "all" ? "All Grades" : g }))} className="sm:w-40" />
          <Select value={statusFilter} onChange={setStatusFilter} options={[
            { value: "all", label: "All Status" }, { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" }, { value: "graduated", label: "Graduated" }
          ]} className="sm:w-36" />
        </div>
      </Card>

      <Card>
        <Table
          headers={["Student", "ID", "Grade/Section", "Guardian", "Attendance", "GPA", "Status", "Actions"]}
          rows={filtered.map(s => [
            <div key="name" className="flex items-center gap-3">
              <img src={s.photo} alt={s.name} className="w-8 h-8 rounded-full object-cover bg-muted" />
              <div>
                <p className="font-semibold text-sm">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.gender === "M" ? "Male" : "Female"}</p>
              </div>
            </div>,
            <span key="id" className="font-mono text-xs text-muted-foreground">{s.studentId}</span>,
            <span key="grade">{s.grade} · {s.section}</span>,
            <div key="parent"><p className="text-xs font-semibold">{s.parentName}</p><p className="text-xs text-muted-foreground">{s.parentPhone}</p></div>,
            <div key="att" className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${s.attendance}%` }} />
              </div>
              <span className="text-xs font-mono">{s.attendance}%</span>
            </div>,
            <Badge key="gpa" variant={s.gpa >= 3.7 ? "success" : s.gpa >= 3.0 ? "info" : "warning"}>{s.gpa.toFixed(1)}</Badge>,
            <Badge key="status" variant={s.status === "active" ? "success" : "neutral"}>{s.status}</Badge>,
            <div key="actions" className="flex items-center gap-1">
              <button onClick={() => { setSelected(s); setModalOpen(true); }} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><Eye size={14} /></button>
              <button className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
              <button className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-red-500"><Trash2 size={14} /></button>
            </div>,
          ])}
        />
      </Card>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={selected ? `${selected.name} — Details` : "Add New Student"}>
        {selected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img src={selected.photo} alt={selected.name} className="w-20 h-20 rounded-xl object-cover bg-muted" />
              <div>
                <h4 className="text-lg font-bold">{selected.name}</h4>
                <p className="text-sm text-muted-foreground font-mono">{selected.studentId}</p>
                <Badge variant="success">{selected.status}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Grade", selected.grade], ["Section", selected.section],
                ["Date of Birth", selected.dob], ["Blood Group", selected.bloodGroup],
                ["Religion", selected.religion], ["Address", selected.address],
                ["Phone", selected.phone], ["Guardian", selected.parentName],
                ["Guardian Phone", selected.parentPhone], ["Enrolled", selected.enrollmentDate],
              ].map(([k, v]) => (
                <div key={k} className="p-2 rounded-lg bg-muted/40">
                  <p className="text-xs text-muted-foreground font-semibold">{k}</p>
                  <p className="font-medium mt-0.5">{v}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-primary/10 text-center">
                <p className="text-2xl font-bold text-primary">{selected.gpa.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">Current GPA</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-center">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{selected.attendance}%</p>
                <p className="text-xs text-muted-foreground">Attendance Rate</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Input label="Full Name" value="" onChange={() => {}} placeholder="e.g. Abebe Girma" />
            <div className="grid grid-cols-2 gap-3">
              <Select label="Grade" value="Grade 9" onChange={() => {}} options={[9,10,11,12].map(g => ({ value: `Grade ${g}`, label: `Grade ${g}` }))} />
              <Select label="Section" value="A" onChange={() => {}} options={["A","B","C"].map(s => ({ value: s, label: `Section ${s}` }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Select label="Gender" value="M" onChange={() => {}} options={[{ value: "M", label: "Male" }, { value: "F", label: "Female" }]} />
              <Input label="Date of Birth" value="" onChange={() => {}} type="date" />
            </div>
            <Input label="Phone" value="" onChange={() => {}} placeholder="09XX-XXX-XXX" />
            <Input label="Address" value="" onChange={() => {}} placeholder="Addis Ababa, Bole" />
            <Input label="Guardian Name" value="" onChange={() => {}} placeholder="Parent/Guardian Full Name" />
            <Input label="Guardian Phone" value="" onChange={() => {}} placeholder="09XX-XXX-XXX" />
            <div className="flex gap-2 pt-2">
              <Btn variant="outline" onClick={() => setModalOpen(false)} className="flex-1">{t("cancel")}</Btn>
              <Btn className="flex-1"><Check size={14} />{t("save")}</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function TeachersView({ t }: { t: (k: string) => string }) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("list");

  const filtered = useMemo(() => TEACHERS.filter(tc =>
    !search || tc.name.toLowerCase().includes(search.toLowerCase()) || tc.subject.toLowerCase().includes(search.toLowerCase())
  ), [search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Teaching Staff</h2>
          <p className="text-sm text-muted-foreground">{TEACHERS.length} staff members · {TEACHERS.filter(t => t.status === "active").length} active</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="outline" size="sm"><Download size={14} />{t("export")}</Btn>
          <Btn size="sm"><Plus size={14} />Add Teacher</Btn>
        </div>
      </div>

      <TabBar tabs={[
        { id: "list", label: "Staff List", icon: Users },
        { id: "payroll", label: "Payroll Summary", icon: Banknote },
      ]} active={tab} onChange={setTab} />

      {tab === "list" && (
        <>
          <Card className="p-4">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teachers..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring/50" />
            </div>
          </Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(tc => (
              <Card key={tc.id} className="p-5">
                <div className="flex items-start gap-4">
                  <img src={tc.photo} alt={tc.name} className="w-14 h-14 rounded-xl object-cover bg-muted flex-none" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{tc.name}</p>
                    <p className="text-xs text-muted-foreground">{tc.subject}</p>
                    <p className="text-xs font-mono text-muted-foreground">{tc.employeeId}</p>
                    <Badge variant={tc.status === "active" ? "success" : tc.status === "on_leave" ? "warning" : "neutral"} >{tc.status.replace("_", " ")}</Badge>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground"><BookOpen size={12} />{tc.classes.length} classes</div>
                  <div className="flex items-center gap-1.5 text-muted-foreground"><Star size={12} />{tc.experience} yrs exp</div>
                  <div className="flex items-center gap-1.5 text-muted-foreground"><Phone size={12} />{tc.phone}</div>
                  <div className="flex items-center gap-1.5 text-muted-foreground"><Mail size={12} truncate/>{tc.email.split("@")[0]}@…</div>
                </div>
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{tc.qualification}</span>
                  <span className="text-sm font-bold text-primary">ETB {tc.salary.toLocaleString()}</span>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {tab === "payroll" && (
        <Card className="p-5">
          <h3 className="font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Monthly Payroll Summary — October 2024</h3>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="p-4 rounded-xl bg-primary/10 text-center">
              <p className="text-2xl font-bold text-primary">ETB {TEACHERS.reduce((s,t) => s+t.salary,0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Monthly Payroll</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{TEACHERS.filter(t => t.status === "active").length}</p>
              <p className="text-xs text-muted-foreground mt-1">Active Staff</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-100 dark:bg-amber-900/20 text-center">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{TEACHERS.filter(t => t.status === "on_leave").length}</p>
              <p className="text-xs text-muted-foreground mt-1">On Leave</p>
            </div>
          </div>
          <Table
            headers={["Teacher", "Subject", "Salary (ETB)", "Status", "Actions"]}
            rows={TEACHERS.map(tc => [
              <div key="name" className="flex items-center gap-3">
                <img src={tc.photo} alt={tc.name} className="w-8 h-8 rounded-full object-cover bg-muted" />
                <span className="font-semibold text-sm">{tc.name}</span>
              </div>,
              <span key="sub">{tc.subject}</span>,
              <span key="sal" className="font-mono font-semibold">{tc.salary.toLocaleString()}</span>,
              <Badge key="st" variant={tc.status === "active" ? "success" : "warning"}>{tc.status.replace("_"," ")}</Badge>,
              <Btn key="pay" size="sm" variant="outline"><CreditCard size={12} />Pay</Btn>,
            ])}
          />
        </Card>
      )}
    </div>
  );
}

function AttendanceView({ t }: { t: (k: string) => string }) {
  const [date, setDate] = useState("2024-10-16");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [records, setRecords] = useState<AttendanceRecord[]>(ATTENDANCE_DATA);
  const [tab, setTab] = useState("mark");

  const toggle = (studentId: string, status: "present"|"absent"|"late"|"excused") => {
    setRecords(r => r.map(rec => rec.studentId === studentId ? { ...rec, status } : rec));
  };

  const statusColor: Record<string, string> = {
    present: "bg-emerald-500 text-white",
    absent: "bg-red-500 text-white",
    late: "bg-amber-500 text-white",
    excused: "bg-sky-500 text-white",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Attendance Management</h2>
          <p className="text-sm text-muted-foreground">Mark and track daily attendance</p>
        </div>
        <Btn size="sm"><Download size={14} />Export Report</Btn>
      </div>

      <TabBar tabs={[
        { id: "mark", label: "Mark Attendance", icon: ClipboardCheck },
        { id: "report", label: "Attendance Report", icon: BarChart3 },
      ]} active={tab} onChange={setTab} />

      {tab === "mark" && (
        <>
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input label="Date" value={date} onChange={setDate} type="date" className="sm:w-48" />
              <Select label="Class" value={gradeFilter} onChange={setGradeFilter} options={[
                { value: "all", label: "All Classes" },
                ...SCHOOL_CLASSES.map(c => ({ value: c.id, label: c.name }))
              ]} className="sm:w-48" />
              <div className="flex items-end gap-2">
                <Btn size="sm" variant="outline"><RefreshCw size={13} />Reset</Btn>
                <Btn size="sm"><Check size={13} />Save Attendance</Btn>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {STUDENTS.slice(0,8).map(s => {
              const rec = records.find(r => r.studentId === s.id);
              const status = rec?.status || "present";
              return (
                <Card key={s.id} className="p-4 flex items-center gap-4">
                  <img src={s.photo} alt={s.name} className="w-10 h-10 rounded-xl object-cover bg-muted flex-none" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{s.studentId} · {s.grade}</p>
                  </div>
                  <div className="flex gap-1.5 flex-none">
                    {(["present","absent","late","excused"] as const).map(st => (
                      <button key={st} onClick={() => toggle(s.id, st)}
                        className={`px-2 py-1 rounded-md text-xs font-semibold transition-all ${status === st ? statusColor[st] : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                        {st[0].toUpperCase()}
                      </button>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {tab === "report" && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Present", count: records.filter(r=>r.status==="present").length, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/20" },
              { label: "Absent", count: records.filter(r=>r.status==="absent").length, color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/20" },
              { label: "Late", count: records.filter(r=>r.status==="late").length, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/20" },
              { label: "Excused", count: records.filter(r=>r.status==="excused").length, color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-100 dark:bg-sky-900/20" },
            ].map(s => (
              <Card key={s.label} className={`p-4 text-center ${s.bg}`}>
                <p className={`text-3xl font-bold ${s.color}`}>{s.count}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </Card>
            ))}
          </div>
          <Card className="p-5">
            <h3 className="font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Weekly Attendance Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={attendanceTrend} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="present" fill="var(--chart-1)" radius={[3,3,0,0]} name="Present" />
                <Bar dataKey="absent" fill="#ef4444" radius={[3,3,0,0]} name="Absent" />
                <Bar dataKey="late" fill="var(--chart-2)" radius={[3,3,0,0]} name="Late" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  );
}

function ExamsView({ t }: { t: (k: string) => string }) {
  const [tab, setTab] = useState("results");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Examinations & Grades</h2>
          <p className="text-sm text-muted-foreground">Midterm 2024 · Grade 10 & 11</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="outline" size="sm"><Printer size={14} />Print Reports</Btn>
          <Btn size="sm"><Plus size={14} />Schedule Exam</Btn>
        </div>
      </div>

      <TabBar tabs={[
        { id: "results", label: "Exam Results", icon: Award },
        { id: "grades", label: "Grade Distribution", icon: BarChart3 },
        { id: "subjects", label: "Subject Performance", icon: BookOpen },
      ]} active={tab} onChange={setTab} />

      {tab === "results" && (
        <Card>
          <Table
            headers={["Student", "Subject", "Exam Type", "Score", "Max", "%", "Grade", "GPA"]}
            rows={EXAM_RESULTS.map(r => [
              <span key="name" className="font-semibold">{r.studentName}</span>,
              <span key="sub">{r.subject}</span>,
              <span key="type">{r.examType}</span>,
              <span key="score" className="font-mono font-bold">{r.score}</span>,
              <span key="max" className="font-mono text-muted-foreground">{r.maxScore}</span>,
              <div key="pct" className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${r.score}%` }} />
                </div>
                <span className="text-xs font-mono">{r.score}%</span>
              </div>,
              <Badge key="grade" variant={r.score>=90?"success":r.score>=75?"info":r.score>=60?"warning":"danger"}>{r.grade}</Badge>,
              <span key="gpa" className="font-mono font-semibold">{r.gpa.toFixed(1)}</span>,
            ])}
          />
        </Card>
      )}

      {tab === "grades" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-5">
            <h3 className="font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Grade Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={gradeDistribution} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis dataKey="grade" type="category" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="count" radius={[0,3,3,0]} name="Students">
                  {gradeDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-5">
            <h3 className="font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Grade Summary</h3>
            <div className="space-y-2.5">
              {gradeDistribution.map(g => (
                <div key={g.grade} className="flex items-center gap-3">
                  <span className="w-8 text-sm font-semibold text-center">{g.grade}</span>
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(g.count/320)*100}%`, backgroundColor: g.color }} />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground w-8 text-right">{g.count}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-muted/40">
              <p className="text-xs text-muted-foreground">Class Average GPA</p>
              <p className="text-2xl font-bold text-primary">3.42</p>
            </div>
          </Card>
        </div>
      )}

      {tab === "subjects" && (
        <Card className="p-5">
          <h3 className="font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Subject-wise Performance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={subjectPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="subject" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis domain={[0,100]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="avg" fill="var(--chart-1)" radius={[3,3,0,0]} name="Average" barSize={20} />
              <Line type="monotone" dataKey="highest" stroke="var(--chart-2)" strokeWidth={2} dot={{ r: 4 }} name="Highest" />
              <Line type="monotone" dataKey="lowest" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} strokeDasharray="4 4" name="Lowest" />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}

function FeesView({ t }: { t: (k: string) => string }) {
  const [tab, setTab] = useState("fees");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => FEES.filter(f => statusFilter === "all" || f.status === statusFilter), [statusFilter]);
  const totalCollected = FEES.filter(f=>f.status==="paid").reduce((s,f)=>s+f.paidAmount,0);
  const totalPending = FEES.filter(f=>f.status!=="paid").reduce((s,f)=>s+(f.amount-f.paidAmount),0);

  const statusVariant: Record<string, "success"|"warning"|"danger"|"info"> = {
    paid: "success", pending: "warning", overdue: "danger", partial: "info"
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Fee Management</h2>
          <p className="text-sm text-muted-foreground">Academic Year 2024/25 · October</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="outline" size="sm"><Download size={14} />{t("export")}</Btn>
          <Btn size="sm"><Plus size={14} />Add Fee</Btn>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={DollarSign} label="Total Collected" value={`ETB ${totalCollected.toLocaleString()}`} sub="this month" color="bg-emerald-500" />
        <StatCard icon={Clock} label="Pending" value={`ETB ${totalPending.toLocaleString()}`} sub={`${FEES.filter(f=>f.status==="pending").length} students`} color="bg-amber-500" />
        <StatCard icon={AlertCircle} label="Overdue" value={`${FEES.filter(f=>f.status==="overdue").length}`} sub="need follow-up" color="bg-red-500" />
        <StatCard icon={TrendingUp} label="Collection Rate" value="68.4%" sub="of total due" trend={{ val: 4.2, positive: true }} color="bg-sky-500" />
      </div>

      <TabBar tabs={[
        { id: "fees", label: "Fee Records", icon: Receipt },
        { id: "chart", label: "Collection Chart", icon: BarChart3 },
      ]} active={tab} onChange={setTab} />

      {tab === "fees" && (
        <>
          <Card className="p-3">
            <div className="flex gap-2">
              {(["all","paid","pending","overdue","partial"] as const).map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${statusFilter===s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
                  {s.charAt(0).toUpperCase()+s.slice(1)}
                </button>
              ))}
            </div>
          </Card>
          <Card>
            <Table
              headers={["Student", "Grade", "Fee Type", "Amount", "Paid", "Due Date", "Status", "Actions"]}
              rows={filtered.map(f => [
                <span key="name" className="font-semibold">{f.studentName}</span>,
                <span key="grade">{f.grade}</span>,
                <span key="type">{f.feeType}</span>,
                <span key="amt" className="font-mono">ETB {f.amount.toLocaleString()}</span>,
                <span key="paid" className="font-mono">{f.paidAmount > 0 ? `ETB ${f.paidAmount.toLocaleString()}` : "—"}</span>,
                <span key="due" className="font-mono text-xs">{f.dueDate}</span>,
                <Badge key="st" variant={statusVariant[f.status]}>{t(f.status)}</Badge>,
                <div key="act" className="flex items-center gap-1">
                  <Btn size="sm" variant="outline"><Eye size={12} /></Btn>
                  {f.status !== "paid" && <Btn size="sm"><CreditCard size={12} />Pay</Btn>}
                </div>,
              ])}
            />
          </Card>
        </>
      )}

      {tab === "chart" && (
        <Card className="p-5">
          <h3 className="font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Fee Collection Trend (ETB)</h3>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={feeCollection}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickFormatter={v => `${v/1000}k`} />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }} formatter={(v: number) => [`ETB ${v.toLocaleString()}`, ""]} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="collected" fill="var(--chart-1)" radius={[3,3,0,0]} name="Collected" barSize={24} />
              <Bar dataKey="pending" fill="var(--chart-2)" radius={[3,3,0,0]} name="Pending" barSize={24} />
              <Line type="monotone" dataKey="collected" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}

function AnnouncementsView({ t }: { t: (k: string) => string }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [titleVal, setTitleVal] = useState("");
  const [bodyVal, setBodyVal] = useState("");
  const [priority, setPriority] = useState("medium");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Announcements</h2>
          <p className="text-sm text-muted-foreground">{ANNOUNCEMENTS.length} announcements · {ANNOUNCEMENTS.filter(a=>a.pinned).length} pinned</p>
        </div>
        <Btn size="sm" onClick={() => setModalOpen(true)}><Plus size={14} />Post Announcement</Btn>
      </div>

      <div className="space-y-3">
        {ANNOUNCEMENTS.map(a => (
          <Card key={a.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-none ${
                  a.priority === "high" ? "bg-red-100 dark:bg-red-900/30" :
                  a.priority === "medium" ? "bg-amber-100 dark:bg-amber-900/30" :
                  "bg-emerald-100 dark:bg-emerald-900/30"
                }`}>
                  <Megaphone size={18} className={
                    a.priority === "high" ? "text-red-600 dark:text-red-400" :
                    a.priority === "medium" ? "text-amber-600 dark:text-amber-400" :
                    "text-emerald-600 dark:text-emerald-400"
                  } />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold">{a.title}</h3>
                    {a.pinned && <Badge variant="info">Pinned</Badge>}
                    <Badge variant={a.priority==="high"?"danger":a.priority==="medium"?"warning":"success"}>{a.priority}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{a.body}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><User size={11} />{a.postedBy}</span>
                    <span className="flex items-center gap-1"><Clock size={11} />{new Date(a.postedAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Users size={11} />{a.audience.join(", ")}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1 flex-none">
                <button className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"><Edit size={14} /></button>
                <button className="p-1.5 rounded-md hover:bg-muted transition-colors text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Post New Announcement">
        <div className="space-y-3">
          <Input label="Title" value={titleVal} onChange={setTitleVal} placeholder="Announcement title..." />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold">Message</label>
            <textarea value={bodyVal} onChange={e => setBodyVal(e.target.value)} rows={4} placeholder="Write your announcement..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 resize-none" />
          </div>
          <Select label="Priority" value={priority} onChange={setPriority} options={[
            { value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }
          ]} />
          <Select label="Audience" value="all" onChange={() => {}} options={[
            { value: "all", label: "All" }, { value: "students", label: "Students Only" },
            { value: "teachers", label: "Teachers Only" }, { value: "parents", label: "Parents Only" }
          ]} />
          <div className="flex gap-2 pt-2">
            <Btn variant="outline" onClick={() => setModalOpen(false)} className="flex-1">{t("cancel")}</Btn>
            <Btn className="flex-1"><Send size={13} />Post</Btn>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function ClassesView({ t }: { t: (k: string) => string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Classes & Sections</h2>
          <p className="text-sm text-muted-foreground">{SCHOOL_CLASSES.length} grades · {SCHOOL_CLASSES.reduce((s,c)=>s+c.sections.length,0)} sections total</p>
        </div>
        <Btn size="sm"><Plus size={14} />Add Class</Btn>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {SCHOOL_CLASSES.map(c => (
          <Card key={c.id} className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>{c.name}</h3>
                <p className="text-sm text-muted-foreground">Homeroom: {c.homeroom}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <School size={22} className="text-primary" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-muted/40 text-center">
                <p className="text-xl font-bold">{c.students}</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 text-center">
                <p className="text-xl font-bold">{c.sections.length}</p>
                <p className="text-xs text-muted-foreground">Sections</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/40 text-center">
                <p className="text-xl font-bold">{SUBJECTS.filter(s => s.grades.includes(c.name.split(" ")[1])).length}</p>
                <p className="text-xs text-muted-foreground">Subjects</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              {c.sections.map(s => (
                <span key={s} className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">Section {s}</span>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h3 className="font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Subject Registry</h3>
        <Table
          headers={["Code", "Subject Name", "Teacher", "Periods/Week", "Grades"]}
          rows={SUBJECTS.map(s => [
            <span key="code" className="font-mono text-xs font-bold text-primary">{s.code}</span>,
            <span key="name" className="font-semibold">{s.name}</span>,
            <span key="teacher">{s.teacher}</span>,
            <Badge key="periods" variant="neutral">{s.periods} periods</Badge>,
            <div key="grades" className="flex gap-1">
              {s.grades.map(g => <Badge key={g} variant="info">G{g}</Badge>)}
            </div>,
          ])}
        />
      </Card>
    </div>
  );
}

function TimetableView({ t }: { t: (k: string) => string }) {
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
  const periods = ["Period 1\n7:30–8:20", "Period 2\n8:20–9:10", "Period 3\n9:10–10:00", "Break", "Period 4\n10:20–11:10", "Period 5\n11:10–12:00"];

  const subjectColors: Record<string,string> = {
    "Math": "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    "English": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "Physics": "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    "Biology": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    "Chemistry": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    "Amharic": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    "History": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    "---": "bg-muted text-muted-foreground",
    "PE": "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Weekly Timetable</h2>
          <p className="text-sm text-muted-foreground">Grade 10 — Section A · Semester 1, 2024</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="outline" size="sm"><Printer size={14} />Print</Btn>
          <Btn size="sm"><Edit size={14} />Edit Timetable</Btn>
        </div>
      </div>

      <Card className="p-2 overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-border">
              <th className="p-3 text-left text-xs font-semibold text-muted-foreground w-24">Period</th>
              {days.map(d => (
                <th key={d} className="p-3 text-center text-xs font-semibold text-muted-foreground">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {periods.map((period, pi) => (
              <tr key={pi} className={pi === 3 ? "bg-muted/30" : ""}>
                <td className="p-3">
                  <div className="text-xs font-semibold leading-tight whitespace-pre">{period}</div>
                </td>
                {days.map(day => {
                  const cell = pi === 3 ? "Break" : (TIMETABLE["Grade 10A"][day as keyof typeof TIMETABLE["Grade 10A"]]?.[pi < 3 ? pi : pi - 1] || "---");
                  return (
                    <td key={day} className="p-2 text-center">
                      {pi === 3 ? (
                        <span className="text-xs text-muted-foreground font-semibold">Recess</span>
                      ) : (
                        <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold ${subjectColors[cell] || "bg-muted text-muted-foreground"}`}>
                          {cell}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function LibraryView({ t }: { t: (k: string) => string }) {
  const books = [
    { id: "b1", title: "Advanced Mathematics for Ethiopian Grade 12", author: "Bekele Mulat", isbn: "978-99944-85-01-2", copies: 25, available: 18, category: "Mathematics", status: "available" },
    { id: "b2", title: "Physics Concepts & Applications", author: "Tesfaye Girma", isbn: "978-99944-85-02-9", copies: 20, available: 5, category: "Physics", status: "limited" },
    { id: "b3", title: "English Literature Anthology", author: "Various", isbn: "978-99944-85-03-6", copies: 30, available: 30, category: "English", status: "available" },
    { id: "b4", title: "Ethiopian History: Ancient to Modern", author: "Prof. Mesfin Woldemariam", isbn: "978-99944-85-04-3", copies: 15, available: 0, category: "History", status: "unavailable" },
    { id: "b5", title: "Biology: Life Sciences", author: "Alemu Bekele", isbn: "978-99944-85-05-0", copies: 22, available: 12, category: "Biology", status: "available" },
    { id: "b6", title: "Chemistry: A Molecular Approach", author: "Haile Selassie", isbn: "978-99944-85-06-7", copies: 18, available: 7, category: "Chemistry", status: "limited" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Library Management</h2>
          <p className="text-sm text-muted-foreground">{books.reduce((s,b)=>s+b.copies,0)} total books · {books.reduce((s,b)=>s+b.available,0)} available</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="outline" size="sm"><Download size={14} />Catalog</Btn>
          <Btn size="sm"><Plus size={14} />Add Book</Btn>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Library} label="Total Books" value={books.reduce((s,b)=>s+b.copies,0).toString()} color="bg-teal-500" />
        <StatCard icon={BookOpen} label="Available" value={books.reduce((s,b)=>s+b.available,0).toString()} color="bg-emerald-500" />
        <StatCard icon={BookMarked} label="Checked Out" value={books.reduce((s,b)=>s+(b.copies-b.available),0).toString()} color="bg-amber-500" />
        <StatCard icon={Users} label="Active Members" value="342" sub="students + staff" color="bg-violet-500" />
      </div>

      <Card>
        <Table
          headers={["Title", "Author", "ISBN", "Category", "Copies", "Available", "Status"]}
          rows={books.map(b => [
            <span key="title" className="font-semibold text-sm max-w-[200px] block truncate">{b.title}</span>,
            <span key="author" className="text-sm">{b.author}</span>,
            <span key="isbn" className="font-mono text-xs text-muted-foreground">{b.isbn}</span>,
            <Badge key="cat" variant="neutral">{b.category}</Badge>,
            <span key="copies" className="font-mono">{b.copies}</span>,
            <span key="avail" className="font-mono">{b.available}</span>,
            <Badge key="st" variant={b.status==="available"?"success":b.status==="limited"?"warning":"danger"}>
              {b.status}
            </Badge>,
          ])}
        />
      </Card>
    </div>
  );
}

function SettingsView({ t, lang, setLang, role, setRole }: {
  t: (k: string) => string; lang: Lang; setLang: (l: Lang) => void;
  role: Role; setRole: (r: Role) => void;
}) {
  const [tab, setTab] = useState("general");
  const [schoolName, setSchoolName] = useState("Addis Ababa International School");
  const [email, setEmail] = useState("admin@aais.edu.et");
  const [phone, setPhone] = useState("+251 11 123 4567");
  const [address, setAddress] = useState("Bole Road, Addis Ababa, Ethiopia");

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>System Settings</h2>
        <p className="text-sm text-muted-foreground">Manage school configuration and preferences</p>
      </div>

      <TabBar tabs={[
        { id: "general", label: "General", icon: Settings },
        { id: "roles", label: "Demo Role", icon: Shield },
        { id: "language", label: "Language", icon: Globe },
        { id: "security", label: "Security", icon: Lock },
      ]} active={tab} onChange={setTab} />

      {tab === "general" && (
        <Card className="p-5">
          <h3 className="font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>School Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="School Name" value={schoolName} onChange={setSchoolName} />
            <Input label="Email" value={email} onChange={setEmail} type="email" />
            <Input label="Phone" value={phone} onChange={setPhone} />
            <Input label="City" value="Addis Ababa" onChange={() => {}} />
            <Input label="Address" value={address} onChange={setAddress} className="sm:col-span-2" />
            <Select label="Academic Year" value="2024" onChange={() => {}} options={[{ value: "2024", label: "2024/2025" }, { value: "2023", label: "2023/2024" }]} />
            <Select label="Grading System" value="gpa4" onChange={() => {}} options={[{ value: "gpa4", label: "4.0 GPA Scale" }, { value: "percent", label: "Percentage (0–100)" }]} />
          </div>
          <div className="flex justify-end mt-4">
            <Btn><Check size={14} />Save Changes</Btn>
          </div>
        </Card>
      )}

      {tab === "roles" && (
        <Card className="p-5">
          <h3 className="font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>Switch Demo Role</h3>
          <p className="text-sm text-muted-foreground mb-4">Change your current role to preview different access levels.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {([
              { id: "super_admin", label: "Super Admin", icon: ShieldCheck, desc: "Full system access" },
              { id: "principal", label: "Principal", icon: School, desc: "School-wide management" },
              { id: "teacher", label: "Teacher", icon: BookOpen, desc: "Classes & grades" },
              { id: "student", label: "Student", icon: GraduationCap, desc: "Personal portal" },
              { id: "parent", label: "Parent", icon: Baby, desc: "Child monitoring" },
              { id: "accountant", label: "Accountant", icon: DollarSign, desc: "Finance only" },
            ] as const).map(r => (
              <button key={r.id} onClick={() => setRole(r.id as Role)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${role === r.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                <r.icon size={20} className={role === r.id ? "text-primary" : "text-muted-foreground"} />
                <p className="font-semibold text-sm mt-2">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </button>
            ))}
          </div>
        </Card>
      )}

      {tab === "language" && (
        <Card className="p-5">
          <h3 className="font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Language & Localization</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {([
              { code: "en" as Lang, label: "English", flag: "🇬🇧", desc: "Interface in English" },
              { code: "am" as Lang, label: "አማርኛ (Amharic)", flag: "🇪🇹", desc: "ኢንተርፌስ በአማርኛ" },
            ]).map(l => (
              <button key={l.code} onClick={() => setLang(l.code)}
                className={`p-5 rounded-xl border-2 text-left transition-all ${lang === l.code ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                <span className="text-3xl">{l.flag}</span>
                <p className="font-bold mt-2">{l.label}</p>
                <p className="text-xs text-muted-foreground">{l.desc}</p>
              </button>
            ))}
          </div>
        </Card>
      )}

      {tab === "security" && (
        <Card className="p-5">
          <h3 className="font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Security Settings</h3>
          <div className="space-y-4">
            {[
              { label: "Two-Factor Authentication", desc: "Require 2FA for all admin accounts", enabled: true },
              { label: "Password Policy", desc: "Enforce strong password requirements", enabled: true },
              { label: "Session Timeout", desc: "Auto-logout after 30 minutes of inactivity", enabled: true },
              { label: "Audit Logging", desc: "Log all system actions for compliance", enabled: true },
              { label: "IP Allowlisting", desc: "Restrict access to approved IP addresses", enabled: false },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between p-4 rounded-xl border border-border">
                <div>
                  <p className="font-semibold text-sm">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors flex-none cursor-pointer relative ${s.enabled ? "bg-primary" : "bg-muted"}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${s.enabled ? "left-6" : "left-1"}`} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function SchoolsListView({ t }: { t: (k: string) => string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Managed Schools</h2>
          <p className="text-sm text-muted-foreground">{SCHOOLS.length} schools · Multi-tenant platform</p>
        </div>
        <Btn size="sm"><Plus size={14} />Onboard School</Btn>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SCHOOLS.map(s => (
          <Card key={s.id} className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 size={22} className="text-primary" />
              </div>
              <Badge variant={s.status === "active" ? "success" : s.status === "trial" ? "warning" : "neutral"}>{s.plan}</Badge>
            </div>
            <h3 className="font-bold text-base leading-snug">{s.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin size={12} />{s.city}</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-2.5 rounded-lg bg-muted/40 text-center">
                <p className="text-lg font-bold">{s.students.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
              <div className="p-2.5 rounded-lg bg-muted/40 text-center">
                <p className="text-lg font-bold">{s.teachers}</p>
                <p className="text-xs text-muted-foreground">Teachers</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Since {s.founded}</span>
              <Btn size="sm" variant="ghost">Manage <ArrowRight size={12} /></Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ReportsView({ t }: { t: (k: string) => string }) {
  const reportTypes = [
    { icon: GraduationCap, title: "Student Summary Report", desc: "Full roster with attendance, GPA, and status", category: "Academic" },
    { icon: CalendarCheck, title: "Monthly Attendance Report", desc: "Daily breakdown of present, absent, and late", category: "Academic" },
    { icon: Award, title: "Exam Results Report", desc: "Subject-wise scores, ranks, and grade distribution", category: "Academic" },
    { icon: DollarSign, title: "Fee Collection Report", desc: "Collected, pending, and overdue by student", category: "Finance" },
    { icon: Banknote, title: "Payroll Report", desc: "Monthly salary disbursements by department", category: "Finance" },
    { icon: Users, title: "Teacher Performance Report", desc: "Attendance, class coverage, and student results", category: "HR" },
    { icon: FileText, title: "Report Cards (Bulk PDF)", desc: "Auto-generated PDF report cards for all students", category: "Academic" },
    { icon: BarChart3, title: "Analytics Summary", desc: "Executive KPI summary for school leadership", category: "Admin" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Reports & Exports</h2>
        <p className="text-sm text-muted-foreground">Generate and download reports in PDF or Excel format</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
        {reportTypes.map(r => (
          <Card key={r.title} className="p-5 flex items-start gap-4 hover:border-primary/40 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-none group-hover:bg-primary/20 transition-colors">
              <r.icon size={18} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{r.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
              <Badge variant="neutral" >{r.category}</Badge>
            </div>
            <div className="flex gap-1.5 flex-none">
              <Btn size="sm" variant="outline"><Download size={12} />PDF</Btn>
              <Btn size="sm" variant="ghost"><Download size={12} />XLS</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AnalyticsView({ t }: { t: (k: string) => string }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Advanced Analytics</h2>
        <p className="text-sm text-muted-foreground">Data-driven insights for school leadership</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Subject Performance Radar</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={subjectPerformance} barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="subject" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
              <YAxis domain={[0,100]} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="avg" fill="var(--chart-1)" radius={[3,3,0,0]} name="Class Average" />
              <Bar dataKey="highest" fill="var(--chart-2)" radius={[3,3,0,0]} name="Highest Score" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Grade Distribution Pie</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={gradeDistribution} cx="50%" cy="50%" outerRadius={90} dataKey="count" label={({ grade, percent }) => `${grade} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                {gradeDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h3 className="font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Fee Collection vs Enrollment Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={feeCollection}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickFormatter={v=>`${v/1000}k`} />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Area yAxisId="left" type="monotone" dataKey="collected" fill="var(--chart-1)" stroke="var(--chart-1)" fillOpacity={0.2} name="Collected (ETB)" />
              <Area yAxisId="left" type="monotone" dataKey="pending" fill="var(--chart-2)" stroke="var(--chart-2)" fillOpacity={0.2} name="Pending (ETB)" />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

function AdmissionsView({ t }: { t: (k: string) => string }) {
  const applications = [
    { id: "app1", name: "Liya Getachew", grade: "Grade 9", date: "2024-10-10", status: "pending", score: null },
    { id: "app2", name: "Nati Hailu", grade: "Grade 10", date: "2024-10-08", status: "approved", score: 85 },
    { id: "app3", name: "Biruk Tesfaye", grade: "Grade 9", date: "2024-10-05", status: "approved", score: 91 },
    { id: "app4", name: "Meron Bekele", grade: "Grade 11", date: "2024-10-03", status: "rejected", score: 42 },
    { id: "app5", name: "Abel Worku", grade: "Grade 9", date: "2024-09-28", status: "interview", score: null },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Admissions</h2>
          <p className="text-sm text-muted-foreground">{applications.length} applications · 2024/25 intake</p>
        </div>
        <div className="flex gap-2">
          <Btn variant="outline" size="sm"><Download size={14} />Export</Btn>
          <Btn size="sm"><FilePlus size={14} />New Application</Btn>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", val: applications.length, color: "bg-sky-500" },
          { label: "Approved", val: applications.filter(a=>a.status==="approved").length, color: "bg-emerald-500" },
          { label: "Pending", val: applications.filter(a=>a.status==="pending"||a.status==="interview").length, color: "bg-amber-500" },
          { label: "Rejected", val: applications.filter(a=>a.status==="rejected").length, color: "bg-red-500" },
        ].map(s => (
          <Card key={s.label} className="p-4 text-center">
            <p className="text-2xl font-bold">{s.val}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <Table
          headers={["Applicant", "Applying For", "Applied On", "Entrance Score", "Status", "Actions"]}
          rows={applications.map(a => [
            <span key="name" className="font-semibold">{a.name}</span>,
            <span key="grade">{a.grade}</span>,
            <span key="date" className="font-mono text-xs">{a.date}</span>,
            <span key="score" className="font-mono">{a.score !== null ? `${a.score}/100` : "—"}</span>,
            <Badge key="st" variant={a.status==="approved"?"success":a.status==="rejected"?"danger":a.status==="interview"?"info":"warning"}>
              {a.status}
            </Badge>,
            <div key="act" className="flex gap-1">
              <Btn size="sm" variant="outline"><Eye size={12} />Review</Btn>
              {a.status === "pending" && <Btn size="sm"><CheckCircle size={12} />Approve</Btn>}
            </div>,
          ])}
        />
      </Card>
    </div>
  );
}

function GenericPlaceholder({ title, icon: Icon, desc }: { title: string; icon: React.ElementType; desc: string }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{title}</h2>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
      <Card className="p-16 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Icon size={36} className="text-primary" />
        </div>
        <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>{title} Module</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          This module is available in the full production build. It includes complete CRUD operations,
          reporting, and Firebase integration.
        </p>
        <div className="flex gap-2 mt-6">
          <Btn variant="outline"><Download size={14} />Export Sample</Btn>
          <Btn><Plus size={14} />Get Started</Btn>
        </div>
      </Card>
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (role: Role) => void }) {
  const [emailVal, setEmailVal] = useState("principal@aais.edu.et");
  const [passVal, setPassVal] = useState("••••••••");
  const [selectedRole, setSelectedRole] = useState<Role>("principal");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(selectedRole); }, 1000);
  };

  const quickRoles: { role: Role; label: string; email: string; color: string }[] = [
    { role: "super_admin", label: "Super Admin", email: "superadmin@platform.et", color: "border-violet-400 bg-violet-50 dark:bg-violet-900/20" },
    { role: "principal", label: "Principal", email: "principal@aais.edu.et", color: "border-teal-400 bg-teal-50 dark:bg-teal-900/20" },
    { role: "teacher", label: "Teacher", email: "teacher@aais.edu.et", color: "border-sky-400 bg-sky-50 dark:bg-sky-900/20" },
    { role: "parent", label: "Parent", email: "parent@gmail.com", color: "border-amber-400 bg-amber-50 dark:bg-amber-900/20" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f172a] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #0d9488 0%, transparent 60%), radial-gradient(circle at 80% 20%, #d97706 0%, transparent 50%)" }} />
        <div className="relative z-10 text-center max-w-sm">
          <div className="w-20 h-20 rounded-2xl bg-teal-500 flex items-center justify-center mx-auto mb-6">
            <School size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-display)" }}>
            EthioSchool<br />Management Platform
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            A complete multi-tenant school management system for Ethiopian schools. Manage students, teachers, finances, and more from one unified platform.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-8">
            {[
              { icon: GraduationCap, label: "Student Portal" },
              { icon: Users, label: "Staff Management" },
              { icon: DollarSign, label: "Fee Tracking" },
              { icon: BarChart3, label: "Analytics" },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-2 p-3 rounded-lg bg-white/5 text-left">
                <f.icon size={16} className="text-teal-400 flex-none" />
                <span className="text-xs text-slate-300 font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="absolute bottom-6 text-xs text-slate-600">© 2024 EthioSchool Platform · All schools served</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <School size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>EthioSchool</h1>
          </div>

          <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>Welcome back</h2>
          <p className="text-sm text-muted-foreground mb-6">Sign in to your school management account</p>

          {/* Quick role select */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-muted-foreground mb-2">QUICK DEMO LOGIN</p>
            <div className="grid grid-cols-2 gap-2">
              {quickRoles.map(r => (
                <button key={r.role} onClick={() => { setSelectedRole(r.role); setEmailVal(r.email); }}
                  className={`p-2.5 rounded-xl border-2 text-left transition-all ${selectedRole === r.role ? r.color + " border-opacity-100" : "border-border hover:border-primary/40"}`}>
                  <p className="text-xs font-bold">{r.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{r.email}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Input label="Email Address" value={emailVal} onChange={setEmailVal} type="email" placeholder="you@school.et" />
            <Input label="Password" value={passVal} onChange={setPassVal} type="password" placeholder="••••••••" />
          </div>

          <div className="flex items-center justify-end mt-2 mb-5">
            <button className="text-xs text-primary hover:underline font-semibold">Forgot password?</button>
          </div>

          <button onClick={handleLogin} disabled={loading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-60">
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <ArrowRight size={16} />}
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Multi-tenant school management · Powered by Firebase
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ view, setView, role, lang, t, collapsed, setCollapsed }: {
  view: View; setView: (v: View) => void; role: Role;
  lang: Lang; t: (k: string) => string;
  collapsed: boolean; setCollapsed: (v: boolean) => void;
}) {
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Overview: true, People: true, Academics: true, Finance: true, Campus: false, Communication: false, System: false
  });

  const groups = [...NAV_GROUPS];
  if (role === "super_admin") {
    groups[0] = { ...groups[0], items: [SUPER_ADMIN_EXTRA, ...groups[0].items] };
  }

  const toggleGroup = (label: string) => setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));

  return (
    <aside className={`flex-none flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ${collapsed ? "w-[60px]" : "w-[220px]"} overflow-hidden`}>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-sidebar-border flex-none">
        <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center flex-none">
          <School size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-bold truncate text-white" style={{ fontFamily: "var(--font-display)" }}>EthioSchool</p>
            <p className="text-[10px] text-sidebar-foreground/50 truncate">{role === "super_admin" ? "Platform Admin" : t("schoolName").substring(0,20)+"…"}</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {groups.map(group => (
          <div key={group.label}>
            {!collapsed && (
              <button onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground/40 hover:text-sidebar-foreground/70 transition-colors">
                {group.label}
                {openGroups[group.label] ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
              </button>
            )}
            {(collapsed || openGroups[group.label]) && group.items.map(item => {
              const Icon = item.icon;
              const isActive = view === item.id;
              return (
                <button key={item.id} onClick={() => setView(item.id as View)}
                  title={collapsed ? t(item.label) || item.label : undefined}
                  className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-all group
                    ${isActive ? "bg-sidebar-primary/20 text-sidebar-primary font-semibold" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"}`}>
                  <Icon size={16} className={`flex-none ${isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"}`} />
                  {!collapsed && <span className="truncate">{t(item.label) || item.label}</span>}
                  {isActive && !collapsed && <div className="ml-auto w-1 h-1 rounded-full bg-sidebar-primary flex-none" />}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-sidebar-border p-2">
        <button onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors text-xs">
          {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────

function TopBar({ role, t, view, isDark, toggleDark, onLogout, lang }: {
  role: Role; t: (k: string) => string; view: View;
  isDark: boolean; toggleDark: () => void; onLogout: () => void;
  lang: Lang;
}) {
  const breadcrumb = (view as string).replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const roleLabels: Record<Role, string> = {
    super_admin: "Super Admin", school_owner: "School Owner", principal: "Principal",
    vice_principal: "Vice Principal", teacher: "Teacher", student: "Student",
    parent: "Parent", accountant: "Accountant", registrar: "Registrar",
  } as any;

  return (
    <header className="h-14 flex-none border-b border-border bg-card/80 backdrop-blur-sm flex items-center px-4 gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Home size={11} />
          <ChevronRight size={10} />
          <span className="text-foreground font-semibold">{breadcrumb}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground relative">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>
        <button onClick={toggleDark} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground">
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="flex items-center gap-2 ml-1 pl-3 border-l border-border">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <User size={14} className="text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold leading-tight">
              {role === "super_admin" ? "Platform Admin" : role === "principal" ? "Almaz Bekele" : role === "teacher" ? "Dr. Alem Kebede" : "Demo User"}
            </p>
            <p className="text-[10px] text-muted-foreground">{roleLabels[role]}</p>
          </div>
          <button onClick={onLogout} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground" title="Logout">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>("principal");
  const [view, setView] = useState<View>("dashboard");
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [firestoreEnabled, setFirestoreEnabled] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  const t = useCallback((key: string): string => i18n[lang][key] || key, [lang]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.style.fontFamily = "var(--font-sans)";
  }, [isDark]);

  const handleLogin = (selectedRole: Role) => {
    setRole(selectedRole);
    setIsAuthenticated(true);
    setView("dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView("dashboard");
  };

  const toggleFirestore = async () => {
    if (!firestoreEnabled) {
      setDataLoading(true);
      try {
        const { seedDatabase } = await import("../lib/seedData");
        await seedDatabase();
        setFirestoreEnabled(true);
      } catch (error) {
        console.error("Failed to enable Firestore:", error);
      } finally {
        setDataLoading(false);
      }
    } else {
      setFirestoreEnabled(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ fontFamily: "var(--font-sans)" }}>
        <LoginScreen onLogin={handleLogin} />
      </div>
    );
  }

  const renderView = () => {
    switch (view) {
      case "dashboard": return <DashboardView t={t} role={role} />;
      case "students": return <StudentsView t={t} />;
      case "teachers": return <TeachersView t={t} />;
      case "attendance": return <AttendanceView t={t} />;
      case "exams":
      case "grades": return <ExamsView t={t} />;
      case "fees":
      case "payments": return <FeesView t={t} />;
      case "announcements": return <AnnouncementsView t={t} />;
      case "classes":
      case "sections":
      case "subjects": return <ClassesView t={t} />;
      case "timetable": return <TimetableView t={t} />;
      case "library": return <LibraryView t={t} />;
      case "settings": return <SettingsView t={t} lang={lang} setLang={setLang} role={role} setRole={r => { setRole(r); setView("dashboard"); }} />;
      case "schools_list": return <SchoolsListView t={t} />;
      case "reports": return <ReportsView t={t} />;
      case "analytics": return <AnalyticsView t={t} />;
      case "admissions": return <AdmissionsView t={t} />;
      case "payroll": return <TeachersView t={t} />;
      case "transport": return <GenericPlaceholder title="Transport Management" icon={Bus} desc="Manage school buses, routes, and student assignments" />;
      case "inventory": return <GenericPlaceholder title="Inventory Management" icon={Package} desc="Track school assets, equipment, and supplies" />;
      case "events": return <GenericPlaceholder title="Events & Calendar" icon={Star} desc="Schedule and manage school events, holidays, and activities" />;
      case "messages": return <GenericPlaceholder title="Internal Messaging" icon={MessageSquare} desc="Send and receive messages between staff, parents, and students" />;
      case "notifications": return <GenericPlaceholder title="Notifications Center" icon={Bell} desc="Push notifications, SMS alerts, and email digests" />;
      case "homework": return <GenericPlaceholder title="Homework & Assignments" icon={BookMarked} desc="Assign, submit, and grade homework digitally" />;
      case "discipline": return <GenericPlaceholder title="Discipline Records" icon={Shield} desc="Track behavioral incidents, warnings, and resolutions" />;
      case "certificates": return <GenericPlaceholder title="Certificates & Credentials" icon={Award} desc="Generate and manage student certificates and awards" />;
      case "audit_logs": return <GenericPlaceholder title="Audit Logs" icon={ClipboardList} desc="Full audit trail of all system actions with timestamps and users" />;
      case "promotion": return <GenericPlaceholder title="Grade Promotion" icon={ArrowUpRight} desc="Promote or retain students at end of academic year" />;
      case "graduation": return <GenericPlaceholder title="Graduation Management" icon={GraduationCap} desc="Manage graduation ceremony, certificates, and alumni records" />;
      case "hostel": return <GenericPlaceholder title="Hostel Management" icon={Home} desc="Manage boarding facilities, rooms, and student accommodation" />;
      case "report_cards": return <GenericPlaceholder title="Report Cards" icon={FileText} desc="Generate and distribute student report cards in PDF format" />;
      case "question_bank": return <GenericPlaceholder title="Question Bank" icon={HelpCircle} desc="Create and manage reusable exam questions by subject and difficulty" />;
      case "transcripts": return <GenericPlaceholder title="Transcripts" icon={BookOpen} desc="Generate official student academic transcripts" />;
      default: return <DashboardView t={t} role={role} />;
    }
  };

  return (
    <div style={{ fontFamily: "var(--font-sans)" }} className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileNavOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 z-50">
            <Sidebar view={view} setView={v => { setView(v); setMobileNavOpen(false); }} role={role} lang={lang} t={t} collapsed={false} setCollapsed={() => {}} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar view={view} setView={setView} role={role} lang={lang} t={t} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile topbar menu button */}
        <div className="lg:hidden flex items-center h-14 px-4 border-b border-border bg-card/80 gap-3">
          <button onClick={() => setMobileNavOpen(true)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <School size={13} className="text-white" />
            </div>
            <span className="font-bold text-sm" style={{ fontFamily: "var(--font-display)" }}>EthioSchool</span>
          </div>
          <button onClick={() => setIsDark(!isDark)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
            <LogOut size={16} />
          </button>
        </div>

        {/* Desktop topbar */}
        <div className="hidden lg:block">
          <TopBar role={role} t={t} view={view} isDark={isDark} toggleDark={() => setIsDark(!isDark)} onLogout={handleLogout} lang={lang} />
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
