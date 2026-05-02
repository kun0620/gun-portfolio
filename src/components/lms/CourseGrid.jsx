import CourseCard from './CourseCard.jsx';

export default function CourseGrid({ courses, onOpen }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} onOpen={onOpen} />
      ))}
    </section>
  );
}
