import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import RoleProtectedRoute from './components/auth/RoleProtectedRoute'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import LoadingIndicator from './components/LoadingIndicator'
import FloatingAIAssistant from './components/FloatingAIAssistant'

// Lazy-loaded page-level components
const AdminDashboard = lazy(() => import('./pages/DashboardPage'))
const PrincipalDashboard = lazy(() => import('./pages/PrincipalDashboard'))
const TeacherDashboard = lazy(() => import('./pages/TeacherDashboard'))
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'))
const ChatPage = lazy(() => import('./pages/ChatPage'))
const AskAiPage = lazy(() => import('./pages/AskAiPage'))
const DocumentPage = lazy(() => import('./pages/DocumentPage'))
const AssignmentPage = lazy(() => import('./pages/AssignmentPage'))
const CreateAssignmentPage = lazy(() => import('./pages/CreateAssignmentPage'))
const EditAssignmentPage = lazy(() => import('./pages/EditAssignmentPage'))
const AssignmentDetailsPage = lazy(() => import('./pages/AssignmentDetailsPage'))
const SubmissionPage = lazy(() => import('./pages/SubmissionPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))
const NotificationPage = lazy(() => import('./pages/NotificationPage'))
const UsersPage = lazy(() => import('./pages/UsersPage'))
const CoursePage = lazy(() => import('./pages/CoursePage'))
const CourseDetailsPage = lazy(() => import('./pages/CourseDetailsPage'))
const CreateCoursePage = lazy(() => import('./pages/CreateCoursePage'))
const EditCoursePage = lazy(() => import('./pages/EditCoursePage'))
const AdminStudentsPage = lazy(() => import('./pages/StudentsPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Main Admin Module pages
const MainAdminDashboard = lazy(() => import('./pages/MainAdminDashboard'))
const SchoolsPage = lazy(() => import('./pages/SchoolsPage'))
const SchoolDetailsPage = lazy(() => import('./pages/SchoolDetailsPage'))
const CreateSchoolPage = lazy(() => import('./pages/CreateSchoolPage'))
const EditSchoolPage = lazy(() => import('./pages/EditSchoolPage'))
const SchoolAdminsPage = lazy(() => import('./pages/SchoolAdminsPage'))
const EditSchoolAdminPage = lazy(() => import('./pages/EditSchoolAdminPage'))
const CreateSchoolAdminPage = lazy(() => import('./pages/CreateSchoolAdminPage'))
const SchoolAdminDetailsPage = lazy(() => import('./pages/SchoolAdminDetailsPage'))
const SubscriptionsPage = lazy(() => import('./pages/SubscriptionsPage'))
const AdminAnalyticsPage = lazy(() => import('./pages/AdminAnalyticsPage'))
const AuditLogsPage = lazy(() => import('./pages/AuditLogsPage'))

// School Admin Module pages
const SchoolDashboard = lazy(() => import('./pages/school/SchoolDashboard'))

// Examination & Assessment Module pages
const ExamDashboard = lazy(() => import('./pages/exam/ExamDashboard'))
const CreateExam = lazy(() => import('./pages/exam/CreateExam'))
const ManageExams = lazy(() => import('./pages/exam/ManageExams'))
const ViewResults = lazy(() => import('./pages/exam/ViewResults'))
const ExamAnalytics = lazy(() => import('./pages/exam/ExamAnalytics'))
const UpcomingExams = lazy(() => import('./pages/exam/UpcomingExams'))
const MyResults = lazy(() => import('./pages/exam/MyResults'))
const PracticeTests = lazy(() => import('./pages/exam/PracticeTests'))

// AI Knowledge Center Module pages
const KnowledgeDashboard = lazy(() => import('./pages/knowledge/KnowledgeDashboard'))
const UploadDocuments = lazy(() => import('./pages/knowledge/UploadDocuments'))
const KnowledgeLibrary = lazy(() => import('./pages/knowledge/KnowledgeLibrary'))
const DocumentDetails = lazy(() => import('./pages/knowledge/DocumentDetails'))
const AISearch = lazy(() => import('./pages/knowledge/AISearch'))
const Collections = lazy(() => import('./pages/knowledge/Collections'))
const ProcessingQueue = lazy(() => import('./pages/knowledge/ProcessingQueue'))
const AIChat = lazy(() => import('./pages/knowledge/AIChat'))

// Student Portal pages
const StudentPortalDashboard = lazy(() => import('./pages/student/StudentDashboard'))
const MyCoursesPage = lazy(() => import('./pages/student/MyCoursesPage'))
const StudentAssignmentsPage = lazy(() => import('./pages/student/StudentAssignmentsPage'))
const AssignmentSubmissionPage = lazy(() => import('./pages/student/AssignmentSubmissionPage'))
const StudentAttendancePage = lazy(() => import('./pages/student/StudentAttendancePage'))
const StudentGradesPage = lazy(() => import('./pages/student/StudentGradesPage'))
const StudentStudyMaterialsPage = lazy(() => import('./pages/student/StudentStudyMaterialsPage'))
const StudentAITutorPage = lazy(() => import('./pages/student/StudentAITutorPage'))
const AIHomeworkHelperPage = lazy(() => import('./pages/student/AIHomeworkHelperPage'))
const AIQuizPracticePage = lazy(() => import('./pages/student/AIQuizPracticePage'))
const StudentDocumentsPage = lazy(() => import('./pages/student/StudentDocumentsPage'))
const StudentCalendarPage = lazy(() => import('./pages/student/StudentCalendarPage'))
const StudentNotificationsPage = lazy(() => import('./pages/student/StudentNotificationsPage'))
const StudentProfilePage = lazy(() => import('./pages/student/StudentProfilePage'))
const StudentSettingsPage = lazy(() => import('./pages/student/StudentSettingsPage'))

// Teacher Portal pages
const TeacherPortalDashboard = lazy(() => import('./pages/teacher/TeacherPortalDashboard'))
const MyClassesPage = lazy(() => import('./pages/teacher/MyClassesPage'))
const AttendancePage = lazy(() => import('./pages/teacher/AttendancePage'))
const TeacherAssignmentsPage = lazy(() => import('./pages/teacher/TeacherAssignmentsPage'))
const AILessonPlannerPage = lazy(() => import('./pages/teacher/AILessonPlannerPage'))
const AIQuizGeneratorPage = lazy(() => import('./pages/teacher/AIQuizGeneratorPage'))
const HomeworkReviewPage = lazy(() => import('./pages/teacher/HomeworkReviewPage'))
const GradebookPage = lazy(() => import('./pages/teacher/GradebookPage'))
const StudyMaterialsPage = lazy(() => import('./pages/teacher/StudyMaterialsPage'))
const StudentAnalyticsPage = lazy(() => import('./pages/teacher/StudentAnalyticsPage'))
const TeacherNotificationsPage = lazy(() => import('./pages/teacher/TeacherNotificationsPage'))
const SchoolProfilePage = lazy(() => import('./pages/school/SchoolProfilePage'))
const AcademicYearsPage = lazy(() => import('./pages/school/AcademicYearsPage'))
const ClassesPage = lazy(() => import('./pages/school/ClassesPage'))
const SectionsPage = lazy(() => import('./pages/school/SectionsPage'))
const SubjectsPage = lazy(() => import('./pages/school/SubjectsPage'))
const TeachersPage = lazy(() => import('./pages/school/TeachersPage'))
const StudentsPage = lazy(() => import('./pages/school/StudentsPage'))
const DepartmentsPage = lazy(() => import('./pages/school/DepartmentsPage'))
const TimetablePage = lazy(() => import('./pages/school/TimetablePage'))
const AnnouncementsPage = lazy(() => import('./pages/school/AnnouncementsPage'))
const SchoolSettingsPage = lazy(() => import('./pages/school/SchoolSettingsPage'))

// Role constants
const ROLE_SUPER_ADMIN = 'ROLE_SUPER_ADMIN'
const ROLE_ADMIN = 'ROLE_ADMIN'
const ROLE_PRINCIPAL = 'ROLE_PRINCIPAL'
const ROLE_SCHOOL_ADMIN = 'ROLE_SCHOOL_ADMIN'
const ROLE_TEACHER = 'ROLE_TEACHER'
const ROLE_STUDENT = 'ROLE_STUDENT'

/**
 * Role-based sidebar component that displays navigation based on user role
 */
function RoleBasedSidebar({ open, onClose }) {
  const { user } = useAuth()
  return <Sidebar user={user} open={open} onClose={onClose} />
}

/**
 * Role-based topbar component that displays title based on current route
 */
function RoleBasedTopbar({ onMenu }) {
  const { user } = useAuth()
  const { pathname } = useLocation()
  
  // Route titles based on path
  const TITLES = {
    '/admin': 'Admin Dashboard',
    '/admin/analytics': 'AI Analytics',
    '/admin/documents': 'Document Management',
    '/admin/assignments': 'Assignments',
    '/admin/assignments/new': 'Create Assignment',
    '/admin/submissions': 'Submissions',
    '/admin/schools': 'Schools',
    '/admin/schools/new': 'Create School',
    '/admin/school-admins': 'School Admins',
    '/admin/subscriptions': 'Subscriptions',
    '/admin/audit-logs': 'Audit Logs',
    '/principal': 'Principal Dashboard',
    '/principal/ai': 'AI Dashboard',
    '/principal/documents': 'Document Management',
    '/teacher': 'Teacher Dashboard',
    '/teacher/ai': 'AI Assistant',
    '/teacher/documents': 'Document Management',
    '/student': 'Student Dashboard',
    '/student/courses': 'My Courses',
    '/student/assignments': 'Assignments',
    '/student/submit-assignment': 'Submit Assignment',
    '/student/attendance': 'Attendance',
    '/student/grades': 'Grades & Report Card',
    '/student/study-materials': 'Study Materials',
    '/student/ai-tutor': 'AI Tutor',
    '/student/ai-homework-helper': 'AI Homework Helper',
    '/student/ai-quiz-practice': 'AI Quiz Practice',
    '/student/documents': 'My Documents',
    '/student/calendar': 'Calendar',
    '/student/notifications': 'Notifications',
    '/student/profile': 'My Profile',
    '/student/settings': 'Settings',
    '/student/ai': 'AI Assistant',
    '/unauthorized': 'Access Denied',
    '/admin/chat': 'Chat',
    '/school': 'School Dashboard',
    '/school/profile': 'School Profile',
    '/school/academic-years': 'Academic Years',
    '/school/classes': 'Classes',
    '/school/sections': 'Sections',
    '/school/subjects': 'Subjects',
    '/school/teachers': 'Teachers',
    '/school/students': 'Students',
    '/school/departments': 'Departments',
    '/school/timetable': 'Timetable',
    '/school/announcements': 'Announcements',
    '/school/settings': 'School Settings',
    '/school/documents': 'Documents',
    '/exam/create': 'Create Exam',
    '/exam/manage': 'Manage Exams',
    '/exam/results': 'View Results',
    '/exam/analytics': 'Exam Analytics',
    '/exam/upcoming': 'Upcoming Exams',
    '/exam/my-results': 'My Results',
    '/exam/practice': 'Practice Tests',
    '/knowledge': 'AI Knowledge Center',
    '/knowledge/upload': 'Upload Documents',
    '/knowledge/library': 'Knowledge Library',
    '/knowledge/document': 'Document Details',
    '/knowledge/search': 'AI Search',
    '/knowledge/collections': 'Collections',
    '/knowledge/queue': 'Processing Queue',
    '/knowledge/chat': 'AI Chat',
  }
  
  const title = TITLES[pathname] || 'AI Student Dashboard'
  
  return <Topbar title={title} onMenu={onMenu} />
}

/**
 * Layout component wrapping protected pages with sidebar and topbar
 */
function ProtectedLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(() => window.innerWidth >= 992)
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && window.innerWidth < 992) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  React.useEffect(() => {
    if (window.innerWidth < 992 && sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  return (
    <div className="app-shell">
      <RoleBasedSidebar open={sidebarOpen} onClose={closeSidebar} />
      <div className={`main ${!sidebarOpen ? 'expanded' : ''}`}>
        <RoleBasedTopbar onMenu={toggleSidebar} />
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * Root app component with authentication provider
 */
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}

/**
 * Component that redirects authenticated users to their role-based dashboard
 */
function RoleBasedDashboardRedirect() {
  const { user } = useAuth()
  
  const hasSuperAdmin = user?.roles?.includes(ROLE_SUPER_ADMIN)
  const hasAdmin = user?.roles?.includes(ROLE_ADMIN)
  const hasPrincipal = user?.roles?.includes(ROLE_PRINCIPAL)
  const hasSchoolAdmin = user?.roles?.includes(ROLE_SCHOOL_ADMIN)
  const hasTeacher = user?.roles?.includes(ROLE_TEACHER)
  const hasStudent = user?.roles?.includes(ROLE_STUDENT)
  
  if (hasSuperAdmin || hasAdmin) return <Navigate to="/admin" replace />
  if (hasPrincipal) return <Navigate to="/principal" replace />
  if (hasSchoolAdmin) return <Navigate to="/school" replace />
  if (hasTeacher) return <Navigate to="/teacher" replace />
  if (hasStudent) return <Navigate to="/student" replace />
  
  return <Navigate to="/admin" replace />
}

/**
 * App routes with authentication and role-based protection
 */
function AppRoutes() {
  const { isAuthenticated, loading } = useAuth()

  // Show loading spinner while checking authentication status
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <Routes>
        {/* Public route - Home page (default landing page) */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? <RoleBasedDashboardRedirect /> : (
              <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                <HomePage />
              </Suspense>
            )
          } 
        />

        {/* Public route - Login page */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : (
            <Suspense fallback={<LoadingIndicator message="Loading..." />}>
              <LoginPage />
            </Suspense>
          )} 
        />

        {/* Unauthorized page - accessible to authenticated users who lack permission */}
        <Route
          path="/unauthorized"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                  <UnauthorizedPage />
                </Suspense>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin routes - require ROLE_ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <AdminDashboard />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        
        {/* Admin schools routes */}
        <Route
          path="/admin/schools"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <SchoolsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/schools/new"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <CreateSchoolPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/schools/:id"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <SchoolDetailsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/schools/:id/edit"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <EditSchoolPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/school-admins"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <SchoolAdminsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/school-admins/new"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <CreateSchoolAdminPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/school-admins/:id"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <SchoolAdminDetailsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/school-admins/:id/edit"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <EditSchoolAdminPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/subscriptions"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <SubscriptionsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <AuditLogsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/platform-analytics"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <AdminAnalyticsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        
        {/* Admin documents route */}
        <Route
          path="/admin/documents"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <DocumentPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/documents/upload"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <UploadDocuments />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        {/* Admin users route */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <UsersPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        {/* Admin students route */}
        <Route
          path="/admin/students"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <AdminStudentsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        {/* Admin courses route */}
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <CoursePage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses/new"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <CreateCoursePage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses/:id"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <CourseDetailsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses/:id/edit"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <EditCoursePage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                  <DocumentPage />
                </Suspense>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                  <ChatPage />
                </Suspense>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        
        {/* Admin assignments route */}
        <Route
          path="/admin/assignments"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <AssignmentPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/assignments/new"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <CreateAssignmentPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/assignments/:id"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <AssignmentDetailsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/assignments/:id/edit"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <EditAssignmentPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        {/* Admin submissions route */}
        <Route
          path="/admin/submissions"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <SubmissionPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/chat"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <ChatPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        
        {/* Admin analytics route */}
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <AskAiPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        {/* Admin reports route */}
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <AnalyticsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        {/* Principal routes - require ROLE_PRINCIPAL */}
        <Route
          path="/principal"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_PRINCIPAL}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <PrincipalDashboard />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        
        {/* Principal documents route */}
        <Route
          path="/principal/documents"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_PRINCIPAL}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <DocumentPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        
        {/* Principal AI route */}
        <Route
          path="/principal/ai"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_PRINCIPAL}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <ChatPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        {/* Teacher routes - require ROLE_TEACHER */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_TEACHER}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <TeacherDashboard />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        
        {/* Teacher Documents route */}
        <Route
          path="/teacher/documents"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_TEACHER}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <DocumentPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        
        {/* Teacher AI route */}
        <Route
          path="/teacher/ai"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_TEACHER}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <ChatPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        {/* Teacher Portal routes */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_TEACHER}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <TeacherPortalDashboard />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/my-classes"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_TEACHER}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <MyClassesPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/attendance"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_TEACHER}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <AttendancePage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/assignments"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_TEACHER}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <TeacherAssignmentsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/assignments/new"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_TEACHER}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <CreateAssignmentPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/assignments/:id"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_TEACHER}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <AssignmentDetailsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/assignments/:id/edit"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_TEACHER}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <EditAssignmentPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/lesson-planner"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_TEACHER}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <AILessonPlannerPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/quiz-generator"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_TEACHER}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <AIQuizGeneratorPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/homework-review"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_TEACHER}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <HomeworkReviewPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/gradebook"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_TEACHER}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <GradebookPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/study-materials"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_TEACHER}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <StudyMaterialsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/student-analytics"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_TEACHER}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <StudentAnalyticsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/notifications"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_TEACHER}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <TeacherNotificationsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        {/* Student routes - require ROLE_STUDENT */}
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_STUDENT}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <StudentPortalDashboard />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_STUDENT}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <MyCoursesPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/assignments"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_STUDENT}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <StudentAssignmentsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/submit-assignment"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_STUDENT}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <AssignmentSubmissionPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/submit-assignment/:id"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_STUDENT}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <AssignmentSubmissionPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/attendance"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_STUDENT}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <StudentAttendancePage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/grades"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_STUDENT}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <StudentGradesPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/study-materials"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_STUDENT}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <StudentStudyMaterialsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/ai-tutor"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_STUDENT}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <StudentAITutorPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/ai-homework-helper"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_STUDENT}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <AIHomeworkHelperPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/ai-quiz-practice"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_STUDENT}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <AIQuizPracticePage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/documents"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_STUDENT}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <StudentDocumentsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/calendar"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_STUDENT}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <StudentCalendarPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/notifications"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_STUDENT}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <StudentNotificationsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_STUDENT}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <StudentProfilePage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/settings"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_STUDENT}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <StudentSettingsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        
        {/* Student AI route */}
        <Route
          path="/student/ai"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_STUDENT}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <ChatPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        {/* Assignments route (general) */}
        <Route
          path="/assignments"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                  <AssignmentPage />
                </Suspense>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* Home route - protected (redirects to role dashboard) */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                  <HomePage />
                </Suspense>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* Profile route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                  <ProfilePage />
                </Suspense>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* Notifications route */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                  <NotificationPage />
                </Suspense>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* Settings route */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                  <SettingsPage />
                </Suspense>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        {/* Examination & Assessment routes */}
        <Route
          path="/exam"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                  <ExamDashboard />
                </Suspense>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam/create"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                  <CreateExam />
                </Suspense>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam/manage"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                  <ManageExams />
                </Suspense>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam/results"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                  <ViewResults />
                </Suspense>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam/analytics"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                  <ExamAnalytics />
                </Suspense>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam/upcoming"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                  <UpcomingExams />
                </Suspense>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam/my-results"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                  <MyResults />
                </Suspense>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam/practice"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                  <PracticeTests />
                </Suspense>
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        
        {/* School Admin routes - require ROLE_SCHOOL_ADMIN */}
        <Route
          path="/school"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_SCHOOL_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <SchoolDashboard />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/profile"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_SCHOOL_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <SchoolProfilePage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/academic-years"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_SCHOOL_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <AcademicYearsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/classes"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_SCHOOL_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <ClassesPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/sections"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_SCHOOL_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <SectionsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/subjects"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_SCHOOL_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <SubjectsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/teachers"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_SCHOOL_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <TeachersPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/students"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_SCHOOL_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <StudentsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/departments"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_SCHOOL_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <DepartmentsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/timetable"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_SCHOOL_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <TimetablePage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/announcements"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_SCHOOL_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <AnnouncementsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/settings"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_SCHOOL_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <SchoolSettingsPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/school/documents"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_SCHOOL_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <DocumentPage />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        {/* AI Knowledge Center routes */}
        <Route
          path="/knowledge"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <KnowledgeDashboard />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/knowledge/upload"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <UploadDocuments />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/knowledge/library"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <KnowledgeLibrary />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/knowledge/document/:id"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <DocumentDetails />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/knowledge/search"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <AISearch />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/knowledge/collections"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <Collections />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/knowledge/queue"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <ProcessingQueue />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/knowledge/chat"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute requiredRoles={ROLE_ADMIN}>
                <ProtectedLayout>
                  <Suspense fallback={<LoadingIndicator message="Loading..." />}>
                    <AIChat />
                  </Suspense>
                </ProtectedLayout>
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />

        {/* Catch-all for 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {/* Floating AI Assistant - available on all pages */}
      <FloatingAIAssistant />
    </>
  )
}