'use client'
import EmployeeForm from '@/app/employee/EmployeeForm'
import { Button } from '@/components/ui/Button'
import { type EmployeeSchemaType } from '@/schemas/employee'
import { SERVER_ENDPOINT } from '@/utils/constants'
import { revalidatePathAction } from '@/utils/revalidateAction'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type SubmitHandler } from 'react-hook-form'

type EditFormProps = {
  employee: EmployeeSchemaType
  employeeId: number
}

export default function EditEmployeeForm({
  employee,
  employeeId,
}: EditFormProps) {
  const router = useRouter()
  const onSubmit: SubmitHandler<EmployeeSchemaType> = async employee => {
    try {
      await fetch(`${SERVER_ENDPOINT}/employee`, {
        body: JSON.stringify({ employee, employeeId }),
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
        <h1 className="text-xl font-semibold">Edit Employee</h1>
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="h-auto w-7" />
            Back
          </Link>
        </Button>
      </div>
      <EmployeeForm
        type="Edit"
        onSubmit={onSubmit}
        defaultValues={employee}
      />
    </main>
  )
}
