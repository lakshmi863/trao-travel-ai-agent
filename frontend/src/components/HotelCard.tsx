import { Star, MapPin, Wifi, Users, ExternalLink, Crown, Gem, Wallet, Trophy } from 'lucide-react';

interface Hotel {
  name: string;
  tier: 'Budget' | 'Mid-Range' | 'Luxury' | 'Top Pick';
  estimatedCostNightUSD: number;
  rating: string;
  reviewCount?: number;
  location?: string;
  amenities?: string[];
  highlights?: string;
  travelerType?: string;
  bookingUrl?: string;
}

interface HotelCardProps {
  hotel: Hotel;
}

const TIER_CONFIG = {
  'Top Pick': {
    icon: Trophy,
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    border: 'border-amber-500/40 ring-1 ring-amber-500/20',
    iconColor: 'text-amber-400',
    label: 'Top Pick',
  },
  'Luxury': {
    icon: Gem,
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    border: 'border-slate-700/50',
    iconColor: 'text-purple-400',
    label: 'Luxury',
  },
  'Mid-Range': {
    icon: Crown,
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    border: 'border-slate-700/50',
    iconColor: 'text-blue-400',
    label: 'Mid-Range',
  },
  'Budget': {
    icon: Wallet,
    badge: 'bg-green-500/20 text-green-300 border-green-500/40',
    border: 'border-slate-700/50',
    iconColor: 'text-green-400',
    label: 'Budget',
  },
};

function StarRating({ rating }: { rating: string }) {
  const num = parseFloat(rating) || 0;
  const full = Math.floor(num);
  const half = num % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={12}
          className={
            i < full
              ? 'text-amber-400 fill-amber-400'
              : i === full && half
              ? 'text-amber-400 fill-amber-400/50'
              : 'text-slate-600 fill-slate-600'
          }
        />
      ))}
      <span className="text-xs font-bold text-amber-400 ml-0.5">{num.toFixed(1)}</span>
    </div>
  );
}

export default function HotelCard({ hotel }: HotelCardProps) {
  const config = TIER_CONFIG[hotel.tier] ?? TIER_CONFIG['Budget'];
  const TierIcon = config.icon;

  return (
    <div
      className={`relative bg-slate-800/40 border ${config.border} rounded-2xl p-5 flex flex-col gap-4 hover:bg-slate-800/70 transition-all duration-200 group`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${config.badge}`}>
              <TierIcon size={10} />
              {config.label}
            </span>
          </div>
          <h4 className="font-bold text-white text-base leading-snug group-hover:text-blue-300 transition truncate">
            {hotel.name}
          </h4>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xl font-black text-white">${hotel.estimatedCostNightUSD}</p>
          <p className="text-[10px] text-slate-500 font-medium">per night</p>
        </div>
      </div>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-3">
        <StarRating rating={hotel.rating} />
        {hotel.reviewCount && (
          <span className="text-[11px] text-slate-500">
            {hotel.reviewCount.toLocaleString()} reviews
          </span>
        )}
      </div>

      {/* Location */}
      {hotel.location && (
        <div className="flex items-start gap-1.5 text-slate-400">
          <MapPin size={13} className="shrink-0 mt-0.5 text-blue-400" />
          <p className="text-xs leading-relaxed">{hotel.location}</p>
        </div>
      )}

      {/* Highlights */}
      {hotel.highlights && (
        <p className="text-xs text-slate-300 italic border-l-2 border-slate-600 pl-3 leading-relaxed">
          "{hotel.highlights}"
        </p>
      )}

      {/* Amenities */}
      {hotel.amenities && hotel.amenities.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {hotel.amenities.map((amenity, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 text-[10px] bg-slate-700/60 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full font-medium"
            >
              <Wifi size={9} className="text-slate-400" />
              {amenity}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-700/50">
        {hotel.travelerType && (
          <div className="flex items-center gap-1.5 text-slate-400">
            <Users size={12} className="text-indigo-400" />
            <span className="text-[11px] font-medium">{hotel.travelerType}</span>
          </div>
        )}
        {hotel.bookingUrl && (
          <a
            href={hotel.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 px-3 py-1.5 rounded-lg transition-all duration-150"
          >
            Book Now <ExternalLink size={11} />
          </a>
        )}
      </div>
    </div>
  );
}
