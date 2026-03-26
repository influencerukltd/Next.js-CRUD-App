import { sql } from '@/server/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const enrollments = await sql`
      SELECT 
        i.*,
        a.nume as employee_last_name,
        a.prenume as employee_first_name,
        c.nume as course_name
      FROM inscriere i
      JOIN angajat a ON i.id_angajat = a.id_angajat
      JOIN curs c ON i.id_curs = c.id_curs
      ORDER BY i.id_inscriere DESC
    `
    return NextResponse.json(enrollments)
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id_angajat, id_curs, data_inscriere, stadiu } = body
    
    const result = await sql`
      INSERT INTO inscriere (id_angajat, id_curs, data_inscriere, stadiu)
      VALUES (${id_angajat}, ${id_curs}, ${data_inscriere}, ${stadiu})
      RETURNING *
    `
    
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Error creating enrollment:', error)
    return NextResponse.json({ error: 'Failed to create enrollment' }, { status: 500 })
  }
}
