
export default function Team() {
  const teamMembers = [
    { name: 'Sarah Johnson', role: 'Owner', email: 'sarah@example.com' },
    { name: 'Michael Chen', role: 'Operations Manager', email: 'michael@example.com' },
    { name: 'Lisa Rodriguez', role: 'Finance Manager', email: 'lisa@example.com' },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const roleColor = (role: string) => {
    if (role.includes('Owner')) return 'bg-emerald-100 text-emerald-700';
    if (role.includes('Manager')) return 'bg-blue-100 text-blue-700';
    return 'bg-stone-100 text-stone-700';
  };

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Team Members</h1>
        <p className="text-stone-600">Your team roster</p>
      </div>

      {teamMembers.length > 0 ? (
        <div className="space-y-4">
          {teamMembers.map((member, i) => (
            <div key={i} className="bg-white rounded-2xl border border-stone-100 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center text-stone-900 font-bold">
                  {getInitials(member.name)}
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900">{member.name}</h3>
                  <p className="text-sm text-stone-600 mt-1">{member.email}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleColor(member.role)}`}>
                {member.role}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
          <p className="text-stone-600 mb-4">No team members configured yet.</p>
          <p className="text-stone-500 text-sm">Your team roster will appear here once configured.</p>
        </div>
      )}
    </div>
  );
}
