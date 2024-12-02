import ClientSearch from '../../components/ClientSearch'

export default function SearchPage({
  searchParams,
}: {
  searchParams: { query?: string }
}) {
  const initialQuery = searchParams.query || ''
  return <ClientSearch initialQuery={initialQuery} />
}
