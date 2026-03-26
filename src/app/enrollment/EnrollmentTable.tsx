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
import AddEnrollmentModal from './AddEnrollmentModal'
import EditButton from '../../components/ui/EditButton'

interface EnrollmentRow {
  id_inscriere: number
  data_inscriere: string
  stadiu: string
  angajat_nume: string
  angajat_prenume: string
  curs_nume: string
}

export default async function EnrollmentTable() {
  const enrollments = await sql`
    SELECT 
      i.id_inscriere,
      i.data_inscriere,
      i.stadiu,
      a.nume as angajat_nume,
      a.prenume as angajat_prenume,
      c.nume as curs_nume
    FROM inscriere i
    LEFT JOIN angajat a ON i.id_angajat = a.id_angajat
    LEFT JOIN curs c ON i.id_curs = c.id_curs
    ORDER BY i.id_inscriere DESC
  ` as EnrollmentRow[]

  if (enrollments.length === 0) {
    return (
      <div className="mx-10 rounded-lg border bg-black font-semibold">
        <div className="flex w-full items-center justify-between p-5">
          <h2>Inscrieri</h2>
          <AddEnrollmentModal />
        </div>
        <div className="h-0.5 border-t-0 bg-gray-800"></div>
        <p className="p-5 text-gray-400">No enrollments found.</p>
      </div>
    )
  }

  return (
    <div className="mx-10 rounded-lg border bg-black font-semibold">
      <div className="flex w-full items-center justify-between p-5">
        <h2>Inscrieri</h2>
        <AddEnrollmentModal />
      </div>
      <div className="h-0.5 border-t-0 bg-gray-800"></div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id_inscriere</TableHead>
            <TableHead>Data_inscriere</TableHead>
            <TableHead>Angajat</TableHead>
            <TableHead>Curs</TableHead>
            <TableHead>Stadiu</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrollments.map(enrollment => {
            const angajat = `${enrollment.angajat_nume} ${enrollment.angajat_prenume}`
            const dataInscriere = new Date(enrollment.data_inscriere).toLocaleDateString('en-UK')
            return (
              <TableRow key={enrollment.id_inscriere} className="relative">
                <TableCell>{enrollment.id_inscriere}</TableCell>
                <TableCell>{dataInscriere}</TableCell>
                <TableCell>{angajat}</TableCell>
                <TableCell>{enrollment.curs_nume}</TableCell>
                <TableCell>{enrollment.stadiu}</TableCell>

                <TableCell>
                  <EditButton href={`/enrollment/${enrollment.id_inscriere}`} />
                  <DeleteButton
                    id={enrollment.id_inscriere}
                    fetchUrl="enrollment"
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
