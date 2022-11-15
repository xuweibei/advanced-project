import { getIntl } from 'umi'

export function formatMessage({ id, value = {} }: { id: string; value?: { [key: string]: any } }) {
  const intl = getIntl()

  return intl.formatMessage({ id }, value)
}
