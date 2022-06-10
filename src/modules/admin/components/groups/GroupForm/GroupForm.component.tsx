import { Group } from '@admin/models/group.model'
import {
  useCreateGroupMutation,
  useUpdateGroupMutation,
} from '@admin/services/group.service'
import { IGroupForm } from '@admin/types/form.type'
import { LoadingButton } from '@mui/lab'
import {
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  Paper,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import { capitalize } from 'lodash'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

import { useInjection } from '@polyflix/di'

import { Endpoint } from '@core/constants/endpoint.constant'
import {
  getCommonSubmitButtonProps,
  getCommonTextFieldProps,
} from '@core/helpers/form.helper'
import { SnackbarService } from '@core/services/snackbar.service'
import { CrudAction } from '@core/types/http.type'

import { User } from '@users/models/user.model'
import { useGetUsersQuery } from '@users/services/user.service'

import { MembersList } from '../MembersList.component'
import { StyledMenuItem, StyledOutlinedInput } from './GroupForm.style'
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
      snackbarService.createSnackbar(e.data.statusText, { variant: 'error' })
    }
  }
  const displayUserById = (id: string) => {
    const user = users?.data.find((u: User) => u.id === id)
    if (!user) {
      return 'N/A'
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
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={Boolean(errors.owner)}
                        disabled={isUpdate}
                      >
                        <InputLabel id="owner">
                          {t('groups.forms.create-update.placeholder.owner')}
                        </InputLabel>
                        <Select
                          {...field}
                          input={<StyledOutlinedInput label="owner" />}
                          labelId="owner"
                          renderValue={(selected) => (
                            <Box
                              sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 0.5,
                              }}
                            >
                              {displayUserById(selected)}
                            </Box>
                          )}
                        >
                          {users?.data?.map((user) => (
                            <StyledMenuItem key={user.id} value={user.id}>
                              <GroupSelectItem key={user.id} user={user} />
                            </StyledMenuItem>
                          ))}
                        </Select>
                        {Boolean(errors.owner) && (
                          <FormHelperText>
                            {t(
                              'groups.forms.create-update.validation.required'
                            )}
                          </FormHelperText>
                        )}
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller
                    control={control}
                    name="members"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormControl fullWidth error={Boolean(errors.members)}>
                        <InputLabel id="members">
                          {t('groups.forms.create-update.placeholder.members')}
                        </InputLabel>
                        <Select
                          {...field}
                          input={<StyledOutlinedInput label="members" />}
                          labelId="members"
                          multiple
                          renderValue={(selected) => (
                            <Box
                              sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 0.5,
                              }}
                            >
                              {selected
                                .map((userId) => displayUserById(userId))
                                .join(', ')}
                            </Box>
                          )}
                        >
                          {users?.data?.map((user) => (
                            <StyledMenuItem key={user.id} value={user.id}>
                              <GroupSelectItem key={user.id} user={user} />
                            </StyledMenuItem>
                          ))}
                        </Select>
                        {Boolean(errors.members) && (
                          <FormHelperText>
                            {t(
                              'groups.forms.create-update.validation.required'
                            )}
                          </FormHelperText>
                        )}
                      </FormControl>
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
          <Paper variant="outlined">
            <MembersList members={selectedMembers} />
          </Paper>
        </Stack>
      )}
    </>
  )
}
