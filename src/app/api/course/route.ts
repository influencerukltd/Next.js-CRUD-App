import { sql } from '@/server/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const courses = await sql`SELECT * FROM curs ORDER BY id_curs DESC`
    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nume, durata, pret } = body
    
    const result = await sql`
      INSERT INTO curs (nume, durata, pret)
      VALUES (${nume}, ${durata}, ${pret})
      RETURNING *
    `
    
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 })
  }
}
