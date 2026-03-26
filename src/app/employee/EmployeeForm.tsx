'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import { Button } from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { employeeSchema, type EmployeeSchemaType } from '@/schemas/employee'

type EmployeeFormProps = {
  type: 'Add' | 'Edit'
  onSubmit: SubmitHandler<EmployeeSchemaType>
  defaultValues?: EmployeeSchemaType
}

export default function EmployeeForm({
  type,
  onSubmit,
  defaultValues,
}: EmployeeFormProps) {
  const methods = useForm<EmployeeSchemaType>({
    resolver: zodResolver(employeeSchema),
    defaultValues,
  })
  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <Input name="nume" label="Last Name" placeholder="Smith" />

        <Input name="prenume" label="First Name" placeholder="John" />

        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="john@example.com"
        />

        <Input
          name="departament"
          type="text"
          label="Department"
          placeholder="IT"
        />

        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={type === 'Edit' && !isDirty}>
          {type} Employee
        </Button>
      </form>
    </FormProvider>
  )
}
