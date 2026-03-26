import { sql } from '@/server/db'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const employees = await sql`SELECT * FROM angajat WHERE id_angajat = ${id}`
    
    if (employees.length === 0) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }
    
    return NextResponse.json(employees[0])
  } catch (error) {
    console.error('Error fetching employee:', error)
    return NextResponse.json({ error: 'Failed to fetch employee' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { nume, prenume, email, departament } = body
    
    const result = await sql`
      UPDATE angajat 
      SET nume = ${nume}, prenume = ${prenume}, email = ${email}, departament = ${departament}
      WHERE id_angajat = ${id}
      RETURNING *
    `
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating employee:', error)
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    await sql`DELETE FROM angajat WHERE id_angajat = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting employee:', error)
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 })
  }
}
