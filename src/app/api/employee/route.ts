import { sql } from '@/server/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const employees = await sql`SELECT * FROM angajat ORDER BY id_angajat DESC`
    return NextResponse.json(employees)
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nume, prenume, email, departament } = body
    
    const result = await sql`
      INSERT INTO angajat (nume, prenume, email, departament)
      VALUES (${nume}, ${prenume}, ${email}, ${departament})
      RETURNING *
    `
    
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Error creating employee:', error)
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 })
  }
}
