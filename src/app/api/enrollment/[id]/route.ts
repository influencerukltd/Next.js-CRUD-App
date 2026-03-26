import { sql } from '@/server/db'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const enrollments = await sql`
      SELECT 
        i.*,
        a.nume as employee_last_name,
        a.prenume as employee_first_name,
        c.nume as course_name
      FROM inscriere i
      JOIN angajat a ON i.id_angajat = a.id_angajat
      JOIN curs c ON i.id_curs = c.id_curs
      WHERE i.id_inscriere = ${id}
    `
    
    if (enrollments.length === 0) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })
    }
    
    return NextResponse.json(enrollments[0])
  } catch (error) {
    console.error('Error fetching enrollment:', error)
    return NextResponse.json({ error: 'Failed to fetch enrollment' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { id_angajat, id_curs, data_inscriere, stadiu } = body
    
    const result = await sql`
      UPDATE inscriere 
      SET id_angajat = ${id_angajat}, id_curs = ${id_curs}, data_inscriere = ${data_inscriere}, stadiu = ${stadiu}
      WHERE id_inscriere = ${id}
      RETURNING *
    `
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })
    }
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating enrollment:', error)
    return NextResponse.json({ error: 'Failed to update enrollment' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    await sql`DELETE FROM inscriere WHERE id_inscriere = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting enrollment:', error)
    return NextResponse.json({ error: 'Failed to delete enrollment' }, { status: 500 })
  }
}
