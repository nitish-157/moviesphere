const PROFILE_BASE = "https://image.tmdb.org/t/p/w185";

function CastList({ cast }) {
  if (!cast || cast.length === 0) return null;

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      {cast.slice(0, 12).map((member) => (
        <div key={member.cast_id || member.credit_id} className="flex-shrink-0 w-24 text-center">
          <img
            src={
              member.profile_path
                ? `${PROFILE_BASE}${member.profile_path}`
                : "https://placehold.co/185x278/1B1F29/8A8F98?text=No+Photo"
            }
            alt={member.name}
            loading="lazy"
            className="w-24 h-24 rounded-full object-cover mx-auto bg-cine-surface2"
          />
          <p className="mt-2 text-xs font-medium text-cine-text truncate">{member.name}</p>
          <p className="text-xs text-cine-muted truncate">{member.character}</p>
        </div>
      ))}
    </div>
  );
}

export default CastList;
