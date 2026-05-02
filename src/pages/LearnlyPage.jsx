import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LmsNavbar from '../components/lms/Navbar.jsx';
import FilterSidebar from '../components/lms/FilterSidebar.jsx';
import ProgressBanner from '../components/lms/ProgressBanner.jsx';
import CourseGrid from '../components/lms/CourseGrid.jsx';
import CourseModal from '../components/lms/CourseModal.jsx';
import { enrolledCourses, courses } from '../data/mockCourses.js';
import { LmsThemeProvider, useLmsTheme } from '../context/lmsThemeContext.jsx';
import { LmsLangProvider } from '../context/lmsLangContext.jsx';

function LearnlyShell() {
  const navigate = useNavigate();
  const { theme } = useLmsTheme();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [sortBy, setSortBy] = useState('popular');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => selectedCategory === 'all' || course.category === selectedCategory)
      .filter((course) => !selectedLevel || course.level === selectedLevel)
      .filter((course) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
          course.title_en.toLowerCase().includes(q) ||
          course.title_th.toLowerCase().includes(q) ||
          course.instructor_en.toLowerCase().includes(q) ||
          course.instructor_th.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.id - a.id;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'price') return a.price - b.price;
        return b.students - a.students;
      });
  }, [search, selectedCategory, selectedLevel, sortBy]);

  useEffect(() => {
    const fn = (event) => {
      if (event.key === 'Escape') setSelectedCourse(null);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  return (
    <div
      className="min-h-screen text-[#F0F0F0]"
      data-theme={theme}
      style={{
        backgroundColor: theme === 'dark' ? '#0A0A0A' : '#f5f5f3',
        color: theme === 'dark' ? '#F0F0F0' : '#101411',
      }}
    >
      <LmsNavbar onBack={() => navigate('/')} search={search} onSearch={setSearch} />
      <div className="flex pt-16 min-h-screen">
        <FilterSidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalCourses={filteredCourses.length}
        />

        <main className="flex-1 ml-0 md:ml-[240px] p-5 md:p-8">
          <ProgressBanner items={enrolledCourses} />
          <CourseGrid courses={filteredCourses} onOpen={setSelectedCourse} />
        </main>
      </div>
      <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </div>
  );
}

export default function LearnlyPage() {
  return (
    <LmsThemeProvider>
      <LmsLangProvider>
        <LearnlyShell />
      </LmsLangProvider>
    </LmsThemeProvider>
  );
}
