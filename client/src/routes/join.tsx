import { HeaderTitle } from '@/components/header-title';
import { MeetingForm } from '../components/meeting/meeting-form';

function JoinPage() {
  return (
    <div className="h-full p-8">
      <div className="pb-4">
        <HeaderTitle path="/" title="Join a Meeting" />
      </div>
      <MeetingForm />
    </div>
  );
}

export default JoinPage;
