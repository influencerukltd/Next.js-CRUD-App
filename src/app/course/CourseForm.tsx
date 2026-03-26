'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import { Button } from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { type CourseSchemaType, courseSchema } from '@/schemas/course'

type CourseFormProps = {
  type: 'Add' | 'Edit'
  onSubmit: SubmitHandler<CourseSchemaType>
  defaultValues?: CourseSchemaType
}

export default function CourseForm({
  type,
  onSubmit,
  defaultValues,
}: CourseFormProps) {
  const methods = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues,
  })
  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <Input name="nume" label="Name" placeholder="Course Name" />

        <Input
          name="durata"
          label="Duration"
          inputMode="numeric"
          placeholder="30 (days)"
          registerOptions={{ valueAsNumber: true }}
        />

        <Input
          name="pret"
          label="Price"
          inputMode="numeric"
          placeholder="50 EUR"
          registerOptions={{ valueAsNumber: true }}
        />

        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={type === 'Edit' && !isDirty}>
          {type} Course
        </Button>
      </form>
    </FormProvider>
  )
}
