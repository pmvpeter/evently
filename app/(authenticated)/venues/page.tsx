import { VenueSearchForm } from "@/features/venues/components/VenueSearchForm"

export default function VenuesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Venue Explorer</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover event venues powered by AI suggestions.
        </p>
      </div>
      <VenueSearchForm />
    </div>
  )
}
