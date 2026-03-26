import { sql } from '@/server/db'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const courses = await sql`SELECT * FROM curs WHERE id_curs = ${id}`
    
    if (courses.length === 0) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }
    
    return NextResponse.json(courses[0])
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const { nume, durata, pret } = body
    
    const result = await sql`
      UPDATE curs 
      SET nume = ${nume}, durata = ${durata}, pret = ${pret}
      WHERE id_curs = ${id}
      RETURNING *
    `
    
    if (result.length === 0) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }
    
    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    await sql`DELETE FROM curs WHERE id_curs = ${id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 })
  }
}
