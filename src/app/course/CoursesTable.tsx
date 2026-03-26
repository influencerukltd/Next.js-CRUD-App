import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { sql } from '@/server/db'
import DeleteButton from '../../components/ui/DeleteButton'
import AddCourseModal from './AddCourseModal'
import EditButton from '../../components/ui/EditButton'

interface Course {
  id_curs: number
  nume: string
  durata: number
  pret: number
}

export default async function CoursesTable() {
  const courses = await sql`SELECT * FROM curs ORDER BY id_curs DESC` as Course[]
  
  if (courses.length === 0) {
    return (
      <div className="mx-10 rounded-lg border bg-black font-semibold">
        <div className="flex w-full items-center justify-between p-5">
          <h2>Cursuri</h2>
          <AddCourseModal />
        </div>
        <div className="h-0.5 border-t-0 bg-gray-800"></div>
        <p className="p-5 text-gray-400">No courses found.</p>
      </div>
    )
  }
  
  return (
    <div className="mx-10 rounded-lg border bg-black font-semibold">
      <div className="flex w-full items-center justify-between p-5">
        <h2>Cursuri</h2>
        <AddCourseModal />
      </div>
      <div className="h-0.5 border-t-0 bg-gray-800"></div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id_curs</TableHead>
            <TableHead>Nume</TableHead>
            <TableHead>Durata (zile)</TableHead>
            <TableHead>Pret (€)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map(course => (
            <TableRow key={course.id_curs} className="relative">
              {Object.values(course).map((value, idx) => (
                <TableCell key={idx}>{String(value)}</TableCell>
              ))}
              <TableCell>
                <EditButton href={`/course/${course.id_curs}`} />
                <DeleteButton id={course.id_curs} fetchUrl="course" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
