'use client'
import CourseForm from '@/app/course/CourseForm'
import { Button } from '@/components/ui/Button'
import { type CourseSchemaType } from '@/schemas/course'
import { SERVER_ENDPOINT } from '@/utils/constants'
import { revalidatePathAction } from '@/utils/revalidateAction'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type SubmitHandler } from 'react-hook-form'

type EditFormProps = {
  course: CourseSchemaType
  courseId: number
}

export default function EditCourseForm({ course, courseId }: EditFormProps) {
  const router = useRouter()
  const onSubmit: SubmitHandler<CourseSchemaType> = async course => {
    try {
      await fetch(`${SERVER_ENDPOINT}/course`, {
        body: JSON.stringify({ course, courseId }),
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      await revalidatePathAction('/')
      router.push('/')
    } catch (e) {
      const error = e as Error
      console.log(error.message)
    }
  }
  return (
    <main className="mx-auto flex h-full flex-col gap-5 rounded-md border bg-black p-5 shadow-lg transition-colors ease-out sm:w-[600px]">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit Course</h1>
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="h-auto w-7" />
            Back
          </Link>
        </Button>
      </div>
      <CourseForm type="Edit" onSubmit={onSubmit} defaultValues={course} />
    </main>
  )
}
