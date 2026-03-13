import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import type { Venue } from "../schemas/venueSchemas"
import { ExternalLink, MapPin, Users, Star } from "lucide-react"

export function VenueCard({ venue }: { venue: Venue }) {
  const priceDisplay = [
    venue.pricePerDayEur != null && `~€${venue.pricePerDayEur.toLocaleString()}/day`,
    venue.pricePerHourEur != null && `~€${venue.pricePerHourEur.toLocaleString()}/hr`,
  ].filter(Boolean)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle>{venue.name}</CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {venue.city}, {venue.country}
            </CardDescription>
          </div>
          <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {venue.venueType}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-[13px] text-muted-foreground">{venue.description}</p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px]">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            {venue.capacity.toLocaleString()}
          </span>
          {venue.rating != null && (
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-muted-foreground" />
              {venue.rating}/5
            </span>
          )}
          {priceDisplay.length > 0 && (
            <span className="text-muted-foreground">{priceDisplay.join(" · ")}</span>
          )}
        </div>

        {venue.priceNotes && (
          <p className="text-xs text-muted-foreground/70 italic">{venue.priceNotes}</p>
        )}

        {venue.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {venue.amenities.map((amenity) => (
              <span
                key={amenity}
                className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}

        {(venue.websiteUrl || venue.googleMapsUrl) && (
          <div className="flex items-center gap-3">
            {venue.websiteUrl && (
              <a
                href={venue.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[13px] text-foreground underline underline-offset-2 hover:text-foreground/80"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Website
              </a>
            )}
            {venue.googleMapsUrl && (
              <a
                href={venue.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[13px] text-foreground underline underline-offset-2 hover:text-foreground/80"
              >
                <MapPin className="h-3.5 w-3.5" />
                Google Maps
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
