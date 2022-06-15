import { Add } from '@mui/icons-material'
import {
  Modal,
  Fade,
  Theme,
  Paper,
  Pagination,
  Stack,
  Typography,
  List,
  Alert,
  Button,
} from '@mui/material'
import { Box } from '@mui/system'
import { SxProps } from '@mui/system'
import { useState } from 'react'
import { UseFieldArrayReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Header } from '@core/components/Header/Header.component'
import { Scrollbar } from '@core/components/Scrollbar/Scrollbar.component'
import { useFullScreenModal } from '@core/hooks/useFullScreenModal.hook'

import { useAuth } from '@auth/hooks/useAuth.hook'

import { CollectionForm } from '@collections/components/Forms/CollectionForm.component'
import { Collection } from '@collections/models/collection.model'
import { useGetCollectionsQuery } from '@collections/services/collection.service'
import { CollectionFilters } from '@collections/types/filters.type'

import { ICourseForm } from '@courses/types/form.type'

import { CollectionListItem } from '../ModuleListItemProps/ModuleListItemProps.component'

type CourseFormattachedCollectionModalProps = {
  sx?: SxProps<Theme>
  open: boolean
  onClose: () => void
  fieldArray: UseFieldArrayReturn<ICourseForm, 'modules', 'id'>
}

export const CourseFormattachedCollectionModal = ({
  sx: sxProps,
  open,
  onClose,
  fieldArray,
}: CourseFormattachedCollectionModalProps) => {
  const { t } = useTranslation('courses')

  const { user } = useAuth()

  const [newCollections, setNewCollections] = useState<string[]>([])

  const {
    Modal: FullScreenModal,
    openModal: openModalFullScreen,
    close: closeFullScreenModal,
  } = useFullScreenModal({
    onClose: () => {},
  })

  const [filters, setFilters] = useState<CollectionFilters>({
    order: '-createdAt',
    page: 1,
    pageSize: 5,
    draft: false,
    userId: user?.id,
  })

  const { data: collections, refetch } = useGetCollectionsQuery({
    ...filters,
  })
  let totalPage = Math.ceil((collections?.total ?? 1) / (filters.pageSize ?? 1))

  const { fields, append, remove } = fieldArray

  const handleToggle = (collection: Collection, status?: boolean = true) => {
    const currentIndex = fields.findIndex((e) => e.id === collection.id)

    if (status && currentIndex === -1) {
      append(collection)
    } else {
      remove(currentIndex)
    }
  }

  const isLinkSelected = (collection: Collection): boolean => {
    return fields.some((e) => e.id === collection.id)
  }

  const onCollectionCreated = (collectionId: string) => {
    setNewCollections(newCollections.concat(collectionId))
    closeFullScreenModal()
    refetch()
  }

  return (
    <>
      <Modal
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          ...sxProps,
        }}
        keepMounted={false}
        open={open}
        onClose={() => onClose()}
        closeAfterTransition
        aria-labelledby="Course form modal"
        aria-describedby="Link a collection into your course"
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Paper
            sx={{
              width: {
                sm: '80%',
                xs: '100%',
              },
              bgcolor: 'background.default',
              borderRadius: 2,
              p: {
                sm: 2,
                xs: 1,
              },
            }}
            variant="outlined"
          >
            <Scrollbar
              sx={{
                maxHeight: (theme) => `calc(100vh - ${theme.spacing(10)})`,
                minHeight: '100px',
              }}
            >
              <Stack direction="column" spacing={2}>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="space-between"
                >
                  <Typography variant="h3">
                    {t('form.upsert.title.listOfModule')}
                  </Typography>
                  <Button
                    startIcon={<Add />}
                    variant="outlined"
                    onClick={openModalFullScreen}
                  >
                    {t('form.upsert.createModule')}
                  </Button>
                </Stack>
                {collections?.data?.length > 0 ? (
                  <List>
                    {collections?.data?.map((collection) => (
                      <CollectionListItem
                        key={collection.id}
                        collection={collection}
                        newCollections={newCollections}
                        handleToggle={handleToggle}
                        isLinkSelected={isLinkSelected}
                      />
                    ))}
                  </List>
                ) : (
                  <Alert severity="warning">
                    {t('form.upsert.error.noModule')}
                  </Alert>
                )}
                <Box display="flex" justifyContent="center">
                  <Pagination
                    onChange={(e, page) => setFilters({ ...filters, page })}
                    count={totalPage < 1 ? 1 : totalPage}
                    shape="rounded"
                    variant="outlined"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              </Stack>
            </Scrollbar>
          </Paper>
        </Fade>
      </Modal>
      <FullScreenModal>
        <Header
          title={t(`forms.create-update.title.create`, {
            ns: 'collections',
          })}
          description={t(`forms.create-update.description.create`, {
            ns: 'collections',
          })}
        />
        <CollectionForm
          collection={undefined}
          isUpdate={false}
          allowRedirect={false}
          onSubmit={onCollectionCreated}
        />
      </FullScreenModal>
    </>
  )
}
