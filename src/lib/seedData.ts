import { collection, writeBatch, doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { School, Student, Teacher, Class, Subject, Fee, Announcement, ExamResult } from '../types';

const SCHOOL_ID = 'demo-school-001';

const sampleStudents: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { schoolId: SCHOOL_ID, name: "Abebe Girma", studentId: "STU-2024-001", grade: "Grade 10", section: "A", gender: "M", dob: "2008-03-15", phone: "0911-234-567", address: "Addis Ababa, Bole", parentName: "Girma Tadesse", parentPhone: "0912-345-678", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop", enrollmentDate: "2019-09-01", status: "active", gpa: 3.8, attendance: 94, bloodGroup: "O+", religion: "Orthodox" },
  { schoolId: SCHOOL_ID, name: "Tigist Haile", studentId: "STU-2024-002", grade: "Grade 10", section: "A", gender: "F", dob: "2008-06-22", phone: "0912-345-678", address: "Addis Ababa, Kazanchis", parentName: "Haile Bekele", parentPhone: "0913-456-789", photo: "https://images.unsplash.com/photo-1494790108755-2616b332c9f0?w=80&h=80&fit=crop", enrollmentDate: "2019-09-01", status: "active", gpa: 3.9, attendance: 97, bloodGroup: "A+", religion: "Orthodox" },
  { schoolId: SCHOOL_ID, name: "Dawit Mengistu", studentId: "STU-2024-003", grade: "Grade 11", section: "B", gender: "M", dob: "2007-01-10", phone: "0913-456-789", address: "Addis Ababa, Piazza", parentName: "Mengistu Alemu", parentPhone: "0914-567-890", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop", enrollmentDate: "2018-09-01", status: "active", gpa: 3.5, attendance: 88, bloodGroup: "B+", religion: "Muslim" },
  { schoolId: SCHOOL_ID, name: "Hana Tesfaye", studentId: "STU-2024-004", grade: "Grade 11", section: "A", gender: "F", dob: "2007-08-30", phone: "0914-567-890", address: "Addis Ababa, Merkato", parentName: "Tesfaye Worku", parentPhone: "0915-678-901", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop", enrollmentDate: "2018-09-01", status: "active", gpa: 4.0, attendance: 99, bloodGroup: "AB+", religion: "Orthodox" },
  { schoolId: SCHOOL_ID, name: "Yonas Bekele", studentId: "STU-2024-005", grade: "Grade 12", section: "A", gender: "M", dob: "2006-11-05", phone: "0915-678-901", address: "Addis Ababa, Megenagna", parentName: "Bekele Hailu", parentPhone: "0916-789-012", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop", enrollmentDate: "2017-09-01", status: "active", gpa: 3.7, attendance: 92, bloodGroup: "O-", religion: "Protestant" },
  { schoolId: SCHOOL_ID, name: "Sara Alemu", studentId: "STU-2024-006", grade: "Grade 9", section: "C", gender: "F", dob: "2009-04-18", phone: "0916-789-012", address: "Addis Ababa, CMC", parentName: "Alemu Girma", parentPhone: "0917-890-123", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop", enrollmentDate: "2020-09-01", status: "active", gpa: 3.6, attendance: 91, bloodGroup: "A-", religion: "Orthodox" },
  { schoolId: SCHOOL_ID, name: "Mikael Tadesse", studentId: "STU-2024-007", grade: "Grade 9", section: "B", gender: "M", dob: "2009-12-01", phone: "0917-890-123", address: "Addis Ababa, Ayat", parentName: "Tadesse Lemma", parentPhone: "0918-901-234", photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&h=80&fit=crop", enrollmentDate: "2020-09-01", status: "active", gpa: 3.2, attendance: 85, bloodGroup: "B-", religion: "Orthodox" },
  { schoolId: SCHOOL_ID, name: "Selamawit Worku", studentId: "STU-2024-008", grade: "Grade 12", section: "B", gender: "F", dob: "2006-07-14", phone: "0918-901-234", address: "Addis Ababa, Gerji", parentName: "Worku Haile", parentPhone: "0919-012-345", photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&h=80&fit=crop", enrollmentDate: "2017-09-01", status: "active", gpa: 3.9, attendance: 96, bloodGroup: "O+", religion: "Muslim" },
];

const sampleTeachers: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { schoolId: SCHOOL_ID, name: "Dr. Alem Kebede", employeeId: "EMP-001", subject: "Mathematics", classes: ["Grade 10A", "Grade 11B", "Grade 12A"], phone: "0911-111-222", email: "alem.kebede@school.et", photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop", hireDate: "2015-09-01", salary: 18500, status: "active", qualification: "PhD Mathematics", experience: 12 },
  { schoolId: SCHOOL_ID, name: "Ato Berhane Desta", employeeId: "EMP-002", subject: "Physics", classes: ["Grade 11A", "Grade 12B"], phone: "0912-222-333", email: "berhane.desta@school.et", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop", hireDate: "2018-01-15", salary: 15000, status: "active", qualification: "MSc Physics", experience: 8 },
  { schoolId: SCHOOL_ID, name: "W/ro Mekdes Hailu", employeeId: "EMP-003", subject: "English", classes: ["Grade 9A", "Grade 9B", "Grade 10B"], phone: "0913-333-444", email: "mekdes.hailu@school.et", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop", hireDate: "2016-09-01", salary: 14000, status: "active", qualification: "BA English Literature", experience: 10 },
  { schoolId: SCHOOL_ID, name: "Ato Fekadu Lemma", employeeId: "EMP-004", subject: "Biology", classes: ["Grade 11B", "Grade 12A"], phone: "0914-444-555", email: "fekadu.lemma@school.et", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop", hireDate: "2020-09-01", salary: 13500, status: "active", qualification: "BSc Biology", experience: 5 },
  { schoolId: SCHOOL_ID, name: "W/rt Meseret Alemu", employeeId: "EMP-005", subject: "Chemistry", classes: ["Grade 10A", "Grade 11A"], phone: "0915-555-666", email: "meseret.alemu@school.et", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop", hireDate: "2019-03-01", salary: 14500, status: "on_leave", qualification: "MSc Chemistry", experience: 7 },
  { schoolId: SCHOOL_ID, name: "Ato Girma Tesfaye", employeeId: "EMP-006", subject: "History", classes: ["Grade 9C", "Grade 10B"], phone: "0916-666-777", email: "girma.tesfaye@school.et", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop", hireDate: "2017-09-01", salary: 13000, status: "active", qualification: "BA History", experience: 9 },
];

const sampleClasses: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { schoolId: SCHOOL_ID, name: "Grade 9", grade: "9", sections: ["A", "B", "C"], students: 135, homeroom: "W/ro Mekdes Hailu", academicYear: "2024-2025" },
  { schoolId: SCHOOL_ID, name: "Grade 10", grade: "10", sections: ["A", "B"], students: 98, homeroom: "Dr. Alem Kebede", academicYear: "2024-2025" },
  { schoolId: SCHOOL_ID, name: "Grade 11", grade: "11", sections: ["A", "B"], students: 87, homeroom: "Ato Berhane Desta", academicYear: "2024-2025" },
  { schoolId: SCHOOL_ID, name: "Grade 12", grade: "12", sections: ["A", "B"], students: 76, homeroom: "Ato Girma Tesfaye", academicYear: "2024-2025" },
];

const sampleSubjects: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { schoolId: SCHOOL_ID, name: "Mathematics", code: "MATH", teacher: "Dr. Alem Kebede", teacherId: "", periods: 6, grades: ["9", "10", "11", "12"] },
  { schoolId: SCHOOL_ID, name: "Physics", code: "PHY", teacher: "Ato Berhane Desta", teacherId: "", periods: 5, grades: ["10", "11", "12"] },
  { schoolId: SCHOOL_ID, name: "English", code: "ENG", teacher: "W/ro Mekdes Hailu", teacherId: "", periods: 6, grades: ["9", "10", "11", "12"] },
  { schoolId: SCHOOL_ID, name: "Biology", code: "BIO", teacher: "Ato Fekadu Lemma", teacherId: "", periods: 5, grades: ["9", "10", "11", "12"] },
  { schoolId: SCHOOL_ID, name: "Chemistry", code: "CHEM", teacher: "W/rt Meseret Alemu", teacherId: "", periods: 5, grades: ["10", "11", "12"] },
  { schoolId: SCHOOL_ID, name: "History", code: "HIST", teacher: "Ato Girma Tesfaye", teacherId: "", periods: 4, grades: ["9", "10", "11", "12"] },
];

const sampleAnnouncements: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { schoolId: SCHOOL_ID, title: "Second Semester Exam Schedule Released", body: "The examination schedule for the second semester has been finalized. All Grade 10-12 students must review the timetable posted on the school notice board. Exams begin on November 15, 2024.", audience: ["all"], postedBy: "Principal Almaz Bekele", postedAt: "2024-10-15T09:00:00", priority: "high", pinned: true },
  { schoolId: SCHOOL_ID, title: "Parent-Teacher Conference - October 25", body: "We are hosting our quarterly Parent-Teacher Conference on October 25, 2024 from 9:00 AM to 4:00 PM. All parents are strongly encouraged to attend.", audience: ["parents", "teachers"], postedBy: "Vice Principal Haile Worku", postedAt: "2024-10-12T14:30:00", priority: "high", pinned: true },
  { schoolId: SCHOOL_ID, title: "School Library New Arrivals", body: "The school library has received over 200 new books across Science, Mathematics, Literature, and Ethiopian History. Students may borrow up to 3 books at a time.", audience: ["students", "teachers"], postedBy: "Librarian Selamawit Girma", postedAt: "2024-10-10T10:00:00", priority: "low", pinned: false },
  { schoolId: SCHOOL_ID, title: "Football Tournament - Registration Open", body: "Inter-school football tournament registration is now open. Register with the PE department by October 20, 2024.", audience: ["students"], postedBy: "PE Teacher Dawit Lemma", postedAt: "2024-10-08T08:00:00", priority: "medium", pinned: false },
];

const sampleFees: Omit<Fee, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { schoolId: SCHOOL_ID, studentId: "s1", studentName: "Abebe Girma", grade: "Grade 10", feeType: "Tuition Fee", amount: 15000, dueDate: "2024-10-01", paidDate: "2024-09-28", status: "paid", paidAmount: 15000, academicYear: "2024-2025" },
  { schoolId: SCHOOL_ID, studentId: "s2", studentName: "Tigist Haile", grade: "Grade 10", feeType: "Tuition Fee", amount: 15000, dueDate: "2024-10-01", paidDate: null, status: "pending", paidAmount: 0, academicYear: "2024-2025" },
  { schoolId: SCHOOL_ID, studentId: "s3", studentName: "Dawit Mengistu", grade: "Grade 11", feeType: "Tuition Fee", amount: 16000, dueDate: "2024-09-15", paidDate: null, status: "overdue", paidAmount: 0, academicYear: "2024-2025" },
  { schoolId: SCHOOL_ID, studentId: "s4", studentName: "Hana Tesfaye", grade: "Grade 11", feeType: "Tuition Fee", amount: 16000, dueDate: "2024-10-01", paidDate: "2024-09-30", status: "paid", paidAmount: 16000, academicYear: "2024-2025" },
  { schoolId: SCHOOL_ID, studentId: "s5", studentName: "Yonas Bekele", grade: "Grade 12", feeType: "Tuition Fee", amount: 17000, dueDate: "2024-10-01", paidDate: "2024-10-01", status: "paid", paidAmount: 17000, academicYear: "2024-2025" },
  { schoolId: SCHOOL_ID, studentId: "s6", studentName: "Sara Alemu", grade: "Grade 9", feeType: "Tuition Fee", amount: 14000, dueDate: "2024-10-01", paidDate: null, status: "partial", paidAmount: 7000, academicYear: "2024-2025" },
];

const sampleExamResults: Omit<ExamResult, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { schoolId: SCHOOL_ID, studentId: "s1", studentName: "Abebe Girma", subject: "Mathematics", subjectId: "", examType: "Midterm", score: 86, maxScore: 100, grade: "A", gpa: 4.0, academicYear: "2024-2025", term: "1" },
  { schoolId: SCHOOL_ID, studentId: "s1", studentName: "Abebe Girma", subject: "Physics", subjectId: "", examType: "Midterm", score: 78, maxScore: 100, grade: "B+", gpa: 3.5, academicYear: "2024-2025", term: "1" },
  { schoolId: SCHOOL_ID, studentId: "s1", studentName: "Abebe Girma", subject: "English", subjectId: "", examType: "Midterm", score: 90, maxScore: 100, grade: "A+", gpa: 4.0, academicYear: "2024-2025", term: "1" },
  { schoolId: SCHOOL_ID, studentId: "s2", studentName: "Tigist Haile", subject: "Mathematics", subjectId: "", examType: "Midterm", score: 94, maxScore: 100, grade: "A+", gpa: 4.0, academicYear: "2024-2025", term: "1" },
  { schoolId: SCHOOL_ID, studentId: "s2", studentName: "Tigist Haile", subject: "Biology", subjectId: "", examType: "Midterm", score: 88, maxScore: 100, grade: "A", gpa: 4.0, academicYear: "2024-2025", term: "1" },
  { schoolId: SCHOOL_ID, studentId: "s3", studentName: "Dawit Mengistu", subject: "Mathematics", subjectId: "", examType: "Midterm", score: 72, maxScore: 100, grade: "B", gpa: 3.0, academicYear: "2024-2025", term: "1" },
  { schoolId: SCHOOL_ID, studentId: "s4", studentName: "Hana Tesfaye", subject: "Chemistry", subjectId: "", examType: "Midterm", score: 97, maxScore: 100, grade: "A+", gpa: 4.0, academicYear: "2024-2025", term: "1" },
];

const sampleSchool: Omit<School, 'id' | 'createdAt' | 'updatedAt'> = {
  name: "Addis Ababa Secondary School",
  code: "AASS-001",
  address: "Bole Sub-City, Woreda 03",
  city: "Addis Ababa",
  phone: "+251-11-551-2345",
  email: "info@aass.edu.et",
  website: "https://aass.edu.et",
  establishedYear: 1985,
  status: "active",
  subscriptionPlan: "premium",
  subscriptionExpiry: "2025-12-31",
};

export async function seedDatabase(): Promise<void> {
  const schoolRef = doc(db, 'schools', SCHOOL_ID);
  const schoolDoc = await getDoc(schoolRef);

  if (schoolDoc.exists()) {
    console.log('Database already seeded');
    return;
  }

  const batch = writeBatch(db);

  // Create school
  batch.set(schoolRef, {
    ...sampleSchool,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Create students
  sampleStudents.forEach((student, index) => {
    const ref = doc(collection(db, 'students'));
    batch.set(ref, {
      ...student,
      id: `s${index + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  // Create teachers
  sampleTeachers.forEach((teacher, index) => {
    const ref = doc(collection(db, 'teachers'));
    batch.set(ref, {
      ...teacher,
      id: `t${index + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  // Create classes
  sampleClasses.forEach((cls, index) => {
    const ref = doc(collection(db, 'classes'));
    batch.set(ref, {
      ...cls,
      id: `c${index + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  // Create subjects
  sampleSubjects.forEach((subject, index) => {
    const ref = doc(collection(db, 'subjects'));
    batch.set(ref, {
      ...subject,
      id: `sub${index + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  // Create announcements
  sampleAnnouncements.forEach((ann, index) => {
    const ref = doc(collection(db, 'announcements'));
    batch.set(ref, {
      ...ann,
      id: `a${index + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  // Create fees
  sampleFees.forEach((fee, index) => {
    const ref = doc(collection(db, 'fees'));
    batch.set(ref, {
      ...fee,
      id: `f${index + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  // Create exam results
  sampleExamResults.forEach((result, index) => {
    const ref = doc(collection(db, 'examResults'));
    batch.set(ref, {
      ...result,
      id: `er${index + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  await batch.commit();
  console.log('Database seeded successfully');
}

export { SCHOOL_ID };
