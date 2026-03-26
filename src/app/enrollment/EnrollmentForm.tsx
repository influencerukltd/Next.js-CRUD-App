'use client'
import {
  enrollmentSchema,
  type EnrollmentSchemaType,
} from '@/schemas/enrollment'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form'
import useSWR from 'swr'
import { Button } from '../../components/ui/Button'
import SelectInput, { type SelectOption } from '../../components/ui/SelectInput'

type EnrollmentFormProps = {
  type: 'Add' | 'Edit'
  onSubmit: SubmitHandler<EnrollmentSchemaType>
  defaultValues?: EnrollmentSchemaType
}

export default function EnrollmentForm({
  type,
  onSubmit,
  defaultValues,
}: EnrollmentFormProps) {
  const methods = useForm<EnrollmentSchemaType>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues,
  })
  const {
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = methods

  const { data: options } = useSWR('/enrollment', fetchOptions)

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        <SelectInput
          name="angajat"
          label="Employee"
          options={options?.employeeOptions}
          defaultValue={generateDefault('employee', defaultValues, options)}
        />
        <SelectInput
          name="curs"
          label="Course"
          options={options?.coursesOptions}
          defaultValue={generateDefault('courses', defaultValues, options)}
        />
        <SelectInput
          name="stadiu"
          label="Status"
          options={stateOptions}
          defaultValue={generateDefault('state', defaultValues, options)}
        />

        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={type === 'Edit' && !isDirty}>
          {type} Enrollment
        </Button>
      </form>
    </FormProvider>
  )
}

async function fetchOptions(url: string) {
  type OptionsResponse = {
    payload: {
      employeeOptions: SelectOption[]
      coursesOptions: SelectOption[]
    }
  }
  const res = await fetch(url)
  const data: OptionsResponse = await res.json()
  return data.payload
}

function generateDefault(
  key: 'employee' | 'courses' | 'state',
  defaultValues: EnrollmentSchemaType | undefined,
  options:
    | {
        employeeOptions: SelectOption[]
        coursesOptions: SelectOption[]
      }
    | undefined
) {
  if (!defaultValues || !options) return

  if (key == 'employee') {
    return options?.employeeOptions.find(
      // @ts-expect-error the value exists
      option => option?.value?.id_angajat === defaultValues?.angajat.id_angajat
    )
  }

  if (key == 'courses') {
    return options?.coursesOptions.find(
      // @ts-expect-error the value exists
      option => option?.value?.id_curs === defaultValues?.curs.id_curs
    )
  }

  if (key == 'state') {
    return stateOptions.find(
      // @ts-expect-error the value exists
      state => state.value.toLowerCase() === defaultValues.stadiu.toLowerCase()
    )
  }
}

const stateOptions: SelectOption[] = [
  {
    value: 'Not Started',
    label: 'Not Started',
  },
  {
    value: 'In Progress',
    label: 'In Progress',
  },
  {
    value: 'Completed',
    label: 'Completed',
  },
]
