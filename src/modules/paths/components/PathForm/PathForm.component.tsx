import { ArrowCircleLeftIcon } from '@heroicons/react/outline'
import { useInjection } from '@polyflix/di'
import { motion } from 'framer-motion'
import update from 'immutability-helper'
import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import slugify from 'slugify'

import { useAuth } from '../../../authentication/hooks/useAuth.hook'
import { StatusSelector } from '../../../common/components/StatusSelector/StatusSelector.component'
import { VisibilitySelector } from '../../../common/components/VisibilitySelector/VisibilitySelector.component'
import { Course } from '../../../courses/models/course.model'
import { ICourse } from '../../../courses/types/course.type'
import { fadeInDown } from '../../../ui/animations/fadeInDown'
import { stagger } from '../../../ui/animations/stagger'
import { Alert, AlertType } from '../../../ui/components/Alert/Alert.component'
import { FilledButton } from '../../../ui/components/Buttons/FilledButton/FilledButton.component'
import { Input } from '../../../ui/components/Input/Input.component'
import { Spinner } from '../../../ui/components/Spinner/Spinner.component'
import { Textarea } from '../../../ui/components/Textarea/Textarea.component'
import { Paragraph } from '../../../ui/components/Typography/Paragraph/Paragraph.component'
import { Title } from '../../../ui/components/Typography/Title/Title.component'
import { Typography } from '../../../ui/components/Typography/Typography.component'
import { OrderedCourse } from '../../models'
import { Path } from '../../models/path.model'
import { PathService } from '../../services/path.service'
import { IPathForm } from '../../types/path.type'
import Card from '../Card.component'
import { SearchPath } from '../SearchPath/SearchPath.component'

type Props = {
  /** If path exists, the form will be in update mode, otherwise in create mode. */
  path?: Path | null
}

/**
 * The path form component
 */
export const PathForm: React.FC<Props> = ({ path }) => {
  const isUpdate = path instanceof Path

  const pathService = useInjection<PathService>(PathService)

  const { t } = useTranslation()
  const { user } = useAuth()
  let history = useHistory()

  const { register, handleSubmit, errors, watch } = useForm<IPathForm>({
    defaultValues: {
      title: path?.title,
      description: path?.description,
      draft: path?.draft || true,
      visibility: path?.visibility || 'public',
    },
  })

  const watchTitle = watch<'title', string>('title', '')

  const [courses, setCourses] = useState<Course[]>(
    path?.courses.map((c: OrderedCourse) => c.course) ?? []
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [isSubmit, setIsSubmit] = useState<boolean>(false)
  const [alert, setAlert] =
    useState<{
      type: AlertType
      message: string
    } | null>(null)

  const onCourseDelete = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id))
  }

  const moveCourse = (dragIndex: number, hoverIndex: number) => {
    const dragCourse = courses[dragIndex]
    setCourses(
      update(courses, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragCourse],
        ],
      })
    )
  }

  const addCourse = (course: Course) => {
    const contain = courses.some((el: Course) => el.id === course.id)
    if (!contain) setCourses([...courses, course])
  }

  const onGoBack = () => history.goBack()

  const onSubmit = async (data: IPathForm) => {
    setLoading(true)
    setIsSubmit(true)
    try {
      let result = await (isUpdate
        ? pathService.updatePath(path?.id as string, {
            ...data,
            courses: courses.map((p: Course) => ({
              order: courses.findIndex((el: Course) => el.id === p.id),
              course: { id: p.id } as ICourse,
            })),
          })
        : pathService.createPath({
            ...data,
            courses: courses.map((p: Course) => ({
              order: courses.findIndex((el: Course) => el.id === p.id),
              course: { id: p.id } as ICourse,
            })),
          }))
      setAlert({
        message: isUpdate
          ? `"${result.title}" ${t('pathManagement.updatePath.success')}.TOTO`
          : `"${result.title}" ${t('pathManagement.addPath.success')}.`,
        type: 'success',
      })
      history.push(`/profile/paths/${user?.id}`)
    } catch (err) {
      setAlert({
        message: `${t('pathManagement.addPath.error')} "${data.title}"`,
        type: 'error',
      })
    } finally {
      setLoading(false)
      setIsSubmit(false)
    }
  }

  return (
    <motion.div
      variants={stagger(0.1)}
      className="p-5 w-full md:w-8/12 mx-auto"
    >
      <div className="grid items-center grid-cols-2 gap-4 py-4">
        <Typography
          as="span"
          className="text-nx-red col-span-2"
          overrideDefaultClasses
        >
          <span className="inline-flex mx-2 cursor-pointer" onClick={onGoBack}>
            <ArrowCircleLeftIcon className="w-6 mr-1" />{' '}
            {t('shared.common.actions.back')}{' '}
          </span>
        </Typography>
        <div className="col-span-2 md:col-span-1">
          <Title variants={fadeInDown}>
            {isUpdate
              ? `${path?.title}`
              : `${t('shared.common.actions.add')}
							${t('pathManagement.path')}`}
          </Title>
          <Paragraph variants={fadeInDown} className="my-3 text-sm">
            {isUpdate
              ? `${t('pathManagement.updatePath.description')}`
              : `${t('pathManagement.addPath.description')}`}
            .
          </Paragraph>
        </div>
      </div>
      <form
        className="grid items-center grid-cols-2 gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          name="title"
          error={errors.title}
          className="col-span-2"
          placeholder={t('pathManagement.inputs.title.name')}
          required
          variants={fadeInDown}
          hint={
            watchTitle
              ? `UID : ${slugify(watchTitle, {
                  lower: true,
                  remove: /[*+~.()'"!:@]/g,
                })}`
              : `${t('pathManagement.inputs.title.description')}.`
          }
          ref={register({
            required: {
              value: true,
              message: `${t('pathManagement.inputs.title.error')}.`,
            },
          })}
        />
        <Textarea
          error={errors.description}
          className="col-span-2"
          minHeight={200}
          placeholder={t('pathManagement.inputs.description.name')}
          name="description"
          ref={register({
            required: {
              value: true,
              message: `${t('pathManagement.inputs.description.error')}.`,
            },
          })}
          variants={fadeInDown}
        />
        <div className="my-4 col-span-2">
          <Title
            overrideDefaultClasses
            className="text-xl font-bold text-nx-white"
          >
            {t('visibility.label', { ns: 'resources' })}
          </Title>
          <VisibilitySelector
            name="visibility"
            value={watch('visibility')}
            ref={register()}
            className="mt-4"
          />
        </div>
        <div className="col-span-2">
          <Title
            overrideDefaultClasses
            className="text-xl font-bold text-nx-white mb-4"
          >
            Status
          </Title>
          <StatusSelector isChecked={watch('draft')} ref={register()} />
        </div>
        <FilledButton
          className="col-span-2"
          as="input"
          inputValue={
            isUpdate
              ? t('pathManagement.updatePath.action')
              : t('pathManagement.addPath.action')
          }
          disabled={isSubmit}
          variants={fadeInDown}
        />
        {loading && (
          <div className="col-span-2 flex items-center">
            <Spinner className="fill-current text-nx-dark"></Spinner>
            <Typography as="span" className="text-sm ml-2">
              {t('shared.common.wait')}..
            </Typography>
          </div>
        )}
        {alert && (
          <Alert type={alert.type} variants={fadeInDown} className="col-span-2">
            {alert.message}
          </Alert>
        )}
      </form>
      <div className="mt-4">
        <SearchPath
          variants={fadeInDown}
          placeholder={t('pathManagement.inputs.search.name')}
          addCourse={addCourse}
        />
        <DndProvider backend={HTML5Backend}>
          <>
            {courses.map((course: Course, i: number) => (
              <Card
                key={course.id}
                index={i}
                course={course}
                moveCard={moveCourse}
                onDelete={onCourseDelete}
              />
            ))}
          </>
        </DndProvider>
        {/* <>
          {courses.map((course: Course) => (
            <VideoListItem
              video={video}
              ownerItems={false}
              links={false}
              onDelete={() => onVideoDelete(video.id)}
            />
          ))}
        </> */}
      </div>
    </motion.div>
  )
}
