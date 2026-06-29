import { useEffect } from 'react';

export default function ChamberMembershipBadge() {
  useEffect(() => {
    // Load the external chamber script
    const script = document.createElement('script');
    script.src = 'https://pickeringtonchamber.chambermaster.com/Content/Script/Member.js';
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => {
      // Create the widget after script loads
      if (typeof window !== 'undefined' && (window as any).MNI?.Widgets?.Member) {
        new (window as any).MNI.Widgets.Member('mni-membership-639171131155364322', {
          member: 4127,
          styleTemplate: '#@id{text-align:center;position:relative}#@id .mn-widget-member-name{font-weight:700}#@id .mn-widget-member-logo{max-width:100%}'
        }).create();
      }
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div id="mni-membership-639171131155364322" className="flex justify-center items-center min-h-20" />
  );
}
