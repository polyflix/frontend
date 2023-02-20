import { Group } from '@admin/models/group.model'
import {
  useCreateGroupMutation,
  useUpdateGroupMutation,
} from '@admin/services/group.service'
import { IGroupForm } from '@admin/types/form.type'
import { LoadingButton } from '@mui/lab'
import {
  Autocomplete,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  TextField,
} from '@mui/material'
import { capitalize } from 'lodash'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { Endpoint } from '@constants/endpoint.constant'
import {
  getCommonSubmitButtonProps,
  getCommonTextFieldProps,
} from '@core/helpers/form.helper'
import { SnackbarService } from '@services/snackbar.service'
import { CrudAction } from '@types_/http.type'

import { User } from '@types_/user.type'

import { useGetUsersQuery } from '@users/services/user.service'

import { MembersList } from '../MembersList.component'
import { StyledMenuItem } from './GroupForm.style'
import { GroupSelectItem } from './GroupSelectItem.component'

interface Props {
  group?: Group
  i18nKey?: string
  isUpdate: boolean
}

export const GroupFrom = ({ group, isUpdate }: Props) => {
  const snackbarService = useInjection<SnackbarService>(SnackbarService)

  const [createGroup] = useCreateGroupMutation()
  const [updateGroup] = useUpdateGroupMutation()

  const [selectedMembers, setSelectedMembers] = useState<User[]>(
    group?.members || []
  )

  const { t } = useTranslation('administration')

  const history = useHistory()

  const {
    isLoading: isUserLoading,
    isFetching: isUserFetching,
    data: users,
  } = useGetUsersQuery({
    page: 0,
    pageSize: 9999,
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
    setValue,
  } = useForm<IGroupForm>({
    defaultValues: {
      members: group?.members.map((m) => m.id) || [],
      owner: group?.owner?.id || '',
      name: group?.name || '',
    },
  })

  const watchMembers = watch('members')

  useEffect(() => {
    setSelectedMembers(group?.members || [])
  }, [group])

  useEffect(() => {
    if (users) {
      const members: User[] = watchMembers
        .map((memberId) => users?.data?.find((u: User) => u.id === memberId))
        .filter((e) => !!e) as User[]

      setSelectedMembers(members)
    }
  }, [watchMembers])

  const onSubmit = async (data: IGroupForm) => {
    try {
      await (isUpdate
        ? updateGroup({ id: group!.id || '', body: data })
        : createGroup(data)
      ).unwrap()

      snackbarService.notify(
        isUpdate ? CrudAction.UPDATE : CrudAction.CREATE,
        Endpoint.Groups
      )

      history.push('/admin/groups')
    } catch (e: any) {
      snackbarService.createSnackbar(e?.data?.statusText, { variant: 'error' })
    }
  }
  const displayUserById = (id: string) => {
    const user = users?.data.find((u: User) => u.id === id)
    if (!user) {
      return ''
    }
    return capitalize(`${user.firstName} ${user.lastName}`)
  }

  return (
    <>
      {isUserLoading || isUserFetching ? (
        <CircularProgress sx={{ mx: 'auto', display: 'block' }} />
      ) : (
        <Stack direction="column" spacing={2}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    error={Boolean(errors.name)}
                    helperText={errors.name?.message}
                    label={t('groups.forms.create-update.placeholder.name')}
                    {...getCommonTextFieldProps()}
                    {...register('name', {
                      required: {
                        value: true,
                        message: `${t(
                          'groups.forms.create-update.validation.required'
                        )}.`,
                      },
                    })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    control={control}
                    name="owner"
                    rules={{ required: true }}
                    render={({ field: controllerField }) => (
                      <Autocomplete
                        {...controllerField}
                        disabled={isUpdate}
                        options={users?.data.map((u) => u.id) || []}
                        getOptionLabel={(option) => displayUserById(option)}
                        onChange={(e, options) =>
                          setValue('owner', options!, {
                            shouldValidate: true,
                          })
                        }
                        renderOption={(props, option) => (
                          <StyledMenuItem
                            key={option}
                            value={option}
                            sx={{ mx: 1 }}
                            {...props}
                          >
                            <GroupSelectItem
                              user={
                                users?.data.find((u: User) => u.id === option)!
                              }
                            />
                          </StyledMenuItem>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={Boolean(errors?.owner)}
                            placeholder={t(
                              'groups.forms.create-update.placeholder.owner'
                            )}
                            helperText={
                              Boolean(errors?.owner) &&
                              t(
                                'groups.forms.create-update.validation.required'
                              )
                            }
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    control={control}
                    name="members"
                    rules={{ required: true }}
                    render={({ field: controllerField }) => (
                      <Autocomplete
                        {...controllerField}
                        multiple
                        limitTags={2}
                        disableCloseOnSelect
                        options={users?.data.map((u) => u.id) || []}
                        getOptionLabel={(option) => displayUserById(option)}
                        onChange={(e, options) =>
                          setValue('members', options, {
                            shouldValidate: true,
                          })
                        }
                        renderOption={(props, option) => (
                          <StyledMenuItem
                            key={option}
                            value={option}
                            sx={{ mx: 1 }}
                            {...props}
                          >
                            <GroupSelectItem
                              user={
                                users?.data.find((u: User) => u.id === option)!
                              }
                            />
                          </StyledMenuItem>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={Boolean(errors?.members)}
                            placeholder={t(
                              'groups.forms.create-update.placeholder.members'
                            )}
                            helperText={
                              Boolean(errors?.members) &&
                              t(
                                'groups.forms.create-update.validation.required'
                              )
                            }
                          />
                        )}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <LoadingButton {...getCommonSubmitButtonProps(isSubmitting)}>
                {t(
                  `groups.forms.create-update.placeholder.submit.${
                    isUpdate ? 'update' : 'create'
                  }`
                )}
              </LoadingButton>
            </Stack>
          </form>
          {selectedMembers.length > 0 && (
            <Paper variant="outlined">
              <MembersList members={selectedMembers} />
            </Paper>
          )}
        </Stack>
      )}
    </>
  )
}
