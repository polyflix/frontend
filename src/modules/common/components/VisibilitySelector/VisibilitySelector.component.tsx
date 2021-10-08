import { EyeOffIcon, GlobeIcon, LockClosedIcon } from '@heroicons/react/outline'
import { forwardRef, MouseEvent, SVGProps, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Typography } from '../../../ui'
import { WithClassname } from '../../types'
import { Visibility } from '../../types/crud.type'
import { cn } from '../../utils'

type Props = WithClassname & {
  name?: string
  value?: string
}

interface IVisibilityItem {
  icon: (props: SVGProps<SVGSVGElement>) => JSX.Element
  label: string
  value: Visibility
  description: string
  activeClasses?: string
}

export const VisibilitySelector = forwardRef<HTMLInputElement, Props>(
  ({ name = 'visibility', className = '', value }: Props, forwardedRef) => {
    const { t } = useTranslation('resources')

    const items: IVisibilityItem[] = [
      {
        icon: GlobeIcon,
        label: t('visibility.public.label'),
        value: 'public',
        description: t('visibility.public.description'),
        activeClasses: 'text-green-500',
      },
      {
        icon: LockClosedIcon,
        label: t('visibility.protected.label'),
        value: 'protected',
        description: t('visibility.protected.description'),
        activeClasses: 'text-blue-500',
      },
      {
        icon: EyeOffIcon,
        label: t('visibility.private.label'),
        value: 'private',
        description: t('visibility.private.description'),
        activeClasses: 'text-nx-red',
      },
    ]

    const [active, setActive] = useState<string>(value || items[0].value)

    const onClick = (event: MouseEvent<HTMLElement>) => {
      const { currentTarget } = event
      const targetVisibility = currentTarget.getAttribute(
        'data-visibility-target'
      )
      if (!targetVisibility) {
        throw new Error('Missing attribute data-visibility-target.')
      }
      setActive(targetVisibility)
    }

    return (
      <div
        className={cn(
          'text-nx-white item-center text-sm grid gap-4 grid-cols-12',
          className
        )}
      >
        {items.map(
          (
            { value: val, label, description, icon: Icon, activeClasses },
            index
          ) => {
            const isActive = active === val
            const additionalClasses = (isActive && activeClasses) || ''
            return (
              <label
                data-visibility-target={val}
                onClick={onClick}
                key={index}
                className={cn(
                  'col-span-4 transition-all cursor-pointer rounded-md p-4',
                  additionalClasses,
                  isActive ? 'bg-darkgray' : 'opacity-40'
                )}
              >
                <input
                  ref={forwardedRef}
                  type="radio"
                  className="absolute opacity-0"
                  name={name}
                  value={val}
                />
                <div className="ml-2">
                  <div className="flex items-center">
                    <Icon className="w-5 mr-2" />
                    <Typography
                      as="h3"
                      overrideDefaultClasses
                      className={cn('font-bold text-lg')}
                    >
                      {label}
                    </Typography>
                  </div>
                  <Typography as="p" className="mt-3 text-sm text-nx-white">
                    {description}
                  </Typography>
                </div>
              </label>
            )
          }
        )}
      </div>
    )
  }
)
