import { Course } from './components/Course'
import { courses } from './constants'

const App = () => {
  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map((course) => (
        <Course key={course.id} course={course} />
      ))}
    </div>
  )
}

export default App
