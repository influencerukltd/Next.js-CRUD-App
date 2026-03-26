'use client'
import { Button } from '@/components/ui/Button'
import { type CourseSchemaType } from '@/schemas/course'
import { SERVER_ENDPOINT } from '@/utils/constants'
import { revalidatePathAction } from '@/utils/revalidateAction'
import {
  Close,
  Content,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
} from '@radix-ui/react-dialog'
import { Plus, X } from 'lucide-react'
import { useState } from 'react'
import { type SubmitHandler } from 'react-hook-form'
import CourseForm from './CourseForm'

export default function AddCourseModal() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const onSubmit: SubmitHandler<CourseSchemaType> = async course => {
    try {
      await fetch(`${SERVER_ENDPOINT}/course`, {
        body: JSON.stringify(course),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      await revalidatePathAction('/')
    } catch (e) {
      const error = e as Error
      console.log(error.message)
    } finally {
      setIsDialogOpen(false)
    }
  }

  return (
    <Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Trigger asChild>
        <Button title="Add">
          <div className="flex items-center gap-1">
            <Plus className="h-auto w-5" />
            Add
          </div>
        </Button>
      </Trigger>
      <Portal>
        <Overlay className="fixed inset-0 bg-black/80 data-[state=open]:animate-overlayShow" />
        <Content
          className="fixed left-1/2 top-1/2 z-30 grid w-11/12 -translate-x-1/2 -translate-y-1/2 gap-4 rounded-[6px]
        bg-zinc-950 p-6 font-medium shadow-2xl shadow-black focus:outline-none data-[state=closed]:animate-contentHide data-[state=open]:animate-contentShow sm:max-w-xl">
          <Title className="text-xl font-semibold">Add Course</Title>

          <CourseForm type="Add" onSubmit={onSubmit} />

          <Close asChild>
            <Button
              variant="ghost"
              className="absolute right-2 top-2 h-9 w-9 rounded-full p-1"
              aria-label="Close">
              <X />
            </Button>
          </Close>
        </Content>
      </Portal>
    </Root>
  )
}
