import ServerAvailability from '@/components/server-availablity';

function Footer() {
  return (
    <footer className="flex w-full flex-col items-center px-3 text-sm">
      <div className="w-full">
        <hr className="border-foreground/10" />
      </div>
      <div className="flex w-full flex-col items-center justify-center py-3.5">
        <ServerAvailability />
      </div>
    </footer>
  );
}

export default Footer;
